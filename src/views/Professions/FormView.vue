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
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import professionsService from '@/services/Professions.service'

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
  { id: 1, label: t('message.profession.statuses.active') },
  { id: 0, label: t('message.profession.statuses.inactive') }
];

const profession = ref({
  _id: '',
  codigo: "00",
  nombre: "",
  estado: selectOptions[0],
});

const action = (profession) =>{
  const {_id, codigo, nombre, estado } = profession.value;
  const data = {_id, codigo, nombre, estado: estado.id}
  if (props.path === 'create'){
    return professionsService.create(data)
  } 

  return professionsService.update(data);
}

onMounted(async () => {
  if (props.path === 'update'){
    const res = await professionsService.read(route.params);
    profession.value = res.data
    profession.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
  }
})

const goTo = () => router.push('/setup/professions')

const rules = computed(() => ({
            nombre: { required,  },
            estado: { required },
          }));

const v$ = useValidate(rules, profession);

const successMessage = props.path === 'create' ? t("message.profession.created.success") : t("message.profession.updated.success")
const errorMessage = props.path === 'create' ? t("message.profession.created.error") : t("message.profession.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();

    if(result) {
      action(profession)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/professions');
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
    <div  :class="path !== 'create' ? 'grid md:grid-cols-3 gap-3' : 
          'grid md:grid-cols-2 gap-3'">
      <FormField :label="$t('message.profession.code')" v-show="path !== 'create'">
        <FormControl :name="'codigo'" v-model="profession.codigo" :icon="mdiCodeBraces" readonly="true"/>            
      </FormField>
      <FormField :label="$t('message.profession.name')" :help="v$?.nombre?.$errors[0]?.$message">
        <FormControl v-model="profession.nombre" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.profession.status')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="profession.estado" :icon="mdiListStatus" :options="selectOptions" />
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