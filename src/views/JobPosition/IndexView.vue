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
import CargoTable from './CargoTable.vue';
import { useMainStore } from '@/stores/main';
import cargosService from '@/services/cargos.service'

const mainStore = useMainStore();
const page = ref(1);
const perPage = ref(10);
const cargos = ref([]);
const getCargos = (data) => {
    cargosService.index(data).then(response => {        
    mainStore.jobPositions = response
    page.value = response.page
    perPage.value = response.perPage
  })
}

getCargos({page: page.value})

const onChangePage = (page) => {
  console.log('changed')
  getCargos({page})
}

const onSortPage = (sortBy,sortDesc) => {
  console.log(sortBy,sortDesc)
  getCargos({sortBy,sortDesc});
}

</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiGlobeModel"
        :title="$t('message.cargo.cargos')"
      >
      <BaseButton
          to="jobPositions/create"
          :icon="mdiPlus"
          :label="$t('message.add_new')"
          color="success"
          small
        />
      </SectionTitleLineWithButton>

      <SectionTitleLineWithButton v-if="!mainStore?.jobPositions" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="!mainStore?.jobPositions" color="danger" :icon="mdiTableOff">
        <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
      </NotificationBar>

      <CardBox  v-if="mainStore?.jobPositions?.cargos?.length" class="mb-6" has-table>
        <CargoTable @changePage="onChangePage" @sort="onSortPage"/>
      </CardBox>

      <CardBox v-else>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>