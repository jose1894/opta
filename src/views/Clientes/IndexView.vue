<script setup>
    import { ref, reactive  } from 'vue';
    import { mdiGlobeModel, mdiPlus } from '@mdi/js';  
    import CardBox from '@/components/CardBox.vue';      
    import BaseButton from '@/components/BaseButton.vue';
    import SectionMain from '@/components/SectionMain.vue';
    import NotificationBar from '@/components/NotificationBar.vue';
    import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
    import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
    import ClientTable from './ClientTable.view.vue';
    import { useMainStore } from '@/stores/main';
    import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
    import FormField from "@/components/FormField.vue"; 
    import clientsService from '@/services/clients.srvice';
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
    const getClients = (data) => {
        clientsService.index(data).then(response => {
            mainStore.clients = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }

    getClients({page: page.value})

    const customCheckDelete = ref(false);

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

    const getClientsDelete = (data) => {
        clientsService.getDelete(data).then(response => {
            mainStore.clients = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }
    const endPointUse = (page) => {
        customElementsForm.switch.length === 0 ? getClients({ page }) :
        getClientsDelete({ page })
    }

    const endPointUseSort = (sort) => {
        customElementsForm.switch.length === 0 
        ? getClients(sort) 
        : getClientsDelete(sort)
    }    
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.client.clients')">
            <BaseButton
                :to="{'name': 'ClientsCreate'}"
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
        <SectionTitleLineWithButton v-if="!mainStore?.clients" :icon="mdiTableOff" title="Empty variation"/>  
        <NotificationBar v-if="!mainStore?.clients" color="danger" :icon="mdiTableOff">
            <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
        </NotificationBar>
        <CardBox  v-if="mainStore?.clients?.clientes?.length" class="mb-6" has-table>
            <ClientTable :checkDelete="customCheckDelete" @changePage="onChangePage" @sort="onSortPage"/>        
        </CardBox>

        <CardBox v-else>
            <CardBoxComponentEmpty />
        </CardBox>        
    </SectionMain>
  </LayoutAuthenticated>
</template>
