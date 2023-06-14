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
import profilesService from '@/services/profiles.service'
import itemsMenuService from '@/services/itemsMenu.service'
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import profileActionsService from '@/services/profileActions.service'

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();
let dataMenu = []

const customElementsForm = reactive({
  checkbox: []
});
const props = defineProps({
  path: '',
  saveLabel: '',
})

const selectOptions = [
  { id: 1, label: t('message.profiles.statuses.active') },
  { id: 0, label: t('message.profiles.statuses.inactive') },
  { id: 2, label: t('message.profiles.statuses.deleted') },
];

let menuList = ref([]);
let accionesPerfilList = ref([]);
let accionesList = ref([]);

const listarAccionesPerfil = computed(() =>
    accionesPerfilList.value
);

const perfil = ref({
  _id: '',
  codigo: "00",
  descripcion: "",
  menu: menuList.value,
  accionesPerfil: accionesList.value,
  estado: selectOptions[0],
});

const action = (perfil) => {
  const { _id, codigo, descripcion, menu, accionesPerfil, estado } = perfil.value;
  const data = { _id, codigo, descripcion, menu: menu.id, accionesPerfil, estado: estado.id }
  if (props.path === 'create') {
    return profilesService.create(data)
  }

  return profilesService.update(data);
}

onMounted(async () => {
  listarMenu()
  listarAccionesMenu()
  if (props.path === 'update') {
    const res = await profilesService.read(route.params);
    perfil.value = res.data
    perfil.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
    const accionesPerfiles = res.data?.accionesPerfil
    dataMenu = accionesPerfiles.map((menu) => ({ '_id': menu._id }))
    customElementsForm.checkbox = accionesPerfiles.map((menu) => menu._id)
   /*perfil.value.accionesPerfil = res.data?.accionesPerfil*/

  }
})

const listarMenu = (async () => {
  let itemsMenu = await itemsMenuService.allMenu();
  const dataMenu = itemsMenu?.data.menu;
  menuList.value = dataMenu.map((menu) => ({ id: menu._id, label: menu.descripcion }));
})

const listarAccionesMenu = (async () => {
  let accionesMenu = await profileActionsService.allAccionesPerfiles();
  const dataAccionesMenu = accionesMenu?.data.accionesPerfiles;
  accionesPerfilList.value = arrayItemMenu(dataAccionesMenu);
})

const arrayItemMenu = (dataAccionesMenu) => dataAccionesMenu.map(({ _id, descripcion }) => ({ [_id]: descripcion }))

const rules = computed(() => ({
  codigo: { required, maxLength: maxLength(3) },
  descripcion: { required, },
  estado: { required },
}));

const v$ = useValidate(rules, perfil);

const successMessage = props.path === 'create' ? t("message.profiles.created.success") : t("message.profiles.updated.success")
const errorMessage = props.path === 'create' ? t("message.profiles.created.error") : t("message.profiles.updated.error")

const submit = async () => {
  const result = await v$.value.$validate();

  if (result) {
    action(perfil)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/profiles');
      })
      .catch(err => {
        if (err.response.data?.msg) {
          toast.error(`${errorMessage} ${err.response.data.msg}`)
          return
        }

        if (err.response.data?.errors) {
          const errors = err.response.data.errors;
          let errorStr = '';
          for (let attr of errors) {
          }
        }
      })
  } else {
    console.log('error')
  }

};

const onChangeCheckbox = (accionData) => {
  const valueId = Object.keys(accionData)[0]
  const exist = dataMenu.filter((item) => item._id === valueId)
  exist.length === 0 ? 
    dataMenu.push({_id:valueId}) : 
    dataMenu = dataMenu.filter((item) => item._id !== valueId)
  //accionesList.value = dataMenu
  perfil.value.accionesPerfil = dataMenu

  console.log(perfil.value)
}

</script>
<template>
  <CardBox isForm @submit.prevent="submit">
    <div class="grid md:grid-cols-2 gap-2">
      <FormField :label="$t('message.profiles.code')" :help="v$?.codigo?.$errors[0]?.$message">
        <FormControl :name="'codigo'" v-model="perfil.codigo" :icon="mdiCodeBraces" />
      </FormField>
      <FormField :label="$t('message.profiles.description')" :help="v$?.descripcion?.$errors[0]?.$message">
        <FormControl v-model="perfil.descripcion" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.profiles.menu')">
        <FormControl v-model="perfil.menu" :icon="mdiListStatus" :options="menuList" />
      </FormField>
      <FormField :label="$t('message.profiles.status')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="perfil.estado" :icon="mdiListStatus" :options="selectOptions" />
      </FormField>
    </div>
    <div class="grid md:grid-cols-1">
      <h4 class="text-xl">Acciones del perfil</h4>
    </div>    
    <div class="grid md:grid-cols-2 gap-2">      
      <FormField label="" v-for="(accionData, i) in listarAccionesPerfil">
        <FormCheckRadioGroup 
          v-model="customElementsForm.checkbox" 
          name="sample-checkbox" 
          :options="listarAccionesPerfil[i]"
          @change="onChangeCheckbox(listarAccionesPerfil[i])" />
      </FormField>
    </div>
    <template #footer>
      <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="success" />
    </template>
  </CardBox>
</template>