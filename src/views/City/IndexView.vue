<script setup>
    import { ref, reactive } from 'vue';
    import { mdiGlobeModel, mdiPlus } from '@mdi/js';  
    import CardBox from '@/components/CardBox.vue';      
    import BaseButton from '@/components/BaseButton.vue';
    import SectionMain from '@/components/SectionMain.vue';
    import NotificationBar from '@/components/NotificationBar.vue';
    import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
    import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
    import CityTable from './CityTable.vue';
    import { useMainStore } from '@/stores/main';
    import cityService from '@/services/cities.service'
    import FormField from "@/components/FormField.vue";
    import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
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
    const getCities = (data) => {
        cityService.index(data).then(response => {
            mainStore.cities = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }

    getCities({page:page.value})

    const customCheckDelete = ref(false);

    const onChangeSwtch = () => {
        endPointUse(page.value)
        customCheckDelete.value = customElementsForm.switch.length === 0 ? false : true
    }

    const onChangePage = (page) => {
        endPointUse({page})
    }

    const onSortPage = (sortBy,sortDesc) => {
        endPointUseSort({sortBy,sortDesc});
    }

    const getCitiesDelete = (data) => {
        cityService.getDelete(data).then(response => {
            mainStore.cities = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }
    const endPointUse = (page) => {
        customElementsForm.switch.length === 0 ? 
            getCities(page) :
            getCitiesDelete(page)
    }

    const endPointUseSort = (sort) => {
        customElementsForm.switch.length === 0 
            ? getCities(sort) 
            : getCitiesDelete(sort)
    }   
</script>
<template>
    <LayoutAuthenticated>
      <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.city.cities')">
            <BaseButton
                :to="{name: 'CitiesCreate'}"
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
        <SectionTitleLineWithButton v-if="!mainStore?.cities" :icon="mdiTableOff" title="Empty variation" />
        <NotificationBar v-if="!mainStore?.cities" color="danger" :icon="mdiTableOff">
            <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
        </NotificationBar>
        <CardBox  v-if="mainStore?.cities?.ciudades?.length" class="mb-6" has-table>
            <CityTable :checkDelete="customCheckDelete"  @changePage="onChangePage" @sort="onSortPage"/>        
        </CardBox>

        <CardBox v-else>
            <CardBoxComponentEmpty />
        </CardBox>        
      </SectionMain>
    </LayoutAuthenticated>
  </template>