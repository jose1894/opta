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

const { t } = useI18n();
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

const selectOptions = [
    { id: 1, label: t('message.ally.statuses.active') },
    { id: 0, label: t('message.ally.statuses.inactive') },
];

const ally = ref({
    _id: '',
    codigo: "00",
    nombre: "",
    iDFiscal: "",
    pais: countriesList.value,
    state: statesList.value,
    ciudad: citiesList.value,
    direccionAliado: "",
    paginaWeb: "",
    nombreContact: "",
    apellidoContact: "",
    cargo: cargosList.value,
    telefonoOfic: "",
    telefonoCelu: "",
    correoContact: "",
    referido: [],
    estado: selectOptions[0],
});

const toast = useToast();
const route = useRoute();
const router = useRouter();


const rules = computed(() => ({
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
        const { aliado, referidos } = res.data
        ally.value = aliado
        const { cargo, estado } = aliado
        ally.value.cargo = { id: cargo._id, label: cargo.nombre }
        ally.value.pais = _asignarOpcionesAlSelect(aliado?.pais)
        ally.value.estado = selectOptions.filter(status => status.id === estado)[0]
        ally.value.referidos = referidos
        selectedPais(ally.value.pais, aliado)
        console.log(ally)
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
        if (props.path === 'update') {
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
        direccionAliado,
        paginaWeb,
        nombreContact,
        apellidoContact,
        cargo,
        telefonoOfic,
        telefonoCelu,
        correoContact,
        estado } = ally.value;

    const data = {
        _id,
        codigo,
        nombre,
        iDFiscal,
        pais: pais.id,
        state: state.id,
        ciudad: ciudad.id,
        direccionAliado,
        paginaWeb,
        nombreContact,
        apellidoContact,
        cargo: cargo.id,
        telefonoOfic,
        telefonoCelu,
        correoContact,
        estado: estado.id
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
                    const result = Object.keys(errors).map(function (key, index) {
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
const goTo = () => router.push('/setup/allies')
</script>

<template>
    <CardBox isForm @submit.prevent="submit">
        <div>
            <div class="container mx-auto">
                <TabsComponent :tabs="listTabs" @tabClick="activeTab">
                    <div class="p-1 mt-0 bg-white border">
                        <div v-show="tab === 0">
                            <div :class="path !== 'create' ? 'grid md:grid-cols-3 gap-3' : 'grid md:grid-cols-2 gap-3'">
                                <FormField v-show="path !== 'create'" :label="$t('message.ally.code')">
                                    <FormControl :name="'codigo'" v-model="ally.codigo" :icon="mdiCodeBraces" readonly="true"/>
                                </FormField>
                                <FormField :label="$t('message.ally.name')" :help="v$?.nombre?.$errors[0]?.$message">
                                    <FormControl v-model="ally.nombre" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.idFiscal')" :help="v$?.iDFiscal?.$errors[0]?.$message">
                                    <FormControl v-model="ally.iDFiscal" :icon="mdiRenameBox" />
                                </FormField>                                
                            </div>
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.ally.country')">
                                    <FormControl v-model="ally.pais" :icon="mdiListStatus" :options="countriesList"
                                        @onSelectChange="selectedPais" />
                                </FormField>
                                <FormField :label="$t('message.ally.state')">
                                    <FormControl v-model="ally.state" :icon="mdiListStatus" :options="statesList"
                                        @onSelectChange="selectedCiudad" />
                                </FormField>
                                <FormField :label="$t('message.ally.city')">
                                    <FormControl v-model="ally.ciudad" :icon="mdiListStatus" :options="citiesList" />
                                </FormField>                            
                            </div>
                            <div class="grid md:grid-cols-2 gap-3">
                                <FormField :label="$t('message.ally.paginaWeb')"
                                    :help="v$?.paginaWeb?.$errors[0]?.$message">
                                    <FormControl v-model="ally.paginaWeb" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.status')">
                                    <FormControl v-model="ally.estado" :icon="mdiListStatus" :options="selectOptions" />
                                </FormField>
                            </div>
                            <div class="grid gap-3">
                                <FormField :label="$t('message.ally.address')">
                                    <FormControl type="textarea" v-model="ally.direccionAliado" :icon="mdiRenameBox" />
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
                            <div class="grid md:grid-cols-2 gap-2">
                                <FormField :label="$t('message.ally.cargo')">
                                    <FormControl v-model="ally.cargo" :icon="mdiListStatus" :options="cargosList" />
                                </FormField>
                                <FormField :label="$t('message.ally.officePhone')">
                                    <FormControl v-model="ally.telefonoOfic" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-2 gap-2">
                                <FormField :label="$t('message.ally.movilPhone')">
                                    <FormControl v-model="ally.telefonoCelu" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.email')">
                                    <FormControl v-model="ally.correoContact" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                        </div>
                        <div v-show="tab === 2">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{{ $t('message.member.id') }}</th>
                                        <th>{{ $t('message.member.name') }}</th>
                                        <th>{{ $t('message.member.paginaWeb') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(referido, index) in ally.referidos" :key="referido._id" >
                                        <td :data-label="$t('message.member.id')">
                                            {{ referido.iDFiscal }}
                                        </td>
                                        <td :data-label="$t('message.member.name')">
                                            {{ referido.nombre }}
                                        </td>
                                        <td :data-label="$t('message.member.paginaWeb')">
                                            {{ referido.paginaWeb }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsComponent>
            </div>
        </div>
        <template #footer>            
            <div style="display: flex; justify-content: space-between;">
                <BaseButton v-show="tab === 1" :label="$t(`message.${props.saveLabel}`)" type="submit" color="success" />
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

