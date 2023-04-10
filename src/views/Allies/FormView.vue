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
import FormControl from '@/components/FormControl.vue';
import statesService from '@/services/states.services';
import alliesService from '@/services/allies.service';
import TabsComponent from '@/components/TabsComponent.vue';
import countriesService from '@/services/countries.service';
import cargosService from '@/services/cargos.service';
import VueTailwindDatepicker from 'vue-tailwind-datepicker';
import { required, maxLength } from '@/utils/i18n-validators';

const props = defineProps({
    path: '',
    saveLabel: '',
    state: {}
})

const dateValue = ref([])
let countriesList = ref([]);
let statesList = ref([]);
let citiesList = ref([]);
let cargosList = ref([]);

const tab = ref(0)
const activeTab = (i) => {
    tab.value = i;
}
const listTabs = [
    { title: 'Aliado' },
    { title: 'Contacto' },
    { title: 'Referidos' }
]

const ally = ref({
    _id: '',
    codigo: "00",
    nombre: "",
    iDFiscal: "",
    pais: countriesList.value,
    state: statesList.value,
    ciudad: citiesList.value,
    calle: "",
    paginaWeb: "",
    nombreContact: "",
    apellidoContact: "",
    cargo: cargosList.value,
    telefonoOfic: "",
    telefonoCelu: "",
    correoContact: "",
    referido: [],
});



const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();


const rules = computed(() => ({
    codigo: { required, maxLength: maxLength(3) },
    nombre: { required, },
    iDFiscal: { required },
}));

const v$ = useValidate(rules, ally);

onMounted(async () => {
    let listPaises = await countriesService.index();
    const optionCountry = listPaises?.paises || [];
    countriesList.value = optionCountry.map((country) => ({ id: country._id, label: country.nombre }));
    let listCargos = await cargosService.allCargos();
    const dataCargos = listCargos?.data.cargos;
    cargosList.value = dataCargos.map((cargo) => ({ id: cargo._id, label: cargo.nombre }));
    if (props.path === 'update') {
        const res = await alliesService.read(route.params);
        ally.value = res.data
       const  { cargo } = res.data
        ally.value.cargo = { id: cargo._id, label: cargo.nombre }
        ally.value.pais = _asignarOpcionesAlSelect(res.data?.pais)
        selectedPais(ally.value.pais, res.data)
    }
});

const _asignarOpcionesAlSelect = (data) => { return { id: data._id, label: data.nombre } };

const remove = (i) => ally.value.referidos.splice(i, 1);
const addItem = () => ally.value.referidos = [...ally.value.referidos, refereridoModel];

const selectedPais = (data, response = {} ) => {
    const { id } = data;
    citiesList.value = [];
    statesList.value = [];
    estadosByPais(id).then((data) => {
        const optionState = data?.estados || [];
        statesList.value = optionState.map((state) => ({ id: state._id, label: state.nombre }));
        if (props.path === 'update'){
            ally.value.state = _asignarOpcionesAlSelect(response?.state)
            selectedCiudad(ally.value.state, response?.ciudad)
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
            ally.value.ciudad = _asignarOpcionesAlSelect(ciudadResponse)
        }
    }).catch(err => {
        console.log(err)
     })

};

const ciudadesByEstados = async (id) => {
    return await citiesService.ciudadesByEstados(id)
}

const action = (ally) => {
    const { _id,
        codigo,
        nombre,
        iDFiscal,
        pais,
        state,
        ciudad,
        calle,
        paginaWeb,
        nombreContact,
        apellidoContact,
        cargo,
        telefonoOfic,
        telefonoCelu,
        correoContact } = ally.value;

    const data = {
        _id,
        codigo,
        nombre,
        iDFiscal,
        pais: pais.id,
        state: state.id,
        ciudad: ciudad.id,
        calle,
        paginaWeb,
        nombreContact,
        apellidoContact,
        cargo: cargo.id,
        telefonoOfic,
        telefonoCelu,
        correoContact
    }
    if (props.path === 'create') {
        return alliesService.create(data)
    }
    return alliesService.update(data);
}

const successMessage = props.path === 'create' ? t("message.ally.created.success") : t("message.ally.updated.success")
const errorMessage = props.path === 'create' ? t("message.ally.created.error") : t("message.ally.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();
    if (result) {
        action(ally)
            .then(() => {
                toast.success(successMessage);
                router.push('/setup/allies');
            })
            .catch(err => {
                if (err.response?.data?.msg) {
                    toast.error(`${errorMessage} ${err.response.data.msg}`)
                    return
                }

                if (err.response.data?.errors) {
                    const errors = err.response.data.errors;
                    let errorStr = '';
                    debugger
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
        <div>
            <div class="container mx-auto">
                <TabsComponent :tabs="listTabs" @tabClick="activeTab">
                    <div class="p-1 mt-0 bg-white border">
                        <div v-show="tab === 0">
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.ally.code')" :help="v$?.codigo?.$errors[0]?.$message">
                                    <FormControl :name="'codigo'" v-model="ally.codigo" :icon="mdiCodeBraces" />
                                </FormField>
                                <FormField :label="$t('message.ally.name')" :help="v$?.nombre?.$errors[0]?.$message">
                                    <FormControl v-model="ally.nombre" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.idFiscal')" :help="v$?.iDFiscal?.$errors[0]?.$message">
                                    <FormControl v-model="ally.iDFiscal" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.country')">
                                    <FormControl v-model="ally.pais" :icon="mdiListStatus" :options="countriesList"
                                        @onSelectChange="selectedPais" />
                                </FormField>
                                <FormField :label="$t('message.ally.state')">
                                    <FormControl v-model="ally.state" :icon="mdiListStatus" :options="statesList" 
                                        @onSelectChange="selectedCiudad"/>
                                </FormField>
                                <FormField :label="$t('message.ally.city')">
                                    <FormControl v-model="ally.ciudad" :icon="mdiListStatus" :options="citiesList" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-2 gap-2">
                                <FormField :label="$t('message.ally.address')">
                                    <FormControl v-model="ally.calle" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.paginaWeb')"
                                    :help="v$?.paginaWeb?.$errors[0]?.$message">
                                    <FormControl v-model="ally.paginaWeb" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                        </div>
                        <div v-show="tab === 1">
                            <div class="grid md:grid-cols-2 gap-2">
                                <FormField :label="$t('message.ally.name')">
                                    <FormControl v-model="ally.nombreContact" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.lastName')">
                                    <FormControl v-model="ally.apellidoContact" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.ally.cargo')">
                                    <FormControl v-model="ally.cargo" :icon="mdiListStatus" :options="cargosList" />
                                </FormField>                                
                                <FormField :label="$t('message.ally.officePhone')">
                                    <FormControl v-model="ally.telefonoOfic" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.movilPhone')">
                                    <FormControl v-model="ally.telefonoCelu" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-2 gap-2">
                                <FormField :label="$t('message.ally.email')">
                                    <FormControl v-model="ally.correoContact" :icon="mdiRenameBox" />
                                </FormField>
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

