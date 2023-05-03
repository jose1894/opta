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
            :title="$t('message.rate.update')"
            main>
        </SectionTitleLineWithButton>
        <form-view path="update" save-label="submit"></form-view>
    </SectionMain>
  </LayoutAuthenticated>
</template>