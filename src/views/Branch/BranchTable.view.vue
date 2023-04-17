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
import branchesService from '@/services/branches.service';

defineProps({
  checkable: Boolean,
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.branches.sucursales);
const total = computed(() => mainStore.branches.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.branches.perPage);

const currentPage = computed(() => mainStore.branches.page);

const checkedRows = ref([]);

const selectedBranch = ref([]);

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
  router.push({name: 'BranchesUpdate', params: {id}})
}

const selectedItem = (country) => selectedBranch.value = country

const dataName = () => {
  const { nombre } = selectedBranch.value
  return nombre
}
const successMessage = t("message.branch.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.branch.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedBranch.value
  return branchesService.delete(_id);
}
</script>

<template>
  <CardBoxModal 
      v-model="isModalDangerActive" 
      title="Please confirm" 
      button="danger" 
      @confirm="deleteItem" 
      has-cancel>
    <strong>{{ $t('message.branch.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.branch.code') }}</th>        
        <th @click="sort('nambre')">{{ $t('message.branch.name') }}</th>
        <th @click="sort('siglas')">{{ $t('message.branch.acronyms') }}</th>
        <th @click="sort('estado')">{{ $t('message.branch.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(branch, index) in itemsPaginated" :key="branch._id" @click="selectedItem(branch)">
        <td :data-label="$t('message.branch.code')">
          {{ branch.codigo }} 
        </td>
        <td :data-label="$t('message.branch.name')">
          {{ branch.nombre }}
        </td>
        <td :data-label="$t('message.branch.acronyms')">
          {{ branch.siglas }}
        </td>
        <td :data-label="$t('message.branch.status')">
          {{ $t(`message.branch.statuses.${listStatusOption(branch.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiFileEdit"
              small
              @click="edit(branch._id)"
            />

            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
              v-show="branch.estado !== 2"
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