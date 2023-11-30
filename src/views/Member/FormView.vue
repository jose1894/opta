<script setup>
import {
    reactive,
    computed,
    defineProps,
    onMounted,
    ref
} from 'vue';
import { useI18n } from "vue-i18n";
import {
    mdiCodeBraces,
    mdiRenameBox,
    mdiListStatus,
    mdiContentCopy
} from "@mdi/js";
import useValidate from '@vuelidate/core';
import { useToast } from 'vue-toastification';
import CardBox from '@/components/CardBox.vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/FormField.vue';
import BaseButton from '@/components/BaseButton.vue';
import citiesService from '@/services/cities.service';
import alliesService from '@/services/allies.service';
import cargosService from '@/services/cargos.service';
import FormControl from '@/components/FormControl.vue';
import statesService from '@/services/states.services';
import membersService from '@/services/member.service';
import TabsComponent from '@/components/TabsComponent.vue';
import countriesService from '@/services/countries.service';
import currenciesService from '@/services/currencies.service';
import membresiaLicenciaService from '@/services/membresiaLicencia.service';
import { required, maxLength } from '@/utils/i18n-validators';
import planesService from '@/services/planes.service'
import FormControlIcon from "@/components/FormControlIcon.vue";
import moment from 'moment';

const props = defineProps({
    path: '',
    saveLabel: '',    
    state: {}
})

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();
let pathLicense = ref('create');

const dateValue = ref([])
let countriesList = ref([]);
let statesList = ref([]);
let citiesList = ref([]);
let cargosList = ref([]);
let monedasList = ref([]);
let aliadosList = ref([]);
let planesList = ref([]);
let disabledBtnGenerateLicencia = ref(true)

const tab = ref(0)
const activeTab = (i) => {
    tab.value = i;
}
const listTabs = [
    { title: 'Membresia' },
    { title: 'Contacto' },
    { title: 'Users' },
    { title: 'Licences' }
]

const selectOptions = [
    { id: 1, label: t('message.cargo.statuses.active') },
    { id: 0, label: t('message.cargo.statuses.inactive') }
];

const typeContactOptions = [
    { id: 1, label: t('message.member.administrative_contacts') },
    { id: 2, label: t('message.member.technology_contacts') },
];

const creationOptions = [
    { id: 1, label: t('message.member.yes') },
    { id: 2, label: t('message.member.no') },
];

const formatter = ref({
    date: 'DD-MM-YYYY',
    month: 'MMM'
})



const userMembresia = ref({
    _id: '',
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    role: 'ADMIN_ROLE',
    estadoMembresia: 1,
    google: false,
});

const membresiaLicensia = ref({
    _id: '',
    fechaActual: moment(),
    fechaFinal: moment(),
    membresia: "",
    licencia: "",
    plan: {},
})

const member = ref({
    _id: '',
    aliado: aliadosList.value,
    codigo: "00",
    nombre: "",
    iDFiscal: "",
    ejercicioFiscal: "",
    pais: countriesList.value,
    state: statesList.value,
    ciudad: citiesList.value,
    calle: "",
    paginaWeb: "",
    tipoContacto: typeContactOptions[0],
    nombreContact: "",
    apellidoContact: "",
    cargo: cargosList.value,
    telefonoOfic: "",
    telefonoCelu: "",
    correoContact: "",
    plan: planesList.value,
    /*codigoActivacion: "",
    licencias: "",
    vigencia: new Date(),
    moneda: monedasList.value,
    periodoRevision: 0,
    creacion: creationOptions[0],
    declaracionHoras: 0,
    modificacionHoras: 0,
    requiereAprobacion: "",*/
    estado: selectOptions[0],
});

const rules = computed(() => ({
    nombre: { required, },
    iDFiscal: { required },
}));

const v$ = useValidate(rules, member);

onMounted(async () => {
    let listPaises = await countriesService.index();
    const optionCountry = listPaises?.paises || [];
    countriesList.value = optionCountry.map((country) => ({ id: country._id, label: country.nombre }));

    let listCargos = await cargosService.allCargos();
    const dataCargos = listCargos?.data.cargos;
    cargosList.value = dataCargos.map((cargo) => ({ id: cargo._id, label: cargo.nombre }));

    let listAliados = await alliesService.allAliadosGet();
    const dataAliados = listAliados?.data.aliados;
    aliadosList.value = dataAliados.map((aliado) => ({ id: aliado._id, label: aliado.nombre }));

    let listPlanes = await planesService.index();
    const dataPlanes = listPlanes?.planes;
    planesList.value = dataPlanes.map((plan) => ({ id: plan._id, label: plan.descripcion, dias: plan.dias }));
    

    if (props.path === 'update') {
        const res = await membersService.read(route.params);
        member.value = res.data.miembro
        const { _id, cargo, aliado, moneda, estado, tipoContacto, creacion } = res.data.miembro
        const licenciaByMembresia = await membresiaLicenciaService.getLicencia(_id)
        console.log(licenciaByMembresia)
        const dataLicencia = licenciaByMembresia.data?.licencia || {}
        if (Object.keys(dataLicencia).length === 0) {
            if(licenciaByMembresia?.msj) {
                toast.error(`${licenciaByMembresia?.msj}`)
            }
            member.value.plan = []
            disabledBtnGenerateLicencia.value = false
        } else {
            disabledBtnGenerateLicencia.value = true
            let dataPlan = _asignarOpcionesAlSelect(dataLicencia?.plan)
            const dataplan = { ...dataPlan, dias: dataLicencia?.plan.dias }
            member.value.plan = dataplan
            membresiaLicensia.value = dataLicencia
        }
        membresiaLicensia.value.membresia = _id
        member.value.cargo = { id: cargo._id, label: cargo.nombre }
        member.value.aliado = { id: aliado._id, label: aliado.nombre }
        member.value.pais = _asignarOpcionesAlSelect(res.data?.miembro.pais)
        member.value.estado = selectOptions.filter(status => status.id === estado)[0]
        member.value.tipoContacto = typeContactOptions.filter(typeContact => typeContact.id === tipoContacto)[0]
        member.value.creacion = creationOptions.filter(typeContact => typeContact.id === creacion)[0]
        selectedPais(member.value.pais, res.data.miembro)
        if (res.data.userMiembro) {
            console.log(res.data.userMiembro)
            userMembresia.value = res.data.userMiembro
            userMembresia.value.password = res.data.password
        }
    }
});

const _asignarOpcionesAlSelect = (data) => { console.log(data); return { id: data._id, label: (data?.nombre || data?.descripcion) } };

const selectedPais = (data, response = {}) => {
    const { id } = data;
    citiesList.value = [];
    statesList.value = [];
    estadosByPais(id).then((data) => {
        const optionState = data?.estados || [];
        statesList.value = optionState.map((state) => ({ id: state._id, label: state.nombre }));
        if (props.path === 'update') {
            member.value.state = _asignarOpcionesAlSelect(response?.state)
            selectedCiudad(member.value.state, response?.ciudad)
        }
    }).catch(err => {
        console.log(err)
    })

};

const estadosByPais = async (id) => {
    return await statesService.estadosByPais(id)
}

const selectedCiudad = (data, ciudadResponse = {}) => {
    const { id } = data;
    ciudadesByEstados(id).then((data) => {
        const optionCity = data?.ciudades || [];
        citiesList.value = optionCity.map((city) => ({ id: city._id, label: city.nombre }));
        if (props.path === 'update') {
            member.value.ciudad = _asignarOpcionesAlSelect(ciudadResponse)
        }
    }).catch(err => {
        console.log(err)
    })

};

const ciudadesByEstados = async (id) => {
    return await citiesService.ciudadesByEstados(id)
}

const action = (member) => {
    const { _id,
        aliado,
        codigo,
        nombre,
        iDFiscal,
        ejercicioFiscal,
        pais,
        state,
        ciudad,
        calle,
        paginaWeb,
        tipoContacto,
        nombreContact,
        apellidoContact,
        cargo,
        telefonoOfic,
        telefonoCelu,
        correoContact,
        estado
    } = member.value;
    console.log(userMembresia.value)
    const data = {
        _id,
        aliado: aliado.id,
        codigo,
        nombre,
        iDFiscal,
        ejercicioFiscal,
        pais: pais.id,
        state: state.id,
        ciudad: ciudad.id,
        calle,
        paginaWeb,
        tipoContacto: tipoContacto.id,
        nombreContact,
        apellidoContact,
        cargo: cargo.id,
        telefonoOfic,
        telefonoCelu,
        correoContact,
        membresiaUsuario: userMembresia.value,
        estado: estado.id
    }
    console.log(data)
    if (props.path === 'create') {
        return membersService.create(data)
    }
    return membersService.update(data);
}

const successMessage = props.path === 'create' ? t("message.member.created.success") : t("message.member.updated.success")
const errorMessage = props.path === 'create' ? t("message.member.created.error") : t("message.member.updated.error")

const submit = async () => {
    disabledBtnGenerateLicencia.value = true
    const result = await v$.value.$validate();
    if (result) {
        action(member)
            .then(() => {
                if(props.path === 'create') {disabledBtnGenerateLicencia.value = false}
                toast.success(successMessage);
                //router.push('/setup/memberships');
            })
            .catch(err => {
                if (err.response?.data?.msg) {
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
const goTo = () => router.push('/setup/memberships')

const selectedPlan = (plan) => {
    const { id, dias } = plan;
    const fechaActual = moment().utc();
    const fechaFinal = moment().utc().add(dias, 'days');
    membresiaLicensia.value.fechaActual = fechaActual.format('YYYY-MM-DD')
    membresiaLicensia.value.fechaFinal = fechaFinal.format('YYYY-MM-DD')
    membresiaLicensia.value.plan = plan
}

const btnGenerateLicense = async () => {
    const dataPlan = membresiaLicensia.value.plan
    const errorMSM = t("message.member.youmustselectaplan")
    if (Object.keys(dataPlan).length === 0) {
        toast.error(`${errorMSM}`)
    } else {
        const { _id, fechaActual, fechaFinal, plan, membresia } = membresiaLicensia.value
        const data = { _id, fechaActual, fechaFinal, plan, membresia }
        try {
            let result = null
            let succesMSM = ''
            if(pathLicense.value !== 'update' && membresiaLicensia.value.licencia === '') {
                succesMSM = t("message.member.thelicensewassuccessfullygenerated")
                result = await membresiaLicenciaService.create(data)
            } else {
                succesMSM = t("message.member.updated.successlicense")
                result = await membresiaLicenciaService.update(data)                
            }           
            const { _id, licencia } = result?.data
            membresiaLicensia.value.licencia = licencia
            membresiaLicensia.value._id = _id
            disabledBtnGenerateLicencia.value = true
            pathLicense.value = 'create'
            toast.success(succesMSM);
        } catch (error) {
            if(pathLicense.value !== 'update') {
                toast.error('Error al generar la licencia');
            } else {
                const errorMSM = t("message.member.updated.errorlicense")
                toast.error(errorMSM);
            }
            pathLicense.value = 'create'            
        }
    }
}

const copyText = () => {
    console.log('copia')
    if (disabledBtnGenerateLicencia.value) {
        const element = document.getElementById('txtLiencia');
        element.select();
        element.setSelectionRange(0, 99999);
        document.execCommand('copy');
        const msm = t("message.member.successfullycopiedlicense")
        toast.success(msm);
    } else {
        const msm = t("message.member.noactivelicense")
        toast.error(msm);
    }
}

const deleteLicencia = async () => {
    const { _id } = membresiaLicensia.value
    if (disabledBtnGenerateLicencia.value) {
        try {
            const licenciId = _id
            const result = await membresiaLicenciaService.delete(licenciId)
            const msm = t("message.member.deleted.successLicense")
            toast.success(msm);
            member.value.plan = []
            membresiaLicensia.value.id = ''
            membresiaLicensia.value.fechaActual = moment()
            membresiaLicensia.value.fechaFinal = moment()
            membresiaLicensia.value.licencia = ''
            membresiaLicensia.value.plan = {}
            disabledBtnGenerateLicencia.value = false
        } catch (error) {
            const msm = t("message.member.deleted.errorLicense")
            toast.error(msm);
        }
    } else {
        const msm = "No hay licencia para eliminar"
        toast.error(msm);
    }
}

const updateLicense = () => {
    pathLicense.value = 'update'
    console.log(membresiaLicensia.value)
    disabledBtnGenerateLicencia.value = false
}
</script>

<template>
    <CardBox isForm @submit.prevent="submit">
        <div>
            <div class="container mx-auto">
                <TabsComponent :tabs="listTabs" @tabClick="activeTab">
                    <div class="p-1 mt-0 bg-white border">
                        <div v-show="tab === 0">
                            <div :class="path !== 'create' ? 'grid md:grid-cols-3 gap-3' :
                                'grid md:grid-cols-2 gap-3'">
                                <FormField :label="$t('message.member.code')" v-show="path !== 'create'">
                                    <FormControl :name="'codigo'" v-model="member.codigo" :icon="mdiCodeBraces"
                                        readonly="true" />
                                </FormField>
                                <FormField :label="$t('message.member.ally')">
                                    <FormControl v-model="member.aliado" :icon="mdiListStatus" :options="aliadosList" />
                                </FormField>
                                <FormField :label="$t('message.member.name')" :help="v$?.nombre?.$errors[0]?.$message">
                                    <FormControl v-model="member.nombre" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.member.idFiscal')"
                                    :help="v$?.iDFiscal?.$errors[0]?.$message">
                                    <FormControl v-model="member.iDFiscal" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.member.físcal_year')">
                                    <FormControl v-model="member.ejercicioFiscal" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.member.country')">
                                    <FormControl v-model="member.pais" :icon="mdiListStatus" :options="countriesList"
                                        @onSelectChange="selectedPais" />
                                </FormField>
                                <FormField :label="$t('message.member.state')">
                                    <FormControl v-model="member.state" :icon="mdiListStatus" :options="statesList"
                                        @onSelectChange="selectedCiudad" />
                                </FormField>
                                <FormField :label="$t('message.member.city')">
                                    <FormControl v-model="member.ciudad" :icon="mdiListStatus" :options="citiesList" />
                                </FormField>
                                <FormField :label="$t('message.member.street')">
                                    <FormControl v-model="member.calle" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-2 gap-2">
                                <FormField :label="$t('message.member.paginaWeb')">
                                    <FormControl v-model="member.paginaWeb" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.member.status')">
                                    <FormControl v-model="member.estado" :icon="mdiListStatus" :options="selectOptions" />
                                </FormField>
                            </div>
                        </div>
                        <div v-show="tab === 1">
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.member.type_contacts')">
                                    <FormControl v-model="member.tipoContacto" :icon="mdiListStatus"
                                        :options="typeContactOptions" />
                                </FormField>
                                <FormField :label="$t('message.member.name')">
                                    <FormControl v-model="member.nombreContact" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.member.lastName')">
                                    <FormControl v-model="member.apellidoContact" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.member.cargo')">
                                    <FormControl v-model="member.cargo" :icon="mdiListStatus" :options="cargosList" />
                                </FormField>
                                <FormField :label="$t('message.member.officePhone')">
                                    <FormControl v-model="member.telefonoOfic" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.member.movilPhone')">
                                    <FormControl v-model="member.telefonoCelu" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-1 gap-1">
                                <FormField :label="$t('message.member.email')">
                                    <FormControl v-model="member.correoContact" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                        </div>
                        <div v-show="tab === 2">
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.user.firstname')">
                                    <FormControl v-model="userMembresia.firstname" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.user.lastname')">
                                    <FormControl v-model="userMembresia.lastname" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.user.username')">
                                    <FormControl v-model="userMembresia.username" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.user.email')">
                                    <FormControl v-model="userMembresia.email" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.user.password')">
                                    <FormControl v-model="userMembresia.password" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.user.role')">
                                    <FormControl v-model="userMembresia.role" :icon="mdiRenameBox" readonly="true" />
                                </FormField>
                            </div>

                        </div>
                        <div v-show="tab === 3">
                            <div style="display: flex; flex-direction: row;">
                                <div class="grid grid-cols-1 gap-3" style="width: 40%;">
                                    <FormField :label="$t('message.member.plan')">
                                        <FormControl v-model="member.plan" :icon="mdiListStatus" :options="planesList"
                                            @onSelectChange="selectedPlan" :readonly="disabledBtnGenerateLicencia" />
                                    </FormField>
                                </div>
                                <div class="grid grid-cols-1 gap-3" style="padding-left: 20px; position: relative;">
                                    <FormField label="">
                                        <BaseButton :label="$t('message.generateLicense')" color="succes"
                                            :disabled="disabledBtnGenerateLicencia" class="generateLicence"
                                            @click="btnGenerateLicense()" />
                                    </FormField>
                                </div>
                            </div>
                            <div class="grid gap-1" style="position: relative; padding:  10px 0px 2px;">
                                <FormField :label="$t('message.member.license')" style="margin-bottom: 0px;">
                                    <FormControl type="textarea" v-model="membresiaLicensia.licencia" :icon="mdiRenameBox"
                                        id="txtLiencia" :readonly="true" />
                                </FormField>
                                <div style="display: flex; flex-direction: row; gap: 10px; padding: 5px 0px 0 10px;">
                                    <i class="fas fa-copy icon-licencia" @click="copyText()"
                                        v-tippy="{ content: $t('message.member.copyLicense') }"></i>
                                    <i v-if="path !== 'create'" class="fa-solid fa-pen-to-square icon-licencia"
                                        v-tippy="{ content: $t('message.member.modifyLicense') }" 
                                        @click="updateLicense()"></i>
                                    <i v-if="path !== 'create'" class="fa-solid fa-trash icon-licencia"
                                        v-tippy="{ content: $t('message.member.deleteLicense') }"
                                        @click="deleteLicencia()"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                </TabsComponent>
            </div>
        </div>
        <template #footer>

            <div style="display: flex; justify-content: space-between;">
                <BaseButton v-show="tab === 2" :label="$t(`message.${props.saveLabel}`)" type="submit" color="success" />
                <BaseButton :label="$t('message.return')" color="info" @click="goTo()" />
            </div>
        </template>
    </CardBox>
</template>
<style scoped>
.btn-add-remove {
    display: grid;
    grid-template-columns: 1fr 50px 50px;
    margin: 10px 0;
}

.btn-add-remove button {
    background: #b0b0ba;
    height: 28px;
    color: white;
    font-size: 1rem;
    font-weight: 700;
    margin-right: 5px;
    border-radius: 50px;
}

.h2-tittle {
    font-size: 1.2rem;
    color: blue;
    font-weight: 500;
    margin-bottom: 10px;
    background: #b0b0ba;
    margin-right: 5px;
    padding-left: 8px;
    border-radius: 5px;
}

.btn-add-referidos:hover {
    background: blue;
}

.btn-remove-referidos:hover {
    background: red;
}

.generateLicence {
    position: absolute;
    bottom: 2px;
    color: white;
    background: #2563EB;
}

.icon-licencia {
    font-size: 18px;
    color: #b0b0ba;
}
</style>

