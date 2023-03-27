<script setup>
import { ref } from 'vue';
import { mdiAlertCircle, mdiGlobeModel, mdiMap, mdiPlus, mdiTableBorder, mdiTableOff } from '@mdi/js';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import CountryTable from './CountryTable.vue';
import { useMainStore } from '@/stores/main';
import countriesService from '@/services/countries.service'

const mainStore = useMainStore();
const page = ref(1);
const perPage = ref(10);
const countries = ref([]);
const getCountries = (data) => {
  countriesService.index(data).then(response => {
    mainStore.countries = response
    page.value = response.page
    perPage.value = response.perPage
  })
}

getCountries({page: page.value})

const onChangePage = (page) => {
  console.log('changed')
  getCountries({page})
}

const onSortPage = (sortBy,sortDesc) => {
  console.log(sortBy,sortDesc)
  getCountries({sortBy,sortDesc});
}

</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiGlobeModel"
        :title="$t('message.country.countries')"
      >
      <BaseButton
          to="countries/create"
          :icon="mdiPlus"
          label="Add new"
          color="success"
          small
        />
      </SectionTitleLineWithButton>

      <SectionTitleLineWithButton v-if="!mainStore?.countries" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="!mainStore?.countries" color="danger" :icon="mdiTableOff">
        <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
      </NotificationBar>

      <CardBox  v-if="mainStore?.countries?.paises?.length" class="mb-6" has-table>
        <CountryTable @changePage="onChangePage" @sort="onSortPage"/>
      </CardBox>

      <CardBox v-else>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
