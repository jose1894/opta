<script setup>
    import FormView from './FormView.vue';
    import SectionMain from '@/components/SectionMain.vue';
    import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
    import { ref } from 'vue';
    import Breadcrumb from '@/components/Breadcrumb.vue';
    
    const breadcrumbs = ref( [
        { name: 'Inicio', link: '/setup/activities/' },
        { name: 'Create'},
    ])
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiBallotOutline"
            :title="$t('message.activity.create')"
            main>
        </SectionTitleLineWithButton>
        <Breadcrumb :items="breadcrumbs" />
        <form-view path="create" save-label="submit"></form-view>
    </SectionMain>
  </LayoutAuthenticated>
</template>