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
    mdiListStatus
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
import VueTailwindDatepicker from 'vue-tailwind-datepicker';
import { required, maxLength } from '@/utils/i18n-validators';

const props = defineProps({
    path: '',
    saveLabel: '',
    state: {}
})

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const dateValue = ref([])
let countriesList = ref([]);
let statesList = ref([]);
let citiesList = ref([]);
let cargosList = ref([]);
let monedasList = ref([]);
let aliadosList = ref([]);

const tab = ref(0)
const activeTab = (i) => {
    tab.value = i;
}
const listTabs = [
    { title: 'Membresia' },
    { title: 'Contacto' },
    { title: 'Users' }
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
    codigo: { required, maxLength: maxLength(3) },
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

    let listMonedas = await currenciesService.allCurrencies();
    const dataMonedas = listMonedas?.data.monedas;
    monedasList.value = dataMonedas.map((aliado) => ({ id: aliado._id, label: aliado.nombre }));


    console.log(dataAliados)
    if (props.path === 'update') {
        const res = await membersService.read(route.params);
        member.value = res.data
        const { cargo, aliado, moneda, estado, tipoContacto, creacion } = res.data
        member.value.cargo = { id: cargo._id, label: cargo.nombre }
        member.value.aliado = { id: aliado._id, label: aliado.nombre }
        member.value.pais = _asignarOpcionesAlSelect(res.data?.pais)
        member.value.estado = selectOptions.filter(status => status.id === estado)[0]
        member.value.tipoContacto = typeContactOptions.filter(typeContact => typeContact.id === tipoContacto)[0]
        member.value.creacion = creationOptions.filter(typeContact => typeContact.id === creacion)[0]          
        selectedPais(member.value.pais, res.data)
        
    }
});

const _asignarOpcionesAlSelect = (data) => { return { id: data._id, label: data.nombre } };

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
        /*codigoActivacion,
        licencias,
        vigencia,
        moneda,
        periodoRevision,
        creacion,
        declaracionHoras,
        modificacionHoras,
        requiereAprobacion,*/
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
    /*codigoActivacion,
    licencias,
    vigencia: vigencia.undefined,
    moneda: moneda.id,
    periodoRevision: +periodoRevision,
    creacion: creacion.id,
    declaracionHoras: +declaracionHoras,
    modificacionHoras: +modificacionHoras,
    requiereAprobacion,*/
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
    const result = await v$.value.$validate();
    if (result) {
        action(member)
            .then(() => {
                toast.success(successMessage);
                router.push('/setup/memberships');
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
</script>

<template>
    <CardBox isForm @submit.prevent="submit">
        <div>
            <div class="container mx-auto">
                <TabsComponent :tabs="listTabs" @tabClick="activeTab">
                    <div class="p-1 mt-0 bg-white border">
                        <div v-show="tab === 0">
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.member.code')" :help="v$?.codigo?.$errors[0]?.$message">
                                    <FormControl :name="'codigo'" v-model="member.codigo" :icon="mdiCodeBraces" />
                                </FormField>
                                <FormField :label="$t('message.member.ally')">
                                    <FormControl v-model="member.aliado" :icon="mdiListStatus" :options="aliadosList"/>
                                </FormField>
                                <FormField :label="$t('message.member.name')" :help="v$?.nombre?.$errors[0]?.$message">
                                    <FormControl v-model="member.nombre" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.member.idFiscal')" :help="v$?.iDFiscal?.$errors[0]?.$message">
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
                                    <FormControl v-model="member.tipoContacto" :icon="mdiListStatus" :options="typeContactOptions" />
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
                                    <FormControl v-model="userMembresia.username" :icon="mdiRenameBox"/>
                                </FormField>
                                <FormField :label="$t('message.user.email')">
                                    <FormControl v-model="userMembresia.email" :icon="mdiRenameBox"/>
                                </FormField> 
                                <FormField :label="$t('message.user.password')">
                                    <FormControl v-model="userMembresia.password" :icon="mdiRenameBox"/>
                                </FormField>
                                <FormField :label="$t('message.user.role')">
                                    <FormControl v-model="userMembresia.role" :icon="mdiRenameBox" readonly="true"/>
                                </FormField>                             
                            </div>
                        
                        </div>
                        <!-- <div v-show="tab === 2">
                            <h2 class="h2-tittle">Softwere</h2>
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.member.activation_code')">
                                    <FormControl v-model="member.codigoActivacion" :icon="mdiRenameBox" />
                                </FormField>

                                <FormField :label="$t('message.member.activeLicenses')">
                                    <FormControl v-model="member.licencias" :icon="mdiRenameBox" />
                                </FormField>

                                <FormField :label="$t('message.member.validity')">
                                    <vue-tailwind-datepicker 
                                        class="h-12 border-gray-700" 
                                        :formatter="formatter"
                                        as-single v-model="member.vigencia" />
                                </FormField> 
                            </div>
                            <h2 class="h2-tittle">Presupuesto</h2>

                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.member.currency')">
                                    <FormControl v-model="member.moneda" :icon="mdiListStatus" :options="monedasList" />
                                </FormField>

                                <FormField :label="$t('message.member.review_period_the_budget')">
                                    <FormControl v-model="member.periodoRevision"  :icon="mdiRenameBox"/>
                                </FormField>

                                <FormField :label="$t('message.member.budget_creation')">
                                    <FormControl v-model="member.creacion" :icon="mdiListStatus" :options="creationOptions" />
                                </FormField>

                                <FormField :label="$t('message.member.modification_of_hours')">
                                    <FormControl v-model="member.modificacionHoras"  :icon="mdiRenameBox"/>
                                </FormField>

                                <FormField :label="$t('message.member.requires_approval_to_activate_the_project')">
                                    <FormControl v-model="member.requiereAprobacion"  :icon="mdiRenameBox"/>
                                </FormField>
                            </div>                        
                        </div> -->
                        <div>
                            <!-- <div v-for="(field, i) in ally.referidos" :key="i">
                                                    <div class="btn-add-remove">
                                                        <h2 class="h2-tittle">Referido nro. {{ i + 1 }}</h2>
                                                        <button type="button" class="btn-add-referidos" @click="addItem(i)">
                                                            +
                                                        </button>
                                                        <button type="button" class="btn-remove-referidos" v-show="i > 0" @click="remove(i)">
                                                            -
                                                        </button>
                                                    </div>

                                                    <div class="grid md:grid-cols-2 gap-2">
                                                        <FormField :label="$t('message.ally.codeClient')"
                                                            :help="v$?.cliente?.$errors[0]?.$message">
                                                            <FormControl :id="`cliente_${i}`" v-model="ally.referidos[i].cliente"
                                                                :icon="mdiRenameBox" />
                                                        </FormField>                                   
                                                        <FormField :label="$t('message.ally.name')">
                                                            <FormControl v-model="ally.referidos[i].referido" :icon="mdiRenameBox" />
                                                        </FormField>
                                                    </div>
                                                    <div class="grid md:grid-cols-2 gap-2">
                                                        <FormField :label="$t('message.ally.date')">
                                                            <vue-tailwind-datepicker class="h-12 border-gray-700" as-single v-model="ally.referidos[i].fecha" />
                                                        </FormField>
                                                        <FormField :label="$t('message.ally.idFiscal')">
                                                            <FormControl :id="`idFiscalReferido_${i}`"
                                                                v-model="ally.referidos[i].idFiscalReferido" :icon="mdiRenameBox" />
                                                        </FormField>
                                                    </div>
                                                    <div class="grid md:grid-cols-1 gap-1">
                                                        <FormField :label="$t('message.ally.address')">
                                                            <FormControl :id="`direccionReferido_${i}`"
                                                                v-model="ally.referidos[i].direccionReferido" :icon="mdiRenameBox" />
                                                        </FormField>
                                                    </div>
                                                    <div class="grid md:grid-cols-2 gap-2">
                                                        <FormField :label="$t('message.ally.contacts')">
                                                            <FormControl :id="`contactos_${i}`" v-model="ally.referidos[i].contactos"
                                                                :icon="mdiRenameBox" />
                                                        </FormField>
                                                        <FormField :label="$t('message.ally.activeLicenses')">
                                                            <FormControl :id="`licenciasActivas_${i}`"
                                                                v-model="ally.referidos[i].licenciasActivas" :icon="mdiRenameBox" />
                                                        </FormField>
                                                    </div>
                                                </div> -->
                        </div>
                    </div>
                </TabsComponent>
            </div>
        </div>
        <template #footer>
           
            <div style="display: flex; justify-content: space-between;">
                <BaseButton v-show="tab === 2" :label="$t(`message.${props.saveLabel}`)" type="submit" color="success" />
                <BaseButton :label="$t('message.return')"  color="info" @click="goTo()"/>
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
</style>

