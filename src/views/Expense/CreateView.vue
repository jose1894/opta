<script setup>
    import { ref } from 'vue';
    import FormView from './FormView.vue';
    import SectionMain from '@/components/SectionMain.vue';
    import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
    import Breadcrumb from '@/components/Breadcrumb.vue';

    const breadcrumbs = ref( [
        { name: 'Inicio', link: '/setup/businessUnit/' },
        { name: 'Create'},
    ])
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiBallotOutline"
            :title="$t('message.expense.create')"
            main>
        </SectionTitleLineWithButton>

        <Breadcrumb :items="breadcrumbs" />
        <form-view path="create" save-label="submit"></form-view>
    </SectionMain>
  </LayoutAuthenticated>
</template>