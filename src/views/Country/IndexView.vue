<script setup>
import { ref, reactive } from 'vue';
import CardBox from '@/components/CardBox.vue';
import CountryTable from './CountryTable.vue';
import { useMainStore } from '@/stores/main';
import FormField from "@/components/FormField.vue";
import BaseButton from '@/components/BaseButton.vue';
import SectionMain from '@/components/SectionMain.vue';
import countriesService from '@/services/countries.service'
import { mdiGlobeModel, mdiPlus, mdiTableOff } from '@mdi/js';
import NotificationBar from '@/components/NotificationBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';


const breadcrumbs = ref( [
        { name: 'Inicio' },
])
const mainStore = useMainStore();
const page = ref(1);
const perPage = ref(10);
const countries = ref([]);

const customElementsForm = reactive({
  switch: [],
});
const getCountries = (data) => {
  countriesService.index(data).then(response => {
    mainStore.countries = response
    page.value = response.page
    perPage.value = response.perPage
  })
}

getCountries({ page: page.value })

const onChangePage = (page) => {
  endPointUse({ page })
}

const onSortPage = (sortBy, sortDesc) => {
  endPointUseSort({ sortBy, sortDesc });
}

const onChangeSwtch = () => {
  endPointUse({ page: page.value })
}

const getCountriesDelete = (data) => {
  countriesService.getDelete(data).then(response => {
    mainStore.countries = response
    page.value = response.page
    perPage.value = response.perPage
  })
}

const endPointUse = (page) => {
  customElementsForm.switch.length === 0 ? getCountries({ page }) :
    getCountriesDelete({ page })
}

const endPointUseSort = (sortBy, sortDesc) => {
  customElementsForm.switch.length === 0 ? getCountries({ sortBy, sortDesc }) :
    getCountriesDelete({ sortBy, sortDesc })
}



</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiGlobeModel" :title="$t('message.country.countries')">
        <BaseButton :to="{name: 'CountriesCreate'}" :icon="mdiPlus" :label="$t('message.add_new')" color="success" small />
      </SectionTitleLineWithButton>

      <Breadcrumb :items="breadcrumbs" />

      <FormField label="">
        <FormCheckRadioGroup v-model="customElementsForm.switch" name="sample-switch" type="switch"
          :options="{ one: 'Mostrar registros eliminados' }" @change="onChangeSwtch" />
      </FormField>

      <SectionTitleLineWithButton v-if="!mainStore?.countries" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="!mainStore?.countries" color="danger" :icon="mdiTableOff">
        <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
      </NotificationBar>

      <CardBox v-if="mainStore?.countries?.paises?.length" class="mb-6" has-table>
        <CountryTable @changePage="onChangePage" @sort="onSortPage" />
      </CardBox>

      <CardBox v-else>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
