<script setup>
import { ref } from 'vue';
import {  mdiGlobeModel, mdiPlus, mdiTableOff } from '@mdi/js';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import CurrencyTable from './CurrencyTable.vue';
import { useMainStore } from '@/stores/main';
import currenciesService from '@/services/currencies.service'

const mainStore = useMainStore();
const page = ref(1);
const perPage = ref(10);
const currencies = ref([]);
const getCurrencies = (data) => {
    currenciesService.index(data).then(response => {        
    mainStore.currencies = response
    page.value = response.page
    perPage.value = response.perPage
    console.log(response, mainStore.currencies)
  })
}

getCurrencies({page: page.value})

const onChangePage = (page) => {
  getCurrencies({page})
}

const onSortPage = (sortBy,sortDesc) => {
  getCurrencies({sortBy,sortDesc});
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

      <SectionTitleLineWithButton v-if="!mainStore?.currencies" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="!mainStore?.currencies" color="danger" :icon="mdiTableOff">
        <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
      </NotificationBar>

      <CardBox  v-if="mainStore?.currencies?.monedas?.length" class="mb-6" has-table>
        <CurrencyTable @changePage="onChangePage" @sort="onSortPage"/>
      </CardBox>

      <CardBox v-else>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>