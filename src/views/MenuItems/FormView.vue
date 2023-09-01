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
import itemsMenuService from '@/services/itemsMenu.service'
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
  { id: 1, label: t('message.itemMenu.statuses.active') },
  { id: 0, label: t('message.itemMenu.statuses.inactive') },
];

const itemMenu = ref({
  _id: '',
  codigo: "00",
  descripcion: "",
  estado: selectOptions[0],
});

const action = (itemMenu) =>{
  const {_id, codigo, descripcion, estado } = itemMenu.value;
  const data = {_id, codigo, descripcion, estado: estado.id}
  if (props.path === 'create'){
    return itemsMenuService.create(data)
  } 

  return itemsMenuService.update(data);
}

onMounted(async () => {
  if (props.path === 'update'){
    const res = await itemsMenuService.read(route.params);
    itemMenu.value = res.data
    itemMenu.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
  }
})

const rules = computed(() => ({
            codigo: { required, maxLength: maxLength(3) },
            descripcion: { required,  },
            estado: { required },
          }));

const v$ = useValidate(rules, itemMenu);

const successMessage = props.path === 'create' ? t("message.itemMenu.created.success") : t("message.itemMenu.updated.success")
const errorMessage = props.path === 'create' ? t("message.itemMenu.created.error") : t("message.itemMenu.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();

    if(result) {
      action(itemMenu)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/itemsMenu');
      })
      .catch(err => {
        console.log(err)
        if (err.response?.data?.msg){
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

const goTo = () => router.push('/setup/itemsMenu')

</script>
<template>
  <CardBox isForm @submit.prevent="submit">
    <div class="grid md:grid-cols-3 gap-4">
      <FormField :label="$t('message.itemMenu.code')" :help="v$?.codigo?.$errors[0]?.$message">
        <FormControl :name="'codigo'" v-model="itemMenu.codigo" :icon="mdiCodeBraces" />            
      </FormField>
      <FormField :label="$t('message.itemMenu.description')" :help="v$?.descripcion?.$errors[0]?.$message">
        <FormControl v-model="itemMenu.descripcion" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.itemMenu.status')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="itemMenu.estado" :icon="mdiListStatus" :options="selectOptions" />
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