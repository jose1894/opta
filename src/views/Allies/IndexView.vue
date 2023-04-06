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
    import AllyTable from './AllyTable.view.vue';
    import { useMainStore } from '@/stores/main';
    import stateService from '@/services/states.services'

    const mainStore = useMainStore();
    const page = ref(1);
    const perPage = ref(10);
    const allies = ref([]);
    const getAllies = (data) => {
        stateService.index(data).then(response => {
            mainStore.allies = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }

    getAllies({page: page.value})

    const onChangePage = (page) => {
        getAllies({page})
    }

    const onSortPage = (sortBy,sortDesc) => {
        getAllies({sortBy,sortDesc});
    }  
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.ally.allies')">
            <BaseButton
                to="allies/create"
                :icon="mdiPlus"
                label="Add new"
                color="success"
                small
            />
        </SectionTitleLineWithButton>
        <SectionTitleLineWithButton v-if="!mainStore?.allies" :icon="mdiTableOff" title="Empty variation"/>  
        <NotificationBar v-if="!mainStore?.allies" color="danger" :icon="mdiTableOff">
            <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
        </NotificationBar>
        <CardBox  v-if="mainStore?.allies?.aliados?.length" class="mb-6" has-table>
            <AllyTable @changePage="onChangePage" @sort="onSortPage"/>        
        </CardBox>

        <CardBox v-else>
            <CardBoxComponentEmpty />
        </CardBox>        
    </SectionMain>
  </LayoutAuthenticated>
</template>
