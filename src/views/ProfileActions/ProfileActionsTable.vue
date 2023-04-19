<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/stores/main";
import { mdiFileEdit, mdiTrashCan } from "@mdi/js";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import profileActionsService from '@/services/profileActions.service'

defineProps({
  checkable: Boolean,
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.profileActions.accionesPerfiles);
const total = computed(() => mainStore.profileActions.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.profileActions.perPage);

const currentPage = computed(() => mainStore.profileActions.page);

const checkedRows = ref([]);

const selectedAccionPerfiles = ref([]);

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
  router.push({name: 'ProfileActionsUpdate', params: {id}})
}

const selectedItem = (accionPerfil) => selectedAccionPerfiles.value = accionPerfil

const dataName = () => {
  const { descripcion } = selectedAccionPerfiles.value
  return descripcion
}
const successMessage = t("message.profileAction.deleted.success")

const deleteItem = async () => { 
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.profileAction.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedAccionPerfiles.value
  return profileActionsService.delete(_id);
}
</script>

<template>

<CardBoxModal 
    v-model="isModalDangerActive" 
    title="Please confirm"
     button="danger" 
     @confirm="deleteItem" 
     has-cancel>
    <strong>{{ $t('message.profileAction.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.profileAction.code') }}</th>
        <th @click="sort('descripcion')">{{ $t('message.profileAction.description') }}</th>
        <th @click="sort('estado')">{{ $t('message.profileAction.status') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(accionPerfil, index) in itemsPaginated" 
          :key="accionPerfil._id" @click="selectedItem(accionPerfil)">        
        <td :data-label="$t('message.profileAction.code')">
          {{ accionPerfil.codigo }} 
        </td>
        <td :data-label="$t('message.profileAction.description')">
          {{ accionPerfil.descripcion }}
        </td>
        <td :data-label="$t('message.profileAction.status')">
          {{ $t(`message.profileAction.statuses.${listStatusOption(accionPerfil.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiFileEdit"
              small
              @click="edit(accionPerfil._id)"
            />

            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
              v-show="accionPerfil.estado !== 2"
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