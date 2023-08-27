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
import activitiesService from '@/services/activities.service'
import membersServices from '@/services/member.service'
import bussinesUnitService from '@/services/bussinesUnit.service'

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();
let miembroList = ref([]);
let unidadNegocioList = ref([]);

const props = defineProps({
  path: '',
  saveLabel: '',
  activity: {}
})

const selectOptions = [
  { id: 1, label: t('message.activity.statuses.active') },
  { id: 0, label: t('message.activity.statuses.inactive') },
];

const selectOptionsCargable = [
  { id: 0, label: t('message.activity.chargeable') },
  { id: 1, label: t('message.activity.non-chargeable') },
];

const activity = ref({
  _id: '',
  unidadNegocio: unidadNegocioList.value,
  siglas: "",
  nombre: "",
  cargable: selectOptionsCargable[0],
  miembro: miembroList.value,
  estado: selectOptions[0],
});

const action = (activity) => {
  const { _id, unidadNegocio, siglas, nombre, cargable, miembro, estado } = activity.value;
  const data = {
    _id,
    unidadNegocio: unidadNegocio.id,
    siglas, nombre,
    cargable: cargable.id,
    miembro: miembro.id,
    estado: estado.id
  }
  if (props.path === 'create') {
    return activitiesService.create(data)
  }

  return activitiesService.update(data);
}

onMounted(async () => {
  let listarMiembros = await membersServices.allMiembrosGet()
  const dataMiembros = listarMiembros?.data.miembros;
  miembroList.value = dataMiembros.map((miembro) => ({ id: miembro._id, label: miembro.nombre }));

  let listarUnidadNegocio = await bussinesUnitService.allBussinesUnitGet()
  const dataUnidadNegocio = listarUnidadNegocio?.data.unidadesNegocio;
  unidadNegocioList.value = dataUnidadNegocio.map((unidadNegocio) => ({ id: unidadNegocio._id, label: unidadNegocio.nombre }));
  if (props.path === 'update') {
    const res = await activitiesService.read(route.params);
    activity.value = res.data
    activity.value.unidadNegocio = _asignarOpcionesAlSelect(res.data?.unidadNegocio)
    activity.value.miembro = _asignarOpcionesAlSelect(res.data?.miembro)
    activity.value.cargable = selectOptionsCargable.filter(cargable => cargable.id === res.data.cargable)[0]
    activity.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
  }
})

const _asignarOpcionesAlSelect = (data) => { return { id: data._id, label: data?.nombre || data?.descripcion } };

const rules = computed(() => ({
  siglas: { required, maxLength: maxLength(4) },
  nombre: { required, },
  estado: { required },
}));

const v$ = useValidate(rules, activity);

const successMessage = props.path === 'create' ? t("message.activity.created.success") : t("message.activity.updated.success")
const errorMessage = props.path === 'create' ? t("message.activity.created.error") : t("message.activity.updated.error")

const submit = async () => {
  const result = await v$.value.$validate();

  if (result) {
    action(activity)
      .then(() => {
        toast.success(successMessage);
        router.push('/setup/activities');
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

</script>
<template>
  <CardBox isForm @submit.prevent="submit">
    <div class="grid md:grid-cols-3 gap-4">
      <FormField :label="$t('message.activity.bussinesUnit')">
        <FormControl v-model="activity.unidadNegocio" :icon="mdiListStatus" :options="unidadNegocioList" />
      </FormField>
      <FormField :label="$t('message.activity.acronyms')" :help="v$?.siglas?.$errors[0]?.$message">
        <FormControl v-model="activity.siglas" :icon="mdiRenameBox" />
      </FormField>
      <FormField :label="$t('message.activity.name')" :help="v$?.nombre?.$errors[0]?.$message">
        <FormControl v-model="activity.nombre" :icon="mdiRenameBox" />
      </FormField>     
    </div>
    <div class="grid md:grid-cols-3 gap-3">
        <FormField :label="$t('message.activity.chargeable')">
          <FormControl v-model="activity.cargable" :icon="mdiListStatus" :options="selectOptionsCargable" />
        </FormField>
        <FormField :label="$t('message.activity.membership')">
        <FormControl v-model="activity.miembro" :icon="mdiListStatus" :options="miembroList" />
      </FormField>
        <FormField :label="$t('message.activity.status')" :help="v$?.estado?.$errors[0]?.$message">
          <FormControl v-model="activity.estado" :icon="mdiListStatus" :options="selectOptions" />
        </FormField>
      </div>
    <template #footer>
      <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="success" />
    </template>
  </CardBox>
</template>