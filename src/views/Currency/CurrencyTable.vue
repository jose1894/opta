<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { useI18n } from "vue-i18n";
import { mdiFileEdit, mdiTrashCan } from "@mdi/js";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import currenciesService from '@/services/currencies.service';

defineProps({
  checkable: Boolean,
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();
const selectedCurrency = ref([]);

const mainStore = useMainStore();

const items = computed(() => mainStore.currencies.monedas);
const total = computed(() => mainStore.currencies.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.currencies.perPage);

const currentPage = computed(() => mainStore.currencies.page);

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

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const emit = defineEmits(['changePage', 'confirm', 'sort'])

const changePage = (page) => {
  emit('changePage', page)
}

const edit = (id) => {
  router.push({name: 'CurrenciesUpdate', params: {id}})
}

const selectedItem = (currency) => selectedCurrency.value = currency

const dataName = () => {
  const { nombre } = selectedCurrency.value
  return nombre
}
const successMessage = t("message.currencies.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.currencies.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedCurrency.value
  console.log(_id)
  return currenciesService.delete(_id);
}
</script>

<template>
  <CardBoxModal 
      v-model="isModalDangerActive" 
      title="Please confirm" 
      button="danger" 
      @confirm="deleteItem" 
      has-cancel>
      <strong>{{ $t('message.currencies.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.currencies.code') }}</th>
        <th @click="sort('nambre')">{{ $t('message.currencies.name') }}</th>
        <th @click="sort('estado')">{{ $t('message.currencies.status') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(currency, index) in itemsPaginated" :key="currency._id" @click="selectedItem(currency)">
        <td :data-label="$t('message.currencies.code')">
          {{ currency.codigo }} 
        </td>
        <td :data-label="$t('message.currencies.name')">
          {{ currency.nombre }}
        </td>
        <td :data-label="$t('message.currencies.status')">
          {{ $t(`message.currencies.statuses.${listStatusOption(currency.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiFileEdit"
              small
              @click="edit(currency._id)"
            />

            <BaseButton
              v-show="currency.estado !== 2"
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
            />
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