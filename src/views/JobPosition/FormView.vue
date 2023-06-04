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
import cargosService from '@/services/cargos.service';
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
  { id: 1, label: t('message.cargo.statuses.active') },
  { id: 0, label: t('message.cargo.statuses.inactive') },
  { id: 2, label: t('message.cargo.statuses.deleted') },
];

const cargo = ref({
  _id: '',
  codigo: "00",
  nombre: "",
  estado: selectOptions[0],
});

const action = (cargo) =>{
  const {_id, codigo, nombre, estado } = cargo.value;
  const data = {_id, codigo, nombre, estado: estado.id}
  if (props.path === 'create'){
    return cargosService.create(data)
  } 

  return cargosService.update(data);
}

onMounted(async () => {
  if (props.path === 'update'){
    const res = await cargosService.read(route.params);
    cargo.value = res.data
    cargo.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
  }
})

const rules = computed(() => ({
            codigo: { required, maxLength: maxLength(3) },
            nombre: { required,  },
            estado: { required },
          }));

const v$ = useValidate(rules, cargo);

const successMessage = props.path === 'create' ? t("message.cargo.created.success") : t("message.cargo.updated.success")
const errorMessage = props.path === 'create' ? t("message.cargo.created.error") : t("message.cargo.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();

    if(result) {
      action(cargo)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/jobPositions');
      })
      .catch(err => {
        if (err.response.data?.msg){
          toast.error(`${errorMessage} ${err.response.data.msg}`)
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
      <FormField :label="$t('message.cargo.code')" :help="v$?.codigo?.$errors[0]?.$message">
        <FormControl :name="'codigo'" v-model="cargo.codigo" :icon="mdiCodeBraces" />            
      </FormField>
      <FormField :label="$t('message.cargo.name')" :help="v$?.nombre?.$errors[0]?.$message">
        <FormControl v-model="cargo.nombre" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.cargo.status')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="cargo.estado" :icon="mdiListStatus" :options="selectOptions" />
      </FormField>
    </div>
    <template #footer>
      <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="info" />
    </template>
  </CardBox>
</template>