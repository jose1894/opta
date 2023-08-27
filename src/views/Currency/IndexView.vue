<script setup>
import { ref, reactive } from 'vue';
import {  mdiGlobeModel, mdiPlus, mdiTableOff } from '@mdi/js';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import FormField from "@/components/FormField.vue";
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import Breadcrumb from '@/components/Breadcrumb.vue'
import CurrencyTable from './CurrencyTable.vue';
import { useMainStore } from '@/stores/main';
import currenciesService from '@/services/currencies.service'
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";

const mainStore = useMainStore();
const page = ref(1);
const perPage = ref(10);
const customElementsForm = reactive({
  switch: [],
});

const customCheckDelete = ref(false);

const breadcrumbs = ref( [
        { name: 'Inicio' },
])

const getCurrencies = (data) => {
  currenciesService.index(data).then(response => {        
    mainStore.currencies = response
    page.value = response.page
    perPage.value = response.perPage
  })
}

getCurrencies({page: page.value})

const onChangePage = (page) => {
  endPointUse({page})
}

const onSortPage = (sortBy,sortDesc) => {
  endPointUseSort({ sortBy, sortDesc });
}

const onChangeSwtch = () => { 
  endPointUse({ page: page.value })
  customCheckDelete.value = customElementsForm.switch.length === 0 ? false : true
}

const getCurrenciesDelete = (data) => {
  currenciesService.getDelete(data).then(response => {
    mainStore.currencies = response
    page.value = response.page
    perPage.value = response.perPage
  })
}

const endPointUse = (page) => {
  customElementsForm.switch.length === 0 
    ? getCurrencies({ page }) 
    : getCurrenciesDelete({ page })
  
}

const endPointUseSort = (sort) => {
  customElementsForm.switch.length === 0 
    ? getCurrencies(sort) 
    : getCurrenciesDelete(sort)
}


</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      
      <SectionTitleLineWithButton
        :icon="mdiGlobeModel"
        :title="$t('message.currencies.currency')"
      >
      
      <BaseButton
          to="currencies/create"
          :icon="mdiPlus"
          :label="$t('message.add_new')"
          color="success"
          small
        />       
      </SectionTitleLineWithButton>
      <Breadcrumb :items="breadcrumbs" />
      <FormField label="">
        <FormCheckRadioGroup 
            v-model="customElementsForm.switch" 
            name="sample-switch" 
            type="switch"
          :options="{ one: 'Mostrar registros eliminados' }" @change="onChangeSwtch" />
      </FormField>

      <SectionTitleLineWithButton v-if="!mainStore?.currencies" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="!mainStore?.currencies" color="danger" :icon="mdiTableOff">
        <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
      </NotificationBar>

      <CardBox  v-if="mainStore?.currencies?.monedas?.length" class="mb-6" has-table>
        <CurrencyTable :checkDelete ="customCheckDelete" @changePage="onChangePage" @sort="onSortPage"/>
      </CardBox>

      <CardBox v-else>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>