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
import projectsService from '@/services/projects.service'
import bussinesUnitService from '@/services/bussinesUnit.service'
import clientService from '@/services/clients.srvice'
import personalService from '@/services/personal.service'
import breanchesService from '@/services/branches.service'
import activitiesService from '@/services/activities.service'
import moment from 'moment';

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const isReadonly = ref(true);
let unidadNegocioList = ref([]);
let clienteList = ref([]);
let socioList = ref([]);
let gerenteList = ref([]);
let sucursalList = ref([]);
let tipoServicioList = ref([]);

const props = defineProps({
  path: '',
  saveLabel: '',
  project: {}
})

const selectOptions = [
  { id: 1, label: t('message.project.statuses.active') },
  { id: 0, label: t('message.project.statuses.inactive') }
];

const formatter = ref({
  date: 'DD-MM-YYYY',
  month: 'MMM'
})

const fechaTest = ref('');
const fechaFormateada = ref('');

const project = ref({
  _id: '',
  codigo: '0000000',
  fecha: moment(new Date(), 'DD-MM-YYYY').format('DD-MM-YYYY'),
  creado: "",
  cliente: clienteList.value,
  socio: socioList.value,
  gerente: gerenteList.value,
  sucursal: sucursalList.value,
  unidadNegocio: unidadNegocioList.value,
  tipoServicio: tipoServicioList.value,
  descripcionServicio: "",
  creadoName: "",
  estado: selectOptions[0],
});

const action = (project) => {
  const { _id, codigo, fecha, creado, cliente, socio, gerente, sucursal, unidadNegocio, tipoServicio, descripcionServicio, estado } = project.value;
  const data = {
    _id,
    codigo,
    fecha,
    creado,
    cliente: cliente.id,
    socio: socio.id,
    gerente: gerente.id,
    sucursal: sucursal.id,
    unidadNegocio: unidadNegocio.id,
    tipoServicio: tipoServicio.id,
    descripcionServicio,
    estado: estado.id,
  }
  if (props.path === 'create') {
    return projectsService.create(data)
  }

  return projectsService.update(data);
}

onMounted(async () => {
  let listarClientes = await clientService.allClientes()
  const dataClientes = listarClientes?.data.cliente;
  clienteList.value = dataClientes.map((client) => ({ id: client._id, label: client.nombre }));
   
  let listarPersonasSocios = await personalService.getListTipoPersonal(1)
  const dataPersonasSocio = listarPersonasSocios?.data.personas;
  socioList.value = dataPersonasSocio.map((persona) => ({ id: persona._id, label: persona.nombres }));

  let listarPersonas = await personalService.getListTipoPersonal(2)
  const dataPersonas = listarPersonas?.data.personas;
  gerenteList.value = dataPersonas.map((persona) => ({ id: persona._id, label: persona.nombres }));

  let listarSucursal = await breanchesService.sucursalesGet()
  const dataSucursales = listarSucursal?.data.sucursales;
  sucursalList.value = dataSucursales.map((sucursal) => ({ id: sucursal._id, label: sucursal.nombre }));

  let listarActividad = await activitiesService.allActividades()
  const dataActividades = listarActividad?.data.actividades;
  tipoServicioList.value = dataActividades.map((actividad) => ({ id: actividad._id, label: actividad.nombre }));

  let listarUnidadNegocio = await bussinesUnitService.allBussinesUnitGet()
  const dataUnidadNegocio = listarUnidadNegocio?.data.unidadesNegocio;
  unidadNegocioList.value = dataUnidadNegocio.map((unidadNegocio) => ({ id: unidadNegocio._id, label: unidadNegocio.nombre }));
  const user = JSON.parse(localStorage.getItem('user'));
  const {firstname, lastname, id } = user.userData ?? {}
  project.value.creadoName = `${firstname} ${lastname}`
  project.value.creado = id

  console.log(user.userData)

  if (props.path === 'update') {
    const res = await projectsService.read(route.params);
    project.value = res.data
    const {firstname, lastname, _id } = res.data?.creado ?? {}
    project.value.creadoName = `${firstname} ${lastname}`
    project.value.creado = _id
    fechaTest.value = new Date(res.data?.fecha);
    project.value.fecha = moment(fechaTest.value, 'DD-MM-YYYY').format('DD-MM-YYYY'),
    project.value.cliente = _asignarOpcionesAlSelect(res.data?.cliente)
    project.value.socio = _asignarOpcionesAlSelect(res.data?.socio)
    project.value.gerente = _asignarOpcionesAlSelect(res.data?.gerente)
    project.value.sucursal = _asignarOpcionesAlSelect(res.data?.sucursal)
    project.value.unidadNegocio = _asignarOpcionesAlSelect(res.data?.unidadNegocio)
    project.value.tipoServicio = _asignarOpcionesAlSelect(res.data?.tipoServicio)
    project.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
  }
})

const _asignarOpcionesAlSelect = (data) => { return { id: data._id, label: data?.nombre || data?.descripcion || data?.nombres } };

const rules = computed(() => ({}));

const v$ = useValidate(rules, project);

const successMessage = props.path === 'create' ? t("message.project.created.success") : t("message.project.updated.success")
const errorMessage = props.path === 'create' ? t("message.project.created.error") : t("message.project.updated.error")

const submit = async () => {
  const result = await v$.value.$validate();

  if (result) {
    action(project)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/projects');
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
const goTo = () => router.push('/setup/projects')

</script>
<template>
  <CardBox isForm @submit.prevent="submit">
    <div :class="path !== 'create' ? 'grid md:grid-cols-3 gap-4' : 
          'grid md:grid-cols-2 gap-4'">
      <FormField :label="$t('message.project.code')" v-show="path !== 'create'">
        <FormControl :name="'codigo'" v-model="project.codigo" :icon="mdiCodeBraces" :readonly="true"/>
      </FormField>
      <FormField :label="$t('message.project.date')">
        <FormControl :name="'fecha'" v-model="project.fecha" :icon="mdiCodeBraces" :readonly="isReadonly"/>      
      </FormField>
      <!-- <FormField :label="$t('message.project.date')" :readonly="true">
        <vue-tailwind-datepicker class="h-12 border-gray-700" :formatter="formatter" as-single v-model="project.fecha"/>      
      </FormField> -->
      <FormField :label="$t('message.project.createdProject')" class="c_hidden">
        <FormControl v-model="project.creadoName" :icon="mdiRenameBox" :readonly="isReadonly"/>
      </FormField>
      <FormField :label="$t('message.project.client')">
        <FormControl v-model="project.cliente" :icon="mdiListStatus" :options="clienteList" />
      </FormField>            
    </div>
    <div class="grid md:grid-cols-2 gap-2">
      <FormField :label="$t('message.project.partner')">
        <FormControl v-model="project.socio" :icon="mdiListStatus" :options="socioList" />
      </FormField>
      <FormField :label="$t('message.project.manager')">
        <FormControl v-model="project.gerente" :icon="mdiListStatus" :options="gerenteList" />
      </FormField> 
    </div>
    <div class="grid md:grid-cols-2 gap-2">
      <FormField :label="$t('message.project.branch')">
        <FormControl v-model="project.sucursal" :icon="mdiListStatus" :options="sucursalList" />
      </FormField> 
      <FormField :label="$t('message.project.bussinesUnit')">
        <FormControl v-model="project.unidadNegocio" :icon="mdiListStatus" :options="unidadNegocioList" />
      </FormField>  
    </div>
    <div class="grid md:grid-cols-2 gap-3">     
      <FormField :label="$t('message.project.typeOfService')">
        <FormControl v-model="project.tipoServicio" :icon="mdiListStatus" :options="tipoServicioList" />
      </FormField>
      <FormField :label="$t('message.project.status')" :help="v$?.estado?.$errors[0]?.$message">
        <FormControl v-model="project.estado" :icon="mdiListStatus" :options="selectOptions" />
      </FormField>
    </div>
    <div class="grid md:grid-cols-1 gap-1">
      <FormField :label="$t('message.project.serviceDescription')">
        <FormControl type="textarea" v-model="project.descripcionServicio" :icon="mdiRenameBox" />
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
<style scoped>
.c_hidden {
  display: none;
}
</style>