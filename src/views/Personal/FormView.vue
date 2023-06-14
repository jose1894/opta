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
import personalService from '@/services/personal.service'
import professionsService from '@/services/Professions.service'
import languagesService from '@/services/languages.service'
import bussinesUnitService from '@/services/bussinesUnit.service';
import categoriesService from '@/services/categories.service'
import branchesService from '@/services/branches.service';
import membersService from '@/services/member.service';
import profilesService from '@/services/profiles.service'
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
  { id: 1, label: t('message.personal.statuses.active') },
  { id: 0, label: t('message.personal.statuses.inactive') },
  { id: 2, label: t('message.personal.statuses.deleted') },
];

const selectOptionsTypePersonal = [
  { id: 0, label: t('message.personal.others') },
  { id: 1, label: t('message.personal.partner') },
  { id: 2, label: t('message.personal.manager') },
];


let profesionList = ref([])
let idiomasList = ref([])
let unidadNegocioList = ref([])
let categoriaList = ref([])
let sucursalList = ref([])
let perfilList = ref([])
let miembroList = ref([])

const persona = ref({
  _id: '',
  nombres: "",
  apellidos: "",
  apelidos: "", 
  iDFiscal: '', 
  telefono: '', 
  email: '', 
  direccion: '', 
  profesion: profesionList.value, 
  idiomas: idiomasList.value, 
  postgrado: '', 
  unidadNegocio: unidadNegocioList.value, 
  categoria: categoriaList.value, 
  sucursal: sucursalList.value, 
  perfil: perfilList.value, 
  usuarioAcceso: '', 
  claveAcceso: '', 
  miembro: miembroList.value, 
  estado: selectOptions[0],
  tipoPersonal: selectOptionsTypePersonal[0]
});

const action = (cargo) =>{
  const {
    _id,
    nombres, 
    apellidos, 
    iDFiscal, 
    telefono, 
    email,
    direccion, 
    profesion, 
    idiomas, 
    postgrado, 
    unidadNegocio, 
    categoria, 
    sucursal, 
    perfil, 
    usuarioAcceso, 
    claveAcceso, 
    miembro,
    tipoPersonal, 
    estado
   } = cargo.value;
  const data = { _id,
    nombres, 
    apellidos, 
    iDFiscal, 
    telefono,
    email, 
    direccion, 
    profesion: profesion.id, 
    idiomas: idiomas.id, 
    postgrado, 
    unidadNegocio: unidadNegocio.id, 
    categoria: categoria.id, 
    sucursal: sucursal.id, 
    perfil: perfil.id, 
    usuarioAcceso, 
    claveAcceso, 
    miembro: miembro.id, 
    tipoPersonal: tipoPersonal.id,
    estado: estado.id,  }
  if (props.path === 'create'){
    return personalService.create(data)
  } 

  return personalService.update(data);
}

onMounted(async () => {
  let listarProfesiones = await professionsService.allProfesiones()
  const dataProfesiones = listarProfesiones?.data.profesiones;
  profesionList.value = dataProfesiones.map((profesion) => ({ id: profesion._id, label: profesion.nombre }));

  let listarIdiomas = await languagesService.allIdiomas()
  const dataIdiomas = listarIdiomas?.data.idiomas;
  idiomasList.value = dataIdiomas.map((idioma) => ({ id: idioma._id, label: idioma.nombre }));

  let listarUnidadNegocio = await bussinesUnitService.allBussinesUnitGet()
  const dataUnidadNegocio = listarUnidadNegocio?.data.unidadesNegocio;
  unidadNegocioList.value = dataUnidadNegocio.map((unidadNegocio) => ({ id: unidadNegocio._id, label: unidadNegocio.nombre }));

  let listarCategoria = await categoriesService.allCategoris()
  const dataCategoria = listarCategoria?.data.categorias;
  categoriaList.value = dataCategoria.map((categoria) => ({ id: categoria._id, label: categoria.nombre }));

  let listarSucursal = await branchesService.sucursalesGet()
  const dataSucursal = listarSucursal?.data.sucursales;
  sucursalList.value = dataSucursal.map((sucursal) => ({ id: sucursal._id, label: sucursal.nombre }));

  let listarPerfil = await profilesService.allPerfiles()
  const dataPerfil = listarPerfil?.data.perfiles;
  perfilList.value = dataPerfil.map((perfil) => ({ id: perfil._id, label: perfil.descripcion }));

  let listarMiembros = await membersService.allMiembrosGet()
  const dataMiembros = listarMiembros?.data.miembros;
  miembroList.value = dataMiembros.map((miembro) => ({ id: miembro._id, label: miembro.nombre }));
  if (props.path === 'update'){
    const res = await personalService.read(route.params);
    persona.value = res.data
    persona.value.tipoPersonal = selectOptionsTypePersonal.filter(tipoP => tipoP.id === res.data.tipoPersonal)[0]
    persona.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
    persona.value.profesion = _asignarOpcionesAlSelect(res.data?.profesion)
    persona.value.idiomas = _asignarOpcionesAlSelect(res.data?.idiomas)
    persona.value.unidadNegocio = _asignarOpcionesAlSelect(res.data?.unidadNegocio)
    persona.value.categoria = _asignarOpcionesAlSelect(res.data?.categoria)
    persona.value.sucursal = _asignarOpcionesAlSelect(res.data?.sucursal)
    persona.value.perfil = _asignarOpcionesAlSelect(res.data?.perfil)
    persona.value.miembro = _asignarOpcionesAlSelect(res.data?.miembro)
  }
})

const _asignarOpcionesAlSelect = (data) => { return { id: data._id, label: data?.nombre || data?.descripcion } };
const rules = computed(() => ({
            iDFiscal: { required},
            nombres: { required,  },
            estado: { required },
          }));

const v$ = useValidate(rules, persona);

const successMessage = props.path === 'create' ? t("message.personal.created.success") : t("message.personal.updated.success")
const errorMessage = props.path === 'create' ? t("message.personal.created.error") : t("message.personal.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();

    if(result) {
      action(persona)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/personal');
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
    <div class="grid md:grid-cols-3 gap-3">
      <FormField :label="$t('message.personal.names')" :help="v$?.nombres?.$errors[0]?.$message">
        <FormControl :name="'nombres'" v-model="persona.nombres" :icon="mdiRenameBox" />            
      </FormField>
      <FormField :label="$t('message.personal.surnames')">
        <FormControl v-model="persona.apellidos" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.personal.idFiscal')" :help="v$?.iDFiscal?.$errors[0]?.$message">
        <FormControl v-model="persona.iDFiscal" :icon="mdiRenameBox" />            
      </FormField>
      <FormField :label="$t('message.personal.phone')">
        <FormControl v-model="persona.telefono" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.personal.email')">
        <FormControl v-model="persona.email" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.personal.profession')">
          <FormControl v-model="persona.profesion" :icon="mdiListStatus" :options="profesionList"/>
      </FormField>
      <FormField :label="$t('message.personal.languages')">
          <FormControl v-model="persona.idiomas" :icon="mdiListStatus" :options="idiomasList"/>
      </FormField>
      <FormField :label="$t('message.personal.postgraduate')">
        <FormControl v-model="persona.postgrado" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.personal.businessUnit')">
          <FormControl v-model="persona.unidadNegocio" :icon="mdiListStatus" :options="unidadNegocioList"/>
      </FormField>
      <FormField :label="$t('message.personal.category')">
          <FormControl v-model="persona.categoria" :icon="mdiListStatus" :options="categoriaList"/>
      </FormField>
      <FormField :label="$t('message.personal.branch')">
          <FormControl v-model="persona.sucursal" :icon="mdiListStatus" :options="sucursalList"/>
      </FormField>
      <FormField :label="$t('message.personal.profile')">
          <FormControl v-model="persona.perfil" :icon="mdiListStatus" :options="perfilList"/>
      </FormField>
      <FormField :label="$t('message.personal.user')">
        <FormControl v-model="persona.usuarioAcceso" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.personal.password')">
        <FormControl v-model="persona.claveAcceso" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.personal.status')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="persona.estado" :icon="mdiListStatus" :options="selectOptions" />
      </FormField>
    </div>
    <div class="grid md:grid-cols-2 gap-2">
      <FormField :label="$t('message.personal.membership')">
          <FormControl v-model="persona.miembro" :icon="mdiListStatus" :options="miembroList"/>
      </FormField>
      <FormField :label="$t('message.personal.typePersonnel')">
        <FormControl v-model="persona.tipoPersonal" :icon="mdiListStatus" :options="selectOptionsTypePersonal" />
      </FormField>
    </div>
    <div class="grid gap-1">
      <FormField :label="$t('message.personal.address')">
        <FormControl type="textarea" v-model="persona.direccion" :icon="mdiRenameBox" />
      </FormField>
    </div>    
    <template #footer>
      <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="info" />
    </template>
  </CardBox>
</template>