<script setup>
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { mdiBallotOutline, mdiAccount, mdiMail, mdiGithub } from "@mdi/js";
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import BaseButton from '@/components/BaseButton.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import countriesService from '@/services/countries.service'
const { t } = useI18n();

const selectOptions = [
  { id: 1, label: t('message.country.statuses.active') },
  { id: 2, label: t('message.country.statuses.inactive') },
  { id: 0, label: t('message.country.statuses.deleted') },
];

const form = ref({
  codigo: "",
  nombre: "",
  status: selectOptions.filter((id) => id === 1),
});

const customElementsForm = ref({
  checkbox: ["lorem"],
  radio: "one",
  switch: ["one"],
  file: null,
});

const submit = () => {
  countriesService.create(form.value)
  .then(response => {
    console.log(response)
  })
  .catch(response => {
    console.log(response)
  })
};

const formStatusWithHeader = ref(true);

const formStatusCurrent = ref(0);

const formStatusOptions = ["info", "success", "danger", "warning"];

const formStatusSubmit = () => {
  formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
    ? formStatusCurrent.value + 1
    : 0;
};
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        :title="$t('message.country.create')"
        main
      >
      </SectionTitleLineWithButton>
      <Form class="rounded-2xl flex-col dark:bg-slate-900/70 bg-white flex" @submit.prevent="submit">
        <div class="flex-1 p-6">        
          <FormField label="Grouped with icons">
            <FormControl 
              :name="'codigo'"
              :modelValue="form.codigo" 
              :icon="mdiMail"
              />
            <!-- <FormControl :value="form.nombre" type="email" :icon="mdiMail" /> -->
          </FormField>

          <!-- <FormField label="With help line" help="Do not enter the leading zero">
            <FormControl
              v-model="form.phone"
              type="tel"
              placeholder="Your phone number"
            />
          </FormField>

          <FormField label="Dropdown">
            <FormControl v-model="form.department" :options="selectOptions" />
          </FormField>

          <BaseDivider />

          <FormField label="Question" help="Your question. Max 255 characters">
            <FormControl
              type="textarea"
              placeholder="Explain how we can help you"
            />
          </FormField> -->
        
        </div>
      </Form>
    </SectionMain>

  </LayoutAuthenticated>
</template>