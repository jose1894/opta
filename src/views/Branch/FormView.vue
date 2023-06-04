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
import countriesService from '@/services/countries.service';
import branchesService from '@/services/branches.service';
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

const selectOptions = [
    { id: 1, label: t('message.branch.statuses.active') },
    { id: 0, label: t('message.branch.statuses.inactive') },
    { id: 2, label: t('message.branch.statuses.deleted') },
];

let countriesList = ref([]);
let statesList = ref([]);
let citiesList = ref([]);

const branch = ref({
    _id: '',
    codigo: "00",
    nombre: "",
    siglas: "",
    pais: countriesList.value,
    state: statesList.value,
    ciudad: citiesList.value,
    estado: selectOptions[0],
});

const rules = computed(() => ({
    codigo: { required, maxLength: maxLength(3) },
    nombre: { required, },
    siglas: { required },
}));

const v$ = useValidate(rules, branch);

onMounted(async () => {
    let listPaises = await countriesService.index();
    const optionCountry = listPaises?.paises || [];
    countriesList.value = optionCountry.map((country) => ({ id: country._id, label: country.nombre }));

    if (props.path === 'update') {
        const res = await branchesService.read(route.params);
        branch.value = res.data
        branch.value.pais = _asignarOpcionesAlSelect(res.data?.pais)
        selectedPais(branch.value.pais, res.data)
        branch.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
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
            branch.value.state = _asignarOpcionesAlSelect(response?.state)
            selectedCiudad(branch.value.state, response?.ciudad)
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
            branch.value.ciudad = _asignarOpcionesAlSelect(ciudadResponse)
        }
    }).catch(err => {
        console.log(err)
    })

};

const ciudadesByEstados = async (id) => {
    return await citiesService.ciudadesByEstados(id)
}

const action = (branch) => {
    const { _id,
        codigo,
        nombre,
        siglas,
        pais,
        state,
        ciudad,
        estado } = branch.value;

    const data = {
        _id,
        codigo,
        nombre,
        siglas,
        pais: pais.id,
        state: state.id,
        ciudad: ciudad.id,
        estado: estado.id
    }
    if (props.path === 'create') {
        return branchesService.create(data)
    }
    return branchesService.update(data);
}

const successMessage = props.path === 'create' ? t("message.branch.created.success") : t("message.branch.updated.success")
const errorMessage = props.path === 'create' ? t("message.branch.created.error") : t("message.branch.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();
    if (result) {
        action(branch)
            .then(() => {
                toast.success(successMessage);
                router.push('/setup/branches');
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
                <div class="grid md:grid-cols-3 gap-3">
                    <FormField :label="$t('message.branch.code')" :help="v$?.codigo?.$errors[0]?.$message">
                        <FormControl :name="'codigo'" v-model="branch.codigo" :icon="mdiCodeBraces" />
                    </FormField>
                    <FormField :label="$t('message.branch.name')" :help="v$?.nombre?.$errors[0]?.$message">
                        <FormControl v-model="branch.nombre" :icon="mdiRenameBox" />
                    </FormField>
                    <FormField :label="$t('message.branch.acronyms')" :help="v$?.siglas?.$errors[0]?.$message">
                        <FormControl v-model="branch.siglas" :icon="mdiRenameBox" />
                    </FormField>
                </div>
                <div class="grid md:grid-cols-2 gap-2">
                    <FormField :label="$t('message.branch.country')">
                        <FormControl v-model="branch.pais" :icon="mdiListStatus" :options="countriesList"
                            @onSelectChange="selectedPais" />
                    </FormField>
                    <FormField :label="$t('message.branch.state')">
                        <FormControl v-model="branch.state" :icon="mdiListStatus" :options="statesList"
                            @onSelectChange="selectedCiudad" />
                    </FormField>
                </div>

                <div class="grid md:grid-cols-2 gap-2">
                    <FormField :label="$t('message.branch.city')">
                        <FormControl v-model="branch.ciudad" :icon="mdiListStatus" :options="citiesList" />
                    </FormField>
                    <FormField :label="$t('message.branch.status')" :help="v$?.estado?.$errors[0]?.$message">
                        <FormControl v-model="branch.estado" :icon="mdiListStatus" :options="selectOptions" />
                    </FormField>
                </div>
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

