<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import {  mdiFileEdit, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import statesService from '@/services/states.services';

defineProps({
  checkable: Boolean,
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.states.estados);
const total = computed(() => mainStore.states.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.states.perPage);

const currentPage = computed(() => mainStore.states.page);

const checkedRows = ref([]);

const itemsPaginated = computed(() =>
  items.value
);

const selectedStates = ref([]);

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
  router.push({name: 'StatesUpdate', params: {id}})
}

const selectedItem = (state) => selectedStates.value = state

const dataName = () => {
  const { nombre } = selectedStates.value
  return nombre
}
const successMessage = t("message.state.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.state.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedStates.value
  return statesService.delete(_id);
}
</script>

<template>
  <CardBoxModal 
        v-model="isModalDangerActive" 
        title="Please confirm" 
        button="danger" 
        @confirm="deleteItem" has-cancel>
        <strong>{{ $t('message.state.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>
  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.state.code') }}</th>        
        <th @click="sort('nambre')">{{ $t('message.state.name') }}</th>
        <th @click="sort('codigo')">{{ $t('message.state.country') }}</th>
        <th @click="sort('estado')">{{ $t('message.state.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(state, index) in itemsPaginated" :key="state._id" @click="selectedItem(state)">
        <td :data-label="$t('message.state.code')">
          {{ state.codigo }} 
        </td>       
        <td :data-label="$t('message.state.name')">
          {{ state.nombre }}
        </td>
        <td :data-label="$t('message.state.country')">
          {{ state.pais.nombre }} 
        </td>
        <td :data-label="$t('message.state.status')">
          {{ $t(`message.state.statuses.${listStatusOption(state.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiFileEdit"
              small
              @click="edit(state._id)"
            />

            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
              v-show="state.estado !== 2"
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
