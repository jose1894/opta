<script setup>
    import FormView from './FormView.vue';
    import SectionMain from '@/components/SectionMain.vue';
    import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
        <SectionTitleLineWithButton
            :icon="mdiBallotOutline"
            :title="$t('message.bussinesUnit.create')"
            main>
        </SectionTitleLineWithButton>
        <form-view path="create" save-label="submit"></form-view>
    </SectionMain>
  </LayoutAuthenticated>
</template>