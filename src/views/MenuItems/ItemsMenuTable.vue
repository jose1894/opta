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
import itemsMenuService from '@/services/itemsMenu.service'

defineProps({
  checkable: Boolean,
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.itemsMenu.menu);
const total = computed(() => mainStore.itemsMenu.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.itemsMenu.perPage);

const currentPage = computed(() => mainStore.itemsMenu.page);

const checkedRows = ref([]);

const selectedItemMenu = ref([]);

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
  router.push({name: 'ItemsMenuUpdate', params: {id}})
}

const selectedItem = (itemMenu) => selectedItemMenu.value = itemMenu

const dataName = () => {
  const { descripcion } = selectedItemMenu.value
  return descripcion
}
const successMessage = t("message.itemMenu.deleted.success")

const deleteItem = async () => { 
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.itemMenu.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedItemMenu.value
  return itemsMenuService.delete(_id);
}
</script>

<template>

<CardBoxModal 
    v-model="isModalDangerActive" 
    title="Please confirm"
     button="danger" 
     @confirm="deleteItem" 
     has-cancel>
    <strong>{{ $t('message.itemMenu.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.itemMenu.code') }}</th>
        <th @click="sort('descripcion')">{{ $t('message.itemMenu.description') }}</th>
        <th @click="sort('estado')">{{ $t('message.itemMenu.status') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(itemMenu, index) in itemsPaginated" 
          :key="itemMenu._id" @click="selectedItem(itemMenu)">        
        <td :data-label="$t('message.itemMenu.code')">
          {{ itemMenu.codigo }} 
        </td>
        <td :data-label="$t('message.itemMenu.description')">
          {{ itemMenu.descripcion }}
        </td>
        <td :data-label="$t('message.itemMenu.status')">
          {{ $t(`message.itemMenu.statuses.${listStatusOption(itemMenu.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiFileEdit"
              small
              @click="edit(itemMenu._id)"
            />

            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
              v-show="itemMenu.estado !== 2"
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