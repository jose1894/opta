<script setup>
import { computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { useI18n } from "vue-i18n";
import { mdiFileEdit, mdiRestore, mdiTrashCan } from "@mdi/js";
import { useToast } from 'vue-toastification';
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import CountryFlag from 'vue-country-flag-next'
import countriesService from '@/services/countries.service';

defineProps({
  checkable: Boolean,
  checkDelete: Boolean, 
});

const { t } = useI18n();
const toast = useToast()
const router = useRouter();

const mainStore = useMainStore();

const items = computed(() => mainStore.countries.paises);
const total = computed(() => mainStore.countries.total)

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = computed(() => mainStore.countries.perPage);

const currentPage = computed(() => mainStore.countries.page);

const selectedCountry = ref([]);

const itemsPaginated = computed(() =>
  items.value
);

const listStatusOption = (status = '') => {
  const statuses = { 0: 'inactive', 1: 'active', 2: 'deleted' };
  return statuses[status];
}
/* Sorting */
const currentSort = 'nombre';
const sortDesc = ref(false);

const sort = (s) => {
  sortDesc.value = !sortDesc.value;
  emit('sort', s, sortDesc.value);
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
  router.push({ name: 'CountriesUpdate', params: { id } })
}

const selectedItem = (country) => selectedCountry.value = country

const dataName = () => {
  const { nombre } = selectedCountry.value
  return nombre
}
const successMessage = t("message.country.deleted.success")

const deleteItem = async () => {
  action()
    .then(() => {
      toast.success(successMessage);
      emit('changePage', currentPage.value)
    })
    .catch(err => {
      toast.error(`${t("message.country.deleted.error")} ${err?.response?.data.msg}`)
    })
};

const action = () => {
  const { _id } = selectedCountry.value
  return countriesService.delete(_id);
}

const activateItem = () => {
  const { _id } = selectedCountry.value
  countriesService.restore(_id).then(() => {
      toast.success(t("message.country.restore.success"));
      emit('changePage', currentPage.value)      
    })
    .catch(err => {
      toast.error(`${t("message.country.restore.error")} ${err?.response?.data.msg}`)
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
    <strong>{{ $t('message.country.deleted.question') }} <b> {{ dataName() }} </b></strong> ?
  </CardBoxModal>

  <CardBoxModal 
    v-model="isModalActive" 
    :title="$t('message.pleaseConfirm')"
    @confirm="activateItem">
    <strong>{{ $t('message.country.restore.question') }} <b> {{ dataName() }} </b></strong> ?   
  </CardBoxModal>
  <table>
    <thead>
      <tr>
        <th @click="sort('codigo')">{{ $t('message.country.code') }}</th>
        <th @click="sort('nombre')">{{ $t('message.country.name') }}</th>
        <th @click="sort('estado')">{{ $t('message.country.status') }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(country, index) in itemsPaginated" :key="country._id" @click="selectedItem(country)">
        <td :data-label="$t('message.country.code')">
          <country-flag :country='country.codigo' size='normal' />&nbsp;
          {{ country.codigo }}
        </td>
        <td :data-label="$t('message.country.name')">
          {{ country.nombre }}
        </td>
        <td :data-label="$t('message.country.status')">
          {{ $t(`message.country.statuses.${listStatusOption(country.estado)}`) }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              v-show="checkDelete && country.estado === 2"
              color="success"
              :icon="mdiRestore"
              :messageTooltip="t('message.restore')"
              small
              @click="isModalActive = true"
            />

            <BaseButton
              v-show="!checkDelete && country.estado !== 2"
              color="info"
              :icon="mdiFileEdit"
              :messageTooltip="t('message.edit')"
              small
              @click="edit(country._id)"
            />

            <BaseButton 
              v-show="!checkDelete && country.estado !== 2" 
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
        <BaseButton v-for="page in pagesList" :key="page" :active="page === (currentPage - 1)" :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="changePage(page + 1)" />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
<style scoped>
label {
  display: none;
}
</style>
