<script setup>
import { ref, reactive } from 'vue';
import CardBox from '@/components/CardBox.vue';
import CountryTable from './CountryTable.vue';
import { useMainStore } from '@/stores/main';
import FormField from "@/components/FormField.vue";
import BaseButton from '@/components/BaseButton.vue';
import SectionMain from '@/components/SectionMain.vue';
import countriesService from '@/services/countries.service'
import FormControl from '@/components/FormControl.vue';
import { mdiGlobeModel, mdiPlus, mdiTableOff, mdiListStatus } from '@mdi/js';
import NotificationBar from '@/components/NotificationBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue'
import { useI18n } from "vue-i18n";
import InputSearch from "@/components/inputSearch.vue";
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';


const breadcrumbs = ref([
  { name: 'Inicio' },
])

const mainStore = useMainStore();
const page = ref(1);
const { t } = useI18n();
const perPage = ref(10);
const countries = ref([]);

const selectOptions = [
  { id: 1, label: t('message.country.statuses.active') },
  { id: 0, label: t('message.country.statuses.inactive') },
];

const filtros = ref({ 'codigo': '', 'nombre' : '' })

const paramEstado = ref(-1)
const valueSelectEstado = ref(selectOptions[0])

const customElementsForm = reactive({
  switch: [],
});

const customCheckDelete = ref(false);

const onChangeSwtch = () => {
  endPointUse(page.value)
  customCheckDelete.value = customElementsForm.switch.length === 0 ? false : true
}

const getCountries = async (data) => {
  await countriesService.index(data).then(response => {
    mainStore.countries = response
    page.value = response.page
    perPage.value = response.perPage
  })
}

getCountries({ page: page.value })

const onSearchData = (queryParams=[]) => {
  let data = {
    page: page.value,
    q: queryParams
  }
  if(paramEstado.value !== -1) {
    data = {
      ...data,
      estado: paramEstado.value 
    }
  }
  customElementsForm.switch.length === 0 
  ? getCountries(data)
  : getCountriesDelete(data)
}

const onChangePage = (page) => {
  endPointUse({ page })
}

const onSortPage = (sortBy, sortDesc) => {
  endPointUseSort({ sortBy, sortDesc });
}

const getCountriesDelete = async (data) => {
  await countriesService.getDelete(data).then(response => {
    mainStore.countries = response
    page.value = response.page
    perPage.value = response.perPage
  })
}

const endPointUse = (page) => {
  customElementsForm.switch.length === 0
    ? getCountries(page)
    : getCountriesDelete(page)
}

const endPointUseSort = (sort) => {
  customElementsForm.switch.length === 0
    ? getCountries(sort) :
    getCountriesDelete(sort)
}

const searchFunction = async searchTerm => {
  const searchText = (searchTerm === "") ? "default" : searchTerm;
  let param = []
  if (searchText !== "default") {
    filtros.value.codigo = filtros.value.nombre = searchText
    let arrayParam = [filtros.value]
    param = arrayParam
  }
  onSearchData(param)
};

const filterEstado = () => {
  const { id } = valueSelectEstado.value
  paramEstado.value = id
  onSearchData()
}
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiGlobeModel" :title="$t('message.country.countries')">
        <BaseButton :to="{ name: 'CountriesCreate' }" :icon="mdiPlus" :label="$t('message.add_new')" color="success"
          small />
      </SectionTitleLineWithButton>  
      <Breadcrumb :items="breadcrumbs" />    
      <div class="grid md:grid-cols-2 gap-4">
        <FormField label="Buscar">
          <InputSearch 
            :placeholder="'Buscar...'" 
            :search-function="searchFunction" 
            :debounce-time="500">
          </InputSearch>
        </FormField>
        <FormField :label="$t('message.country.status')">
          <FormControl 
            v-model="valueSelectEstado" 
            :icon="mdiListStatus" 
            :options="selectOptions" 
            @onSelectChange="filterEstado"/>
        </FormField>
      </div>
      
      <FormField label="">
        <FormCheckRadioGroup v-model="customElementsForm.switch" name="sample-switch" type="switch"
          :options="{ one: 'Mostrar registros eliminados' }" @change="onChangeSwtch" />
      </FormField>

      <SectionTitleLineWithButton v-if="!mainStore?.countries" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="!mainStore?.countries" color="danger" :icon="mdiTableOff">
        <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
      </NotificationBar>

      <CardBox v-if="mainStore?.countries?.paises?.length" class="mb-6" has-table>
        <CountryTable :checkDelete="customCheckDelete" @changePage="onChangePage" @sort="onSortPage" />
      </CardBox>

      <CardBox v-else>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
