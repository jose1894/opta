<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { mdiFileEdit, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";

defineProps({
  checkable: Boolean,
});

const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.businessUnit.unidadesNegocio);
const total = computed(() => mainStore.businessUnit.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.businessUnit.perPage);

const currentPage = computed(() => mainStore.businessUnit.page);

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

const checked = (isChecked, bussinesUnit) => {
  if (isChecked) {
    checkedRows.value.push(bussinesUnit);
  } else {
    checkedRows.value = remove(
      checkedRows.value,
      (row) => row.id === bussinesUnit.id
    );
  }
};

const emit = defineEmits(['changePage', 'confirm', 'sort'])

const confirmAction = () => {
  console.log('confirm')
  emit('confirm')
}

const changePage = (page) => {
  emit('changePage', page)
}

const edit = (id) => {
  router.push({name: 'BusinessUnitUpdate', params: {id}})
}
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Sample modal">
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <CardBoxModal
    v-model="isModalDangerActive"
    title="Please confirm"
    button="danger"
    has-cancel
  >
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
      {{ checkedRow.name }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.bussinesUnit.code') }}</th>        
        <th @click="sort('nambre')">{{ $t('message.bussinesUnit.name') }}</th>
        <th @click="sort('siglas')">{{ $t('message.bussinesUnit.acronyms') }}</th>
        <th @click="sort('estado')">{{ $t('message.bussinesUnit.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(bussinesUnit, index) in itemsPaginated" :key="bussinesUnit._id">
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, bussinesUnit)"
        />
        <td :data-label="$t('message.bussinesUnit.code')">
          {{ bussinesUnit.codigo }} 
        </td>
        <td :data-label="$t('message.bussinesUnit.name')">
          {{ bussinesUnit.nombre }}
        </td>
        <td :data-label="$t('message.bussinesUnit.acronyms')">
          {{ bussinesUnit.siglas }}
        </td>
        <td :data-label="$t('message.branch.status')">
          {{ $t(`message.bussinesUnit.statuses.${listStatusOption(bussinesUnit.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiFileEdit"
              small
              @click="edit(bussinesUnit._id)"
            />

            <BaseButton
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