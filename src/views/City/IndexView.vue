<script setup>
import { ref } from 'vue';
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


    const mainStore = useMainStore();
    const page = ref(1);
    const perPage = ref(10);
    const cities = ref([]);
    const getCities = (data) => {
        cityService.index(data).then(response => {
            mainStore.cities = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }

    getCities({page: page.value})

    const onChangePage = (page) => {
        getCities({page})
    }

    const onSortPage = (sortBy,sortDesc) => {
        getCities({sortBy,sortDesc});
    }
</script>
<template>
    <LayoutAuthenticated>
      <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.city.cities')">
            <BaseButton
                to="cities/create"
                :icon="mdiPlus"
                label="Add new"
                color="success"
                small
            />
        </SectionTitleLineWithButton>
        <SectionTitleLineWithButton v-if="!mainStore?.cities" :icon="mdiTableOff" title="Empty variation" />
        <NotificationBar v-if="!mainStore?.cities" color="danger" :icon="mdiTableOff">
            <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
        </NotificationBar>
        <CardBox  v-if="mainStore?.cities?.ciudades?.length" class="mb-6" has-table>
            <CityTable @changePage="onChangePage" @sort="onSortPage"/>        
        </CardBox>

        <CardBox v-else>
            <CardBoxComponentEmpty />
        </CardBox>        
      </SectionMain>
    </LayoutAuthenticated>
  </template>