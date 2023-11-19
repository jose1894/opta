<script setup>
    import { ref } from 'vue';
    import { mdiBallotOutline } from "@mdi/js";
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
    import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
    import SectionMain from '@/components/SectionMain.vue';    
    import FormView from './FormView.vue';
    import Breadcrumb from '@/components/Breadcrumb.vue';

    const breadcrumbs = ref( [
        { name: 'Inicio', link: '/setup/businessUnit/' },
        { name: 'Update'},
    ])
</script>

<template>
    <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        :title="$t('message.bussinesUnit.update')"
        main
      >
      </SectionTitleLineWithButton>
      <Breadcrumb :items="breadcrumbs" />
      <form-view path="update" save-label="submit"></form-view>
    </SectionMain>

  </LayoutAuthenticated>
</template>