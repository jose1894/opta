<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from "vue-i18n";
import { mdiBallotOutline } from "@mdi/js";
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import FormView from './FormView.vue';
</script>

<template>
    <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        :title="$t('message.country.update')"
        main
      >
      </SectionTitleLineWithButton>
      <form-view path="update" save-label="submit"></form-view>
    </SectionMain>

  </LayoutAuthenticated>
</template>