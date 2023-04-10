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
    import ExpenseTable from './ExpenseTable.view.vue';
    import { useMainStore } from '@/stores/main';
    import expenseService from '@/services/expense.service';

    const mainStore = useMainStore();
    const page = ref(1);
    const perPage = ref(10);
    const getExpense = (data) => {
        expenseService.index(data).then(response => {
            mainStore.expense = response
            page.value = response.page
            perPage.value = response.perPage
        })
    }

    getExpense({page: page.value})

    const onChangePage = (page) => {
        getExpense({page})
    }

    const onSortPage = (sortBy,sortDesc) => {
        getExpense({sortBy,sortDesc});
    }  
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiGlobeModel"
            :title="$t('message.expense.expense')">
            <BaseButton
                to="expense/create"
                :icon="mdiPlus"
                :label="$t('message.add_new')"
                color="success"
                small
            />
        </SectionTitleLineWithButton>
        <SectionTitleLineWithButton v-if="!mainStore?.expense" :icon="mdiTableOff" title="Empty variation"/>  
        <NotificationBar v-if="!mainStore?.expense" color="danger" :icon="mdiTableOff">
            <b>{{ $t('message.empty_table') }}.</b> When there's nothing to show
        </NotificationBar>
        <CardBox  v-if="mainStore?.expense?.gastos?.length" class="mb-6" has-table>
            <ExpenseTable @changePage="onChangePage" @sort="onSortPage"/>        
        </CardBox>

        <CardBox v-else>
            <CardBoxComponentEmpty />
        </CardBox>        
    </SectionMain>
  </LayoutAuthenticated>
</template>
