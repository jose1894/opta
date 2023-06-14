<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from "vue-i18n";
import { mdiBallotOutline } from "@mdi/js";
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import FormView from './FormView.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';

const breadcrumbs = ref( [
        { name: 'Inicio', link: '/setup/countries/' },
        { name: 'Update'},
    ])
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
      <Breadcrumb :items="breadcrumbs" />

      <form-view path="update" save-label="submit"></form-view>
    </SectionMain>

  </LayoutAuthenticated>
</template>