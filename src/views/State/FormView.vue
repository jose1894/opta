<script setup>
import { reactive, computed, defineProps, onMounted, ref } from 'vue';
import { useI18n } from "vue-i18n";
import BaseButton from '@/components/BaseButton.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import { mdiCodeBraces, mdiRenameBox, mdiListStatus } from "@mdi/js";
import { required, maxLength } from '@/utils/i18n-validators';
import useValidate from '@vuelidate/core';
import countriesService from '@/services/countries.service';
import statesService from '@/services/states.services';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const props = defineProps({
  path : '',
  saveLabel : '',
  state: {}
})

let selectOptions = [
  { id: 1, label: t('message.state.statuses.active') },
  { id: 0, label: t('message.state.statuses.inactive') },
  { id: 2, label: t('message.state.statuses.deleted') },
];

let countriesList = ref([])

const state = ref({
  _id: '',
  codigo: "00",
  nombre: "",
  estado: selectOptions[0],
  pais: countriesList.value,
});

const action = (state) =>{
  const {_id, codigo, nombre, estado, pais } = state.value;
  const data = {_id, codigo, nombre, estado: estado.id, pais: pais.id}
  if (props.path === 'create'){
    return statesService.create(data)
  } 

  return statesService.update(data);
}

onMounted(async () => {
  let listPaises = await countriesService.index();
  const optionCountry = listPaises?.paises || [];
  countriesList.value = optionCountry.map((country) => ({id: country._id, label: country.nombre}));
  console.log(props.path)
  if (props.path === 'update'){
    const res = await statesService.read(route.params);
    
    const country = res.data?.pais || [];
    const countrySelected = optionCountry.filter((item) => item._id == country._id)[0];
    state.value = res.data
    state.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
    state.value.pais = {id: countrySelected._id, label: countrySelected.nombre} 
  }
})

const rules = computed(() => ({
            nombre: { required,  },
            estado: { required },
          }));

const v$ = useValidate(rules, state);

const successMessage = props.path === 'create' ? t("message.state.created.success") : t("message.state.updated.success")

const submit = async () => {
    const result = await v$.value.$validate();
    console.log(result)

    if(result) {
      action(state)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/states');
      })
      .catch(err => {
        if (err.response.data?.msg){
          toast.error(`${t("message.state.created.error")} ${err.response.data.msg}`)
          return
        }

        if  (err.response.data?.errors){
          const errors = err.response.data.errors;
          let errorStr = '';
          
          for(let attr of errors){
          }
        }
      })
    }else{
      console.log('error')
    }

};

const goTo = () => router.push('/setup/states')

</script>
<template>
  <CardBox isForm @submit.prevent="submit">
    <div :class="path !== 'create' ? 'grid md:grid-cols-2 gap-4' : 
      'grid md:grid-cols-3 gap-4'">
      <FormField 
        v-show="path !== 'create'" 
        :label="$t('message.state.code')">
        <FormControl :name="'codigo'" v-model="state.codigo" :icon="mdiCodeBraces" readonly="true"/>            
      </FormField>
      <FormField :label="$t('message.state.name')" :help="v$?.nombre?.$errors[0]?.$message">
        <FormControl v-model="state.nombre" :icon="mdiRenameBox" />
      </FormField>     
      <FormField :label="$t('message.state.country')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="state.pais" :icon="mdiListStatus" :options="countriesList" />
      </FormField>
      <FormField :label="$t('message.state.status')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="state.estado" :icon="mdiListStatus" :options="selectOptions" />
      </FormField>
    </div>
    <template #footer>
      <div style="display: flex; justify-content: space-between;">
        <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="success" />
        <BaseButton :label="$t('message.return')"  color="info" @click="goTo()"/>
      </div>    
    </template>
  </CardBox>
</template>