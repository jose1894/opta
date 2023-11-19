<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/stores/main";
import { mdiFileEdit, mdiTrashCan, mdiRestore } from "@mdi/js";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import languagesService from '@/services/languages.service'

defineProps({
  checkable: Boolean,
  checkDelete: Boolean, 
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.languages?.idiomas);
const total = computed(() => mainStore.languages.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.languages.perPage);

const currentPage = computed(() => mainStore.languages.page);

const checkedRows = ref([]);

const selectedLanguages = ref([]);

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
  router.push({name: 'LanguagesUpdate', params: {id}})
}

const selectedItem = (language) => selectedLanguages.value = language

const dataName = () => {
  const { nombre } = selectedLanguages.value
  return nombre
}
const successMessage = t("message.language.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.language.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedLanguages.value
  return languagesService.delete(_id);
}

const activateItem = () => {
  const { _id } = selectedLanguages.value
  
  languagesService.restore(_id).then(() => {
      toast.success(t("message.language.restore.success"));
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.language.restore.error")} ${err?.response?.data.msg}`)
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
    <strong>{{ $t('message.language.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <CardBoxModal 
    v-model="isModalActive" 
    :title="$t('message.pleaseConfirm')"
    @confirm="activateItem">
    <strong>{{ $t('message.language.restore.question') }} <b> {{ dataName() }} </b></strong> ?   
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.language.code') }}</th>
        <th @click="sort('nombre')">{{ $t('message.language.name') }}</th>
        <th @click="sort('estado')">{{ $t('message.language.status') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(language, index) in itemsPaginated" 
          :key="language._id" @click="selectedItem(language)">        
        <td :data-label="$t('message.language.code')">
          {{ language.codigo }} 
        </td>
        <td :data-label="$t('message.language.name')">
          {{ language.nombre }}
        </td>
        <td :data-label="$t('message.language.status')">
          {{ $t(`message.language.statuses.${listStatusOption(language.estado)}`) }}
        </td>        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              v-show="checkDelete && language.estado === 2"
              color="success"
              :icon="mdiRestore"
              :messageTooltip="t('message.restore')"
              small
              @click="isModalActive = true"
            />

            <BaseButton
              v-show="!checkDelete && language.estado !== 2"
              color="info"
              :icon="mdiFileEdit"
              :messageTooltip="t('message.edit')"
              small
              @click="edit(language._id)"
            />

            <BaseButton 
              v-show="!checkDelete && language.estado !== 2" 
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