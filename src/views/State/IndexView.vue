<script setup>
    import { ref, reactive  } from 'vue';
    import { mdiGlobeModel, mdiPlus } from '@mdi/js';  
    import CardBox from '@/components/CardBox.vue';      
    import BaseButton from '@/components/BaseButton.vue';
    import SectionMain from '@/components/SectionMain.vue';
    import NotificationBar from '@/components/NotificationBar.vue';
    import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
    import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
    import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';  
    import stateService from '@/services/states.services'
    import FormField from "@/components/FormField.vue";    
    import { useMainStore } from '@/stores/main';
    import StateTable from './StateTable.vue';
    import Breadcrumb from '@/components/Breadcrumb.vue'


    const mainStore = useMainStore();
    const page = ref(1);
    const perPage = ref(10);
    const breadcrumbs = ref( [
        { name: 'Inicio' },
    ])
    const customElementsForm = reactive({
        switch: [],
    });
    const customCheckDelete = ref(false);
    const getStates = (data) => {
        stateService.index(data).then(response => {
            mainStore.states = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }

    getStates({page: page.value})

    const onChangeSwtch = () => {
        endPointUse({ page: page.value })
        customCheckDelete.value = customElementsForm.switch.length === 0 ? false : true
    }

    const onChangePage = (page) => {
        endPointUse({page})
    }

    const onSortPage = (sortBy,sortDesc) => {
        endPointUseSort({sortBy,sortDesc});
    }

    const getStatesDelete = (data) => {
        stateService.getDelete(data).then(response => {
            mainStore.states = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }
    const endPointUse = (page) => {
        customElementsForm.switch.length === 0 ? getStates({ page }) :
        getStatesDelete({ page })
    }

    const endPointUseSort = (sort) => {
        customElementsForm.switch.length === 0 
            ? getStates(sort) 
            : getStatesDelete(sort)
    }   
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.state.states')">
            <BaseButton
                :to="{name: 'StatesCreate'}"
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
        <SectionTitleLineWithButton v-if="!mainStore?.states" :icon="mdiTableOff" title="Empty variation" />
        <NotificationBar v-if="!mainStore?.states" color="danger" :icon="mdiTableOff">
            <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
        </NotificationBar>

        <CardBox  v-if="mainStore?.states?.estados?.length" class="mb-6" has-table>
            <StateTable :checkDelete="customCheckDelete" @changePage="onChangePage" @sort="onSortPage"/>        
        </CardBox>

        <CardBox v-else>
            <CardBoxComponentEmpty />
        </CardBox>        
    </SectionMain>
  </LayoutAuthenticated>
</template>
