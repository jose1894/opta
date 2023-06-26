<script setup>
import { reactive, ref, computed } from 'vue'
import { useI18n } from "vue-i18n";
import { mdiBallotOutline } from "@mdi/js";
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import FormView from './FormView.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const formStatusWithHeader = ref(true);

const formStatusCurrent = ref(0);

const formStatusOptions = ["info", "success", "danger", "warning"];

const formStatusSubmit = () => {
  formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
    ? formStatusCurrent.value + 1
    : 0;
};


const breadcrumbs = ref( [
        { name: 'Inicio', link: '/setup/languages/' },
        { name: 'Create'},
    ])
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        :title="$t('message.language.create')"
        main
      >
      </SectionTitleLineWithButton>
      <Breadcrumb :items="breadcrumbs" />
      <form-view path="create" save-label="submit"></form-view>
    </SectionMain>

  </LayoutAuthenticated>
</template>