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
import TabsComponent from '@/components/TabsComponent.vue';
import countriesService from '@/services/countries.service';
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

const refereridoModel = {
    cliente: "",
    fecha: "",
    referido: "",
    idFiscalReferido: "",
    direccionReferido: "",
    contactos: "",
    licenciasActivas: 0
}

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
    idFiscal: "",
    pais: countriesList.value,
    state: statesList.value,
    ciudad: citiesList.value,
    direccion: "",
    paginaWeb: "",
    nombreContacto: "",
    apellidoContacto: "",
    cargo: "",
    telefonoOficina: "",
    telefonoMovil: "",
    cliente: "",
    fecha: "",
    referido: "",
    idFiscalReferido: "",
    direccionReferido: "",
    contactos: "",
    licenciasActivas: 0,
    referidos: [{
        cliente: "",
        fecha: "",
        referido: "",
        idFiscalReferido: "",
        direccionReferido: "",
        contactos: "",
        licenciasActivas: 0
    }]
});



const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();


const rules = computed(() => ({
    codigo: { required, maxLength: maxLength(3) },
    nombre: { required, },
    idFiscal: { required },
}));

const v$ = useValidate(rules, ally);

onMounted(async () => {
    let listPaises = await countriesService.index();
    const optionCountry = listPaises?.paises || [];
    countriesList.value = optionCountry.map((country) => ({ id: country._id, label: country.nombre }));
    let stateListBd = await statesService.index();
    const optionState = stateListBd?.estados || [];
    statesList.value = optionState.map((state) => ({ id: state._id, label: state.nombre }));
    let listCity = await citiesService.index();
    const optionCity = listCity?.ciudades || [];
    citiesList.value = optionCity.map((country) => ({ id: country._id, label: country.nombre }));

});

const remove = (i) => ally.value.referidos.splice(i, 1);
const addItem = () => ally.value.referidos = [...ally.value.referidos, refereridoModel];

const action = (ally) => {
    const {referidos} = ally.value;
    console.log(ally.value, props.path, referidos)
    //const {_id, codigo, nombre, estado, state } = city.value;
    //const data = {_id, codigo, nombre, estado: estado.id, state: state.id}
    if (props.path === 'create') {
        //return citiesService.create(data)
    }

    //return citiesService.update(data);
}


const submit = async () => {
    const result = await v$.value.$validate();
    console.log(result)

    if (result) {
        action(ally)
            .then(() => {
                toast.success(successMessage);
                router.push('/setup/cities');
            })
            .catch(err => {
                if (err.response.data?.msg) {
                    toast.error(`${t("message.city.created.error")} ${err.response.data.msg}`)
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
                                <FormField :label="$t('message.ally.idFiscal')" :help="v$?.idFiscal?.$errors[0]?.$message">
                                    <FormControl v-model="ally.idFiscal" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.country')">
                                    <FormControl v-model="ally.pais" :icon="mdiListStatus" :options="countriesList" />
                                </FormField>
                                <FormField :label="$t('message.ally.state')">
                                    <FormControl v-model="ally.estado" :icon="mdiListStatus" :options="statesList" />
                                </FormField>
                                <FormField :label="$t('message.ally.city')">
                                    <FormControl v-model="ally.ciudad" :icon="mdiListStatus" :options="citiesList" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-2 gap-2">
                                <FormField :label="$t('message.ally.address')">
                                    <FormControl v-model="ally.direccion" :icon="mdiRenameBox" />
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
                                    <FormControl v-model="ally.nombreContacto" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.lastName')">
                                    <FormControl v-model="ally.apellidoContacto" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-3 gap-3">
                                <FormField :label="$t('message.ally.cargo')">
                                    <FormControl v-model="ally.cargo" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.officePhone')">
                                    <FormControl v-model="ally.telefonoOficina" :icon="mdiRenameBox" />
                                </FormField>
                                <FormField :label="$t('message.ally.movilPhone')">
                                    <FormControl v-model="ally.telefonoMovil" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                            <div class="grid md:grid-cols-2 gap-2">
                                <FormField :label="$t('message.ally.email')">
                                    <FormControl v-model="ally.correo" :icon="mdiRenameBox" />
                                </FormField>
                            </div>
                        </div>
                        <div v-show="tab === 2">
                            <div v-for="(field, i) in ally.referidos" :key="i">
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
                            </div>
                        </div>
                    </div>
                </TabsComponent>
            </div>
        </div>
        <template #footer>
            <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="info" />
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

