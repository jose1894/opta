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
    { id: 1, label: t('message.bussinesUnit.statuses.active') },
    { id: 0, label: t('message.bussinesUnit.statuses.inactive') },
    { id: 2, label: t('message.bussinesUnit.statuses.deleted') },
];


const bussinesUnit = ref({
    _id: '',
    codigo: "00",
    nombre: "",
    siglas: "",
    estado: selectOptions[0],
});

const rules = computed(() => ({
    codigo: { required, maxLength: maxLength(3) },
    nombre: { required, },
    siglas: { required },
}));

const v$ = useValidate(rules, bussinesUnit);

onMounted(async () => {
    if (props.path === 'update') {
        const res = await bussinesUnitService.read(route.params);
        bussinesUnit.value = res.data
        bussinesUnit.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
    }
});

const action = (bussinesUnit) => {
    const { _id,
        codigo,
        nombre,
        siglas,
        estado } = bussinesUnit.value;

    const data = {
        _id,
        codigo,
        nombre,
        siglas,
        estado: estado.id
    }
    if (props.path === 'create') {
        return bussinesUnitService.create(data)
    }
    return bussinesUnitService.update(data);
}

const successMessage = props.path === 'create' ? t("message.bussinesUnit.created.success") : t("message.bussinesUnit.updated.success")
const errorMessage = props.path === 'create' ? t("message.bussinesUnit.created.error") : t("message.bussinesUnit.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();
    if (result) {
        action(bussinesUnit)
            .then(() => {
                toast.success(successMessage);
                router.push('/setup/businessUnit');
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
                <div class="grid md:grid-cols-4 gap-4">
                    <FormField :label="$t('message.bussinesUnit.code')" :help="v$?.codigo?.$errors[0]?.$message">
                        <FormControl :name="'codigo'" v-model="bussinesUnit.codigo" :icon="mdiCodeBraces" />
                    </FormField>
                    <FormField :label="$t('message.bussinesUnit.name')" :help="v$?.nombre?.$errors[0]?.$message">
                        <FormControl v-model="bussinesUnit.nombre" :icon="mdiRenameBox" />
                    </FormField>
                    <FormField :label="$t('message.bussinesUnit.acronyms')" :help="v$?.siglas?.$errors[0]?.$message">
                        <FormControl v-model="bussinesUnit.siglas" :icon="mdiRenameBox" />
                    </FormField>
                    <FormField :label="$t('message.bussinesUnit.status')" :help="v$?.estado?.$errors[0]?.$message">
                        <FormControl v-model="bussinesUnit.estado" :icon="mdiListStatus" :options="selectOptions" />
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

