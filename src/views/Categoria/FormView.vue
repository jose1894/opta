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
import FormControl from '@/components/FormControl.vue';
import bussinesUnitService from '@/services/bussinesUnit.service';
import categoriesService from '@/services/categories.service'
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

let bussinessUnitList = ref([]);

const selectOptions = [
    { id: 1, label: t('message.category.statuses.active') },
    { id: 0, label: t('message.category.statuses.inactive') },
    { id: 2, label: t('message.category.statuses.deleted') },
];


const category = ref({
    _id: '',
    codigo: "00",
    nombre: "",
    siglas: "",
    unidadNegocio: bussinessUnitList.value,
    estado: selectOptions[0],
});

const rules = computed(() => ({
    codigo: { required, maxLength: maxLength(3) },
    nombre: { required },
}));

const v$ = useValidate(rules, category);

onMounted(async () => {
    let listBussinesUnit = await bussinesUnitService.allBussinesUnitGet();
    const optionBussinesUnit = listBussinesUnit?.data.unidadesNegocio || [];
    bussinessUnitList.value = optionBussinesUnit.map((unit) => ({ id: unit._id, label: unit.nombre }));
    if (props.path === 'update') {
        const res = await categoriesService.read(route.params);
        category.value = res.data
        category.value.unidadNegocio = _asignarOpcionesAlSelect(res.data?.unidadNegocio)
        category.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
    }
});

const _asignarOpcionesAlSelect = (data) => { return { id: data._id, label: data.nombre } };
const selectedBussinesUnit = (data, response = {} ) => {
    const { id } = data;
    console.log(data)

};

const action = (category) => {
    const { _id,
        codigo,
        nombre,
        siglas,
        unidadNegocio,
        estado } = category.value;

    const data = {
        _id,
        codigo,
        nombre,
        siglas,
        unidadNegocio: unidadNegocio.id,
        estado: estado.id
    }
    console.log(data) 
    if (props.path === 'create') {
        return categoriesService.create(data)
    }
    return categoriesService.update(data);
}

const successMessage = props.path === 'create' ? t("message.category.created.success") : t("message.category.updated.success")
const errorMessage = props.path === 'create' ? t("message.category.created.error") : t("message.category.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();
    if (result) {
        action(category)
            .then(() => {
                toast.success(successMessage);
                router.push('/setup/categories');
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
</script>

<template>
    <CardBox isForm @submit.prevent="submit">
        <div>
            <div class="container mx-auto">
                <div class="grid md:grid-cols-3 gap-3">
                    <FormField :label="$t('message.category.code')" :help="v$?.codigo?.$errors[0]?.$message">
                        <FormControl v-model="category.codigo" :icon="mdiRenameBox" />
                    </FormField>
                    <FormField :label="$t('message.category.name')" :help="v$?.nombre?.$errors[0]?.$message">
                        <FormControl v-model="category.nombre" :icon="mdiRenameBox" />
                    </FormField>
                    <FormField :label="$t('message.category.acronyms')" :help="v$?.siglas?.$errors[0]?.$message">
                        <FormControl v-model="category.siglas" :icon="mdiRenameBox" />
                    </FormField>                    
                </div>
                <div class="grid md:grid-cols-2 gap-2">
                    <FormField :label="$t('message.category.businessUnit')">
                        <FormControl v-model="category.unidadNegocio" :icon="mdiListStatus" :options="bussinessUnitList"
                            @onSelectChange="selectedBussinesUnit" />
                    </FormField>
                    <FormField :label="$t('message.category.status')" :help="v$?.estado?.$errors[0]?.$message">
                        <FormControl v-model="category.estado" :icon="mdiListStatus" :options="selectOptions" />
                    </FormField>
                </div>
            </div>
        </div>
        <template #footer>
            <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="success" />
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

