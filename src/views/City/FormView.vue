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
import statesService from '@/services/states.services';
import citiesService from '@/services/cities.service';
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
  state: {}
})

let selectOptions = [
  { id: 1, label: t('message.city.statuses.active') },
  { id: 0, label: t('message.city.statuses.inactive') },
  { id: 2, label: t('message.city.statuses.deleted') },
];

let statesList = ref([])
let countriesList = ref([])

const city = ref({
  _id: '',
  codigo: "00",
  nombre: "",
  estado: selectOptions[0],
  pais: countriesList.value,
  state: statesList.value,
});

const action = (city) =>{
  const {_id, codigo, nombre, estado, pais, state } = city.value;
  const data = {_id, codigo, nombre, estado: estado.id, pais: pais.id, state: state.id}
  if (props.path === 'create'){
    return citiesService.create(data)
  } 

  return citiesService.update(data);
}

onMounted(async () => { 
  let listPaises = await countriesService.getDelete({estado: 1});
  const optionCountry = listPaises?.paises || [];
  console.log(optionCountry)
  countriesList.value = optionCountry.map((country) => ({id: country._id, label: country.nombre})); 
    if (props.path === 'update'){    
      const res = await citiesService.read(route.params);
      const estados = res.data?.state || [];
      city.value = res.data
      city.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
      city.value.pais = _asignarOpcionesAlSelect(res.data?.pais)
      selectedPais(city.value.pais, res.data?.state)      
    }
})

const _asignarOpcionesAlSelect = (data) => { return { id: data._id, label: data.nombre } };

const rules = computed(() => ({
            codigo: { required, maxLength: maxLength(3) },
            nombre: { required,  },
            estado: { required },
          }));

const v$ = useValidate(rules, city);

const selectedPais = (data, stateResponse = {} ) => {
    const { id } = data;
    statesList.value = [];
    estadosByPais(id).then((data) => {
        const optionState = data?.estados || [];
        statesList.value = optionState.map((state) => ({ id: state._id, label: state.nombre }));
        if (props.path === 'update'){
          city.value.state = _asignarOpcionesAlSelect(stateResponse)
        }
    }).catch(err => {
        console.log(err)
     })

};

const estadosByPais = async (id) => {
    return await statesService.estadosByPais(id)
}

const successMessage = props.path === 'create' ? t("message.city.created.success") : t("message.city.updated.success")

const submit = async () => {
    const result = await v$.value.$validate();
    console.log(result)

    if(result) {
      action(city)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/cities');
      })
      .catch(err => {
        if (err.response.data?.msg){
          toast.error(`${t("message.city.created.error")} ${err.response.data.msg}`)
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

</script>
<template>
  <CardBox isForm @submit.prevent="submit">
    <div class="grid md:grid-cols-3 gap-4">
      <FormField :label="$t('message.city.code')" :help="v$?.codigo?.$errors[0]?.$message">
        <FormControl :name="'codigo'" v-model="city.codigo" :icon="mdiCodeBraces" />            
      </FormField>
      <FormField :label="$t('message.city.country')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="city.pais" :icon="mdiListStatus" :options="countriesList" 
        @onSelectChange="selectedPais"/>
      </FormField>
      <FormField :label="$t('message.city.state')" :help="v$?.state?.$errors[0]?.$message">
        <FormControl v-model="city.state" :icon="mdiListStatus" :options="statesList" />
      </FormField>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <FormField :label="$t('message.city.name')" :help="v$?.nombre?.$errors[0]?.$message">
        <FormControl v-model="city.nombre" :icon="mdiRenameBox" />
      </FormField>      
      <FormField :label="$t('message.city.status')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="city.estado" :icon="mdiListStatus" :options="selectOptions" />
      </FormField>      
    </div>
    <template #footer>
      <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="success" />
    </template>
  </CardBox>
</template>