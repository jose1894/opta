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
import FormField from "@/components/FormField.vue"; 
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import CategoryTable from "./CategoryTable.vue";
import Breadcrumb from '@/components/Breadcrumb.vue';

const breadcrumbs = ref( [
        { name: 'Inicio' },
])
const mainStore = useMainStore();
const page = ref(1);
const perPage = ref(10);
const customElementsForm = reactive({
    switch: [],
});

const customCheckDelete = ref(false);

const onChangeSwtch = () => { 
  endPointUse(page.value)
  customCheckDelete.value = customElementsForm.switch.length === 0 ? false : true
}

const getCategories = (data) => {
  categoriesService.index(data).then(response => {        
    mainStore.categories = response
    page.value = response.page
    perPage.value = response.perPage
  })
}

getCategories({page:page.value})

const onChangePage = (page) => {
    endPointUse({page})
}

const onSortPage = (sortBy,sortDesc) => {
    endPointUseSort({sortBy,sortDesc});
}

const getCategoriesDelete = (data) => {
  categoriesService.getDelete(data).then(response => {
      mainStore.categories = response
      page.value = response.page
      perPage.value = response.perPage
    })
}
const endPointUse = (page) => {
    customElementsForm.switch.length === 0 ? getCategories(page) :
    getCategoriesDelete(page)
}

const endPointUseSort = (sort) => {
    customElementsForm.switch.length === 0 
    ? getCategories(sort) 
    : getCategoriesDelete(sort)
} 

</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiGlobeModel"
        :title="$t('message.category.categories')"
      >
      <BaseButton
          :to="{name: 'CategoriesCreate'}"
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

      <SectionTitleLineWithButton v-if="!mainStore?.categories" :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar v-if="!mainStore?.categories" color="danger" :icon="mdiTableOff">
        <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
      </NotificationBar>

      <CardBox  v-if="mainStore?.categories?.categorias?.length" class="mb-6" has-table>
        <CategoryTable :checkDelete="customCheckDelete" @changePage="onChangePage" @sort="onSortPage"/>
      </CardBox>

      <CardBox v-else>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>