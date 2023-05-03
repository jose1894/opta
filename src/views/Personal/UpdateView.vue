<script setup>
    import { mdiBallotOutline } from "@mdi/js";
    import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
    import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
    import SectionMain from '@/components/SectionMain.vue';    
    import FormView from './FormView.vue';
</script>

<template>
    <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        :title="$t('message.personal.update')"
        main
      >
      </SectionTitleLineWithButton>
      <form-view path="update" save-label="submit"></form-view>
    </SectionMain>

  </LayoutAuthenticated>
</template>