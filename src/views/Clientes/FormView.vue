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
import BaseButtons from "@/components/BaseButtons.vue";
import citiesService from '@/services/cities.service';
import FormControl from '@/components/FormControl.vue';
import statesService from '@/services/states.services';
import clientsService from '@/services/clients.srvice';
import TabsComponent from '@/components/TabsComponent.vue';
import countriesService from '@/services/countries.service';
import cargosService from '@/services/cargos.service';
import industriesServices from '@/services/Industries.service';
import membersServices from '@/services/member.service';
import { required, maxLength } from '@/utils/i18n-validators';

const props = defineProps({
    path: '',
    saveLabel: '',
    state: {}
})

const { t } = useI18n();
const dateValue = ref([])
let countriesList = ref([]);
let statesList = ref([]);
let citiesList = ref([]);
let cargosList = ref([]);
let industriesList = ref([]);
let miembroList = ref([]);
let clientId = '';

const tab = ref(0)
const activeTab = (i) => {
    tab.value = i;
}

const option  = [
    { id: 1, label: t('message.yes') },
    { id: 2, label: t('message.no') },
];

let listTabs = [
    { title: t('message.client.tab.client') },
    { title: t('message.client.tab.contacts')},
    /*{ title: 'Referidos' }*/
]

const selectOptions = [
    { id: 1, label: t('message.client.statuses.active') },
    { id: 0, label: t('message.client.statuses.inactive') },
    { id: 2, label: t('message.client.statuses.deleted') },
];

const contacts = ref({
    contact: [{
        nombre: "",
        apellido: "",
        cargo: miembroList.value,
        telefonoOfic: "",
        telefonoCelu: "",
        correo: "",
        cliente: "",
    }],
});


const client = ref({
    _id: '',
    codigo: "00",
    nombre: "",
    iDFiscal: "",
    companiaListada: option[0], 
    companiaRegulada: option[0],
    casaMatriz: "",
    industria: industriesList.value,
    pais: countriesList.value,
    state: statesList.value,
    ciudad: citiesList.value,    
    calle: "",
    paginaWeb: "",
    direccion: "",
    miembro: miembroList.value,
    estado: selectOptions[0],
});

const toast = useToast();
const route = useRoute();
const router = useRouter();


const rules = computed(() => ({
    codigo: { required, maxLength: maxLength(3) },
    nombre: { required, },
    iDFiscal: { required },
}));

const v$ = useValidate(rules, client);

onMounted(async () => {
    let listPaises = await countriesService.index();
    const optionCountry = listPaises?.paises || [];
    countriesList.value = optionCountry.map((country) => ({ id: country._id, label: country.nombre }));
    let listCargos = await cargosService.allCargos();
    const dataCargos = listCargos?.data.cargos;
    cargosList.value = dataCargos.map((cargo) => ({ id: cargo._id, label: cargo.nombre }));
    let listarIndustrias = await industriesServices.allIndustrias()
    const dataIndustrias = listarIndustrias?.data.industrias;
    industriesList.value = dataIndustrias.map((industria) => ({ id: industria._id, label: industria.nombre }));

    let listarMiembros = await membersServices.allMiembrosGet()
    const dataMiembros = listarMiembros?.data.miembros;
    miembroList.value = dataMiembros.map((miembro) => ({ id: miembro._id, label: miembro.nombre }));
    if (props.path === 'update') {
        const res = await clientsService.read(route.params);
        client.value = res.data
       const  { cargo, estado, industria, companiaListada,companiaRegulada } = res.data
        client.value.cargo = { id: cargo._id, label: cargo.nombre }
        client.value.industria = { id: industria._id, label: industria.nombre }
        client.value.pais = _asignarOpcionesAlSelect(res.data?.pais)
        client.value.estado = selectOptions.filter(status => status.id === estado)[0]
        client.value.companiaListada = selectOptions.filter(company => company.id === companiaListada)[0]
        client.value.companiaRegulada = selectOptions.filter(company => company.id === companiaRegulada)[0]
        client.value.miembro = _asignarOpcionesAlSelect(res.data?.miembro)
        selectedPais(ally.value.pais, res.data)
    }
});

const _asignarOpcionesAlSelect = (data) => { return { id: data._id, label: data.nombre } };

const selectedPais = (data, response = {} ) => {
    const { id } = data;
    citiesList.value = [];
    statesList.value = [];
    estadosByPais(id).then((data) => {
        const optionState = data?.estados || [];
        statesList.value = optionState.map((state) => ({ id: state._id, label: state.nombre }));
        if (props.path === 'update'){
            client.value.state = _asignarOpcionesAlSelect(response?.state)
            selectedCiudad(client.value.state, response?.ciudad)
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
        if (props.path === 'update'){
            client.value.ciudad = _asignarOpcionesAlSelect(ciudadResponse)
        }
    }).catch(err => {
        console.log(err)
     })

};

const ciudadesByEstados = async (id) => {
    return await citiesService.ciudadesByEstados(id)
}

const action = (client) => {
    const { _id,
        codigo,
        nombre,
        iDFiscal,
        pais,
        state,
        ciudad,
        companiaListada, 
        companiaRegulada, 
        casaMatriz,
        industria,
        calle,
        paginaWeb,
        direccion,
        miembro,
        estado } = client.value;

    const data = {
        _id,
        codigo,
        nombre,
        iDFiscal,
        pais: pais.id,
        state: state.id,
        ciudad: ciudad.id,
        companiaListada: companiaListada.id, 
        companiaRegulada: companiaRegulada.id, 
        casaMatriz,
        industria: industria.id,
        calle,
        paginaWeb,        
        direccion,
        miembro: miembro.id,
        estado: estado.id
    }
    if (props.path === 'create') {
        return clientsService.create(data)
    }
    return clientsService.update(data);
}

const successMessage = props.path === 'create' ? t("message.client.created.success") : t("message.client.updated.success")
const errorMessage = props.path === 'create' ? t("message.client.created.error") : t("message.client.updated.error")

const saveClient = async () => {
    const result = await v$.value.$validate();
    
    const dataContact = contacts.value.contact
    contacts.value.contact = dataContact.map((contact) => {
                                            contact.cliente = '111'
                                            return contact;
                                        })
    console.log(contacts.value.contact)
    if (result) {
        action(client)
            .then((result) => {
                console.log(result)
                const { data } = result
                clientId = data._id
                contacts.value.contact[0].cliente = data._id
                //listTabs.push({ title: t('message.client.tab.contacts')})
               // toast.success(successMessage);
               // router.push('/setup/clients');
            })
            .catch(err => {
                if (err.response?.data?.msg) {
                    toast.error(`${errorMessage} ${err.response.data.msg}`)
                    return
                }

                if  (err.response.data?.errors){
                    const errors = err.response.data.errors;          
                    const result = Object.keys(errors).map(function(key, index) {
                        const error = errors[key]
                        return error.length > 1 ? error.map(i => error[i]).join() : error[0];
                    });
                    console.log(result.length, result)
                    let errorStr = result.length > 1 ? result.map(i => result[i]).join() : result[0];
                    //toast.error(`${errorStr}`)
                    toast.error(`Error al procesar la data`)
                }
            })
    } else {
        console.log('error')
    }
}

const addItem = async (i) => { 
    contacts.value.contact.push ({
        nombre: "",
        apellido: "",
        cargo: miembroList.value,
        telefonoOfic: "",
        telefonoCelu: "",
        correo: "",
        cliente: clientId,
    })
}

const removeItem = async (i) => { 
    console.log('remove***' + i)

}

const submit = async () => {
    console.log(`Error submit`)
    
    const result = await v$.value.$validate();
    if (result) {
        action(client)
            .then(() => {
                toast.success(successMessage);
                router.push('/setup/clients');
            })
            .catch(err => {
                if (err.response?.data?.msg) {
                    toast.error(`${errorMessage} ${err.response.data.msg}`)
                    return
                }

                if  (err.response.data?.errors){
                    const errors = err.response.data.errors;          
                    const result = Object.keys(errors).map(function(key, index) {
                        const error = errors[key]
                        return error.length > 1 ? error.map(i => error[i]).join() : error[0];
                    });
                    console.log(result.length, result)
                    let errorStr = result.length > 1 ? result.map(i => result[i]).join() : result[0];
                    //toast.error(`${errorStr}`)
                    toast.error(`Error al procesar la data`)
                }
            })
    } else {
        console.log('error')
    }
};
</script>

<template>
    <CardBox isForm @submit.prevent="submit">
        <div>
            <div class="container mx-auto">
                <TabsComponent :tabs="listTabs" @tabClick="activeTab">
                    <div class="p-1 mt-0 bg-white border">
                        <div v-show="tab === 0">
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.client.code')" :help="v$?.codigo?.$errors[0]?.$message">
                                    <FormControl :name="'codigo'" v-model="client.codigo" :icon="mdiCodeBraces" />
                                </FormField>
                                <FormField :label="$t('message.client.name')" :help="v$?.nombre?.$errors[0]?.$message">
                                    <FormControl v-model="client.nombre" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.client.idFiscal')" :help="v$?.iDFiscal?.$errors[0]?.$message">
                                    <FormControl v-model="client.iDFiscal" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.client.industry')">
                                    <FormControl v-model="client.industria" :icon="mdiListStatus" :options="industriesList"/>
                                </FormField>
                                <FormField :label="$t('message.client.listedCompany')">
                                    <FormControl v-model="client.companiaListada" :icon="mdiListStatus" :options="option" />
                                </FormField>
                                <FormField :label="$t('message.client.regulatedCompany')">
                                    <FormControl v-model="client.companiaRegulada" :icon="mdiListStatus" :options="option" />
                                </FormField>
                                <FormField :label="$t('message.client.parentCompany')">
                                    <FormControl v-model="client.casaMatriz" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.client.country')">
                                    <FormControl v-model="client.pais" :icon="mdiListStatus" :options="countriesList"
                                        @onSelectChange="selectedPais" />
                                </FormField>
                                <FormField :label="$t('message.client.state')">
                                    <FormControl v-model="client.state" :icon="mdiListStatus" :options="statesList" 
                                        @onSelectChange="selectedCiudad"/>
                                </FormField>
                                <FormField :label="$t('message.client.city')">
                                    <FormControl v-model="client.ciudad" :icon="mdiListStatus" :options="citiesList" />
                                </FormField>
                                <FormField :label="$t('message.client.street')">
                                    <FormControl v-model="client.calle" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.client.paginaWeb')">
                                    <FormControl v-model="client.paginaWeb" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.client.address')">
                                    <FormControl v-model="client.calle" :icon="mdiRenameBox" />
                                </FormField>

                                <FormField :label="$t('message.client.membership')">
                                    <FormControl v-model="client.miembro" :icon="mdiListStatus" :options="miembroList"/>
                                </FormField>

                                <FormField :label="$t('message.client.status')">
                                    <FormControl v-model="client.estado" :icon="mdiListStatus" :options="selectOptions" />
                                </FormField>
                            </div>
                            <BaseButton  :label="$t(`message.${props.saveLabel}`)" color="info" @click="saveClient"/>
                        </div>
                        <div v-show="tab === 1">
                            
                            <div v-for="(field, i) in contacts.contact" :key="i">
                                <div class="btn-add-remove">
                                    <h2 class="h2-tittle">Contacto. {{ i + 1 }}</h2>
                                    <button type="button" class="btn-add-referidos" @click="addItem(i)">
                                                        +
                                    </button>
                                    <button type="button" class="btn-remove-referidos" v-show="i > 0" @click="removeItem(i)">
                                                        -
                                    </button>
                                </div>

                                <div class="grid md:grid-cols-3 gap-3">
                                    <FormField :label="$t('message.client.name')">
                                        <FormControl v-model="contacts.contact[i].name" :icon="mdiRenameBox" />
                                    </FormField>                                
                                    <FormField :label="$t('message.client.lastName')">
                                        <FormControl v-model="contacts.contact[i].apellido" :icon="mdiRenameBox" />
                                    </FormField>
                                    <FormField :label="$t('message.client.jobPosition')">
                                        <FormControl v-model="contacts.contact[i].cargo" :icon="mdiListStatus" :options="cargosList" />
                                    </FormField>
                                    <FormField :label="$t('message.client.officePhone')">
                                        <FormControl v-model="contacts.contact[i].telefonoOfic" :icon="mdiRenameBox" />
                                    </FormField>
                                    <FormField :label="$t('message.client.movilPhone')">
                                        <FormControl v-model="contacts.contact[i].telefonoCelu" :icon="mdiRenameBox" />
                                    </FormField>email
                                    <FormField :label="$t('message.client.email')">
                                        <FormControl v-model="contacts.contact[i].correo" :icon="mdiRenameBox" />
                                    </FormField>
                                </div>
                            
                            </div>
                        </div>
                        <div v-show="tab === 2">
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
            <BaseButton v-show="tab === 1" :label="$t(`message.${props.saveLabel}`)" type="submit" color="info" />
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

