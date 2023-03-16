<script setup>
import { reactive, computed, defineProps, onMounted, ref } from 'vue';
import { useI18n } from "vue-i18n";
import BaseButton from '@/components/BaseButton.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import { mdiBallotOutline, mdiAccount, mdiMail, mdiGithub, mdiCodeBraces, mdiRenameBox, mdiListStatus } from "@mdi/js";
import { required, maxLength } from '@/utils/i18n-validators';
import useValidate from '@vuelidate/core';
import countriesService from '@/services/countries.service';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const props = defineProps({
  path : '',
  saveLabel : '',
  country: {}
})

const selectOptions = [
  { id: 1, label: t('message.country.statuses.active') },
  { id: 0, label: t('message.country.statuses.inactive') },
  { id: 2, label: t('message.country.statuses.deleted') },
];

const state = ref({
  _id: '',
  codigo: "00",
  nombre: "",
  estado: selectOptions[0],
});
debugger

const action = (state) =>{
  const {_id, codigo, nombre, estado } = state.value;
  const data = {_id, codigo, nombre, estado: estado.id}
  if (props.path === 'create'){
    return countriesService.create(data)
  } 

  return countriesService.update(data);
}

onMounted(async () => {
  if (props.path === 'update'){
    const res = await countriesService.read(route.params);
    state.value = res.data
    state.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
  }
})

const rules = computed(() => ({
            codigo: { required, maxLength: maxLength(2) },
            nombre: { required,  },
            estado: { required },
          }));

const v$ = useValidate(rules, state);

const successMessage = props.path === 'create' ? t("message.country.created.success") : t("message.country.updated.success")

const submit = async () => {
    const result = await v$.value.$validate();

    if(result) {
      action(state)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/countries');
      })
      .catch(err => {
        if (err.response.data?.msg){
          toast.error(`${t("message.country.created.error")} ${err.response.data.msg}`)
          return
        }

        if  (err.response.data?.errors){
          const errors = err.response.data.errors;
          let errorStr = '';
          debugger
          for(let attr of errors){
          }
        }
      })
    }else{
      console.log('error')
    }

};

</script>
<template>
  <CardBox isForm @submit.prevent="submit">
    <div class="grid md:grid-cols-3 gap-4">
      <FormField :label="$t('message.country.code')" :help="v$?.codigo?.$errors[0]?.$message">
        <FormControl :name="'codigo'" v-model="state.codigo" :icon="mdiCodeBraces" />            
      </FormField>
      <FormField :label="$t('message.country.name')" :help="v$?.nombre?.$errors[0]?.$message">
        <FormControl v-model="state.nombre" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.country.status')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="state.estado" :icon="mdiListStatus" :options="selectOptions" />
      </FormField>
    </div>
    <template #footer>
      <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="info" />
    </template>
  </CardBox>
</template>