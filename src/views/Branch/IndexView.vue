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
    import BranchTable from './BranchTable.view.vue';
    import { useMainStore } from '@/stores/main';
    import branchesService from '@/services/branches.service';
    import FormField from "@/components/FormField.vue";
    import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";

    const mainStore = useMainStore();
    const page = ref(1);
    const perPage = ref(10);
    const customElementsForm = reactive({
        switch: [],
    });
    const getBranches = (data) => {
        branchesService.index(data).then(response => {
            mainStore.branches = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }

    getBranches({page: page.value})

    const onChangePage = (page) => {
        endPointUse({ page })
    }
    
    const onSortPage = (sortBy, sortDesc) => {
        endPointUseSort({ sortBy, sortDesc });
    }

    const onChangeSwtch = () => {
        endPointUse({ page: page.value })
    }

    const getBranchesDelete = (data) => {
        branchesService.getDelete(data).then(response => {
            mainStore.branches = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }

    const endPointUse = (page) => {
        customElementsForm.switch.length === 0 ? getBranches({ page }) :
            getBranchesDelete({ page })
    }

const endPointUseSort = (sortBy, sortDesc) => {
  customElementsForm.switch.length === 0 ? getBranches({ sortBy, sortDesc }) :
    getBranchesDelete({ sortBy, sortDesc })
}  
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.branch.branches')">
            <BaseButton
                to="branches/create"
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
                :options="{ one: 'Mostrar registros eliminados' }" 
                @change="onChangeSwtch" />
        </FormField>
        <SectionTitleLineWithButton v-if="!mainStore?.branches" :icon="mdiTableOff" title="Empty variation"/>  
        <NotificationBar v-if="!mainStore?.branches" color="danger" :icon="mdiTableOff">
            <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
        </NotificationBar>
        <CardBox  v-if="mainStore?.branches?.sucursales?.length" class="mb-6" has-table>
            <BranchTable @changePage="onChangePage" @sort="onSortPage"/>        
        </CardBox>

        <CardBox v-else>
            <CardBoxComponentEmpty />
        </CardBox>        
    </SectionMain>
  </LayoutAuthenticated>
</template>
