<script setup>
import { ref, reactive } from 'vue';
import { mdiGlobeModel, mdiPlus, mdiTableOff } from '@mdi/js';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import { useMainStore } from '@/stores/main';
import categoriesService from '@/services/categories.service'
import ratesService from '@/services/rates.service'
import FormField from "@/components/FormField.vue"; 
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import RateTable from "./RateTable.vue";
const mainStore = useMainStore();
const page = ref(1);
const perPage = ref(10);
const customElementsForm = reactive({
    switch: [],
});
const getRates = (data) => {
  ratesService.index(data).then(response => {        
    mainStore.rates = response
    page.value = response.page
    perPage.value = response.perPage
  })
}

getRates({page:page.value})

const onChangeSwtch = () => {
  endPointUse(page.value)
}

const onChangePage = (page) => {
    endPointUse({page})
}

const onSortPage = (sortBy,sortDesc) => {
    endPointUseSort({ sortBy, sortDesc });
}

const getRatesDelete = (data) => {
  ratesService.getDelete(data).then(response => {
      mainStore.rates = response
      page.value = response.page
      perPage.value = response.perPage
    })
}
const endPointUse = (page) => {
    customElementsForm.switch.length === 0 ? getRates(page) :
    getRatesDelete(page)
}

const endPointUseSort = (sort) => {
    customElementsForm.switch.length === 0 
    ? getRates(sort) 
    : getRatesDelete(sort)
}

</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiGlobeModel"
        :title="$t('message.rate.rates')"
      >
      <BaseButton
          to="rates/create"
          :icon="mdiPlus"
          :label="$t('message.add_new')"
          color="success"
          small
        />
      </SectionTitleLineWithButton>

      <FormField label="">
        <FormCheckRadioGroup 
            v-model="customElementsForm.switch" 
            name="sample-switch" 
            type="switch"
            :options="{ one: 'Mostrar registros eliminados' }" @change="onChangeSwtch" />
      </FormField>

      <SectionTitleLineWithButton v-if="!mainStore?.rates" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="!mainStore?.rates" color="danger" :icon="mdiTableOff">
        <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
      </NotificationBar>

      <CardBox  v-if="mainStore?.rates?.tasas?.length" class="mb-6" has-table>
        <RateTable @changePage="onChangePage" @sort="onSortPage"/>
      </CardBox>

      <CardBox v-else>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>