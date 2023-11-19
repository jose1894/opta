<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { useI18n } from "vue-i18n";
import { mdiFileEdit, mdiRestore, mdiTrashCan } from "@mdi/js";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import expenseService from '@/services/expense.service';

defineProps({
  checkable: Boolean,
  checkDelete: Boolean, 
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.expense.gastos);
const total = computed(() => mainStore.expense.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.expense.perPage);

const currentPage = computed(() => mainStore.expense.page);

const selectedExpense = ref([]);

const checkedRows = ref([]);

const itemsPaginated = computed(() =>
  items.value
);

const listStatusOption = (status = '') => {
  const statuses = {0: 'inactive',1: 'active',2: 'deleted'};
  return statuses[status];
}
/* Sorting */
const currentSort = 'name';
const sortDesc = ref(false);

const sort = (s) => {
  sortDesc.value = !sortDesc.value;
  emit('sort',s, sortDesc.value);
}
/* Sorting */

const numPages = computed(() => Math.ceil(total.value / perPage.value));

const currentPageHuman = computed(() => +currentPage.value);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const emit = defineEmits(['changePage', 'confirm', 'sort'])

const changePage = (page) => {
  emit('changePage', page)
}

const edit = (id) => {
  router.push({name: 'ExpenseUpdate', params: {id}})
}

const selectedItem = (expense) => selectedExpense.value = expense

const dataName = () => {
  const { concepto } = selectedExpense.value
  return concepto
}
const successMessage = t("message.expense.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.expense.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedExpense.value
  return expenseService.delete(_id);
}

const activateItem = () => {
  const { _id } = selectedExpense.value
  
  expenseService.restore(_id).then(() => {
      toast.success(t("message.expense.restore.success"));
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.expense.restore.error")} ${err?.response?.data.msg}`)
    });
}
</script>

<template>
  <CardBoxModal 
      v-model="isModalDangerActive" 
      :title="$t('message.pleaseConfirm')" 
      button="danger" 
      @confirm="deleteItem" 
      has-cancel>
    <strong>{{ $t('message.expense.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <CardBoxModal 
    v-model="isModalActive" 
    :title="$t('message.pleaseConfirm')"
    @confirm="activateItem">
    <strong>{{ $t('message.expense.restore.question') }} <b> {{ dataName() }} </b></strong> ?   
  </CardBoxModal>
  
  <table>
    <thead>
      <tr>
        <th @click="sort('concepto')">{{ $t('message.expense.concept') }}</th> 
        <th @click="sort('estado')">{{ $t('message.expense.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(expense, index) in itemsPaginated" :key="expense._id" @click="selectedItem(expense)">
        <td :data-label="$t('message.expense.concept')">
          {{ expense.concepto }} 
        </td>
        <td :data-label="$t('message.expense.status')">
          {{ $t(`message.expense.statuses.${listStatusOption(expense.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              v-show="checkDelete && expense.estado === 2"
              color="success"
              :icon="mdiRestore"
              :messageTooltip="t('message.restore')"
              small
              @click="isModalActive = true"
            />

            <BaseButton
              v-show="!checkDelete && expense.estado !== 2"
              color="info"
              :icon="mdiFileEdit"
              :messageTooltip="t('message.edit')"
              small
              @click="edit(expense._id)"
            />

            <BaseButton 
              v-show="!checkDelete && expense.estado !== 2" 
              color="danger" 
              :icon="mdiTrashCan"
              :messageTooltip="t('message.delete')" 
              small 
              @click="isModalDangerActive = true" />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === (currentPage-1)"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="changePage(page+1)"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>