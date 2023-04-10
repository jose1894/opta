<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { mdiEye, mdiFileEdit, mdiTrashCan } from "@mdi/js";
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

const items = computed(() => mainStore.jobPositions?.cargos);
const total = computed(() => mainStore.jobPositions.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.jobPositions.perPage);

const currentPage = computed(() => mainStore.jobPositions.page);

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

const checked = (isChecked, cargo) => {
  if (isChecked) {
    checkedRows.value.push(cargo);
  } else {
    checkedRows.value = remove(
      checkedRows.value,
      (row) => row.id === cargo.id
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
  router.push({name: 'CargosUpdate', params: {id}})
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
        <th @click="sort('codigo')">{{ $t('message.cargo.code') }}</th>
        <th @click="sort('nambre')">{{ $t('message.cargo.name') }}</th>
        <th @click="sort('estado')">{{ $t('message.cargo.status') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(cargo, index) in itemsPaginated" :key="cargo._id">
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, cargo)"
        />
        <td :data-label="$t('message.cargo.code')">
          {{ cargo.codigo }} 
        </td>
        <td :data-label="$t('message.cargo.name')">
          {{ cargo.nombre }}
        </td>
        <td :data-label="$t('message.cargo.status')">
          {{ $t(`message.cargo.statuses.${listStatusOption(cargo.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiFileEdit"
              small
              @click="edit(cargo._id)"
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