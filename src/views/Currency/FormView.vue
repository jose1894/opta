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
import currenciesService from '@/services/currencies.service';
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
  { id: 1, label: t('message.currencies.statuses.active') },
  { id: 0, label: t('message.currencies.statuses.inactive') }
];

const currency = ref({
  _id: '',
  codigo: "00",
  nombre: "",
  estado: selectOptions[0],
});

const action = (currency) =>{
  const {_id, codigo, nombre, estado } = currency.value;
  const data = {_id, codigo, nombre, estado: estado.id}
  if (props.path === 'create'){
    return currenciesService.create(data)
  } 

  return currenciesService.update(data);
}

onMounted(async () => {
  if (props.path === 'update'){
    const res = await currenciesService.read(route.params);
    currency.value = res.data
    currency.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
  }
})

const rules = computed(() => ({
            codigo: { required, maxLength: maxLength(3) },
            nombre: { required,  },
            estado: { required },
          }));

const v$ = useValidate(rules, currency);

const successMessage = props.path === 'create' ? t("message.currencies.created.success") : t("message.currencies.updated.success")
const errorMessage = props.path === 'create' ? t("message.currencies.created.error") : t("message.currencies.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();

    if(result) {
      action(currency)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/currencies');
      })
      .catch(err => {
        if (err.response.data?.msg){
          toast.error(`${errorMessage} ${err.response.data.msg}`)
          return
        }

        if  (err.response.data?.errors){
          const errors = err.response.data.errors;          
          const result = Object.keys(errors).map(function(key, index) {
              const error = errors[key]
              return error.length > 1 ? error.map(i => error[i]).join() : error[0];
          });
          let errorStr = result.length > 1 ? result.map(i => result[i]).join() : result[0];
          toast.error(`${errorStr}`)
        }
      })
    }else{
      console.log('error')
    }

};

const goTo = () => router.push('/setup/currencies')

</script>
<template>
  <CardBox isForm @submit.prevent="submit">
    <div class="grid md:grid-cols-3 gap-4">
      <FormField :label="$t('message.currencies.code')" :help="v$?.codigo?.$errors[0]?.$message">
        <FormControl :name="'codigo'" v-model="currency.codigo" :icon="mdiCodeBraces" />            
      </FormField>
      <FormField :label="$t('message.currencies.name')" :help="v$?.nombre?.$errors[0]?.$message">
        <FormControl v-model="currency.nombre" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.currencies.status')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="currency.estado" :icon="mdiListStatus" :options="selectOptions" />
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