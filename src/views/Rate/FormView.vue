<script setup>
import {
    reactive,
    computed,
    defineProps,
    onMounted,
    ref,
    inject
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
import VueTailwindDatepicker from 'vue-tailwind-datepicker';
import bussinesUnitService from '@/services/bussinesUnit.service';
import categoriesService from '@/services/categories.service'
import { required, maxLength } from '@/utils/i18n-validators';
import ratesService from '@/services/rates.service'
import moment from "moment";

const props = defineProps({
    path: '',
    saveLabel: '',
    state: {}
})
const formatter = ref({
    date: 'DD-MM-YYYY',
    month: 'MMM'
})

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();
let bussinessUnitList = ref([]);
let categoriasList = ref([]);
let disabledOption = ref([false]);

const selectOptions = [
    { id: 1, label: t('message.rate.statuses.active') },
    { id: 0, label: t('message.rate.statuses.inactive') }
];


const rate = ref({
    _id: '',
    codigo: "00",
    fecha: moment(new Date(), 'DD-MM-YYYY').format('DD-MM-YYYY'),
    siglas: "",
    categoria: categoriasList.value,
    unidadNegocio: bussinessUnitList.value,
    actual: 0,
    anterior: 0,
    estado: selectOptions[0],
});

const rules = computed(() => ({
    codigo: { required },
    fecha: { required },
    siglas: { required },
}));

const v$ = useValidate(rules, rate);

onMounted(async () => {
    let listBussinesUnit = await bussinesUnitService.allBussinesUnitGet();
    const optionBussinesUnit = listBussinesUnit?.data.unidadesNegocio || [];
    bussinessUnitList.value = optionBussinesUnit.map((unit) => ({ id: unit._id, label: unit.nombre }));
    if (props.path === 'update') {
        const res = await ratesService.read(route.params);
        const format = 'DD-MM-YYYY';
        const fecha = moment(res.data.fecha).format(format)
        rate.value = res.data
        rate.value.fecha = fecha
        rate.value.unidadNegocio = _asignarOpcionesAlSelect(res.data?.unidadNegocio)
        rate.value.estado = selectOptions.filter(status => status.id === res.data.estado)[0]
        selectedBussinesUnit(rate.value.unidadNegocio, res.data?.categoria)          
        const simulateToken = moment(rate.value.fecha, format)
        const simulateNow   = moment(new Date(), format)
        disabledOption.value = simulateNow.isAfter(simulateToken)
        console.log(disabledOption)
    }
});
const _asignarOpcionesAlSelect = (data) => { return { id: data._id, label: data.nombre } };

const selectedBussinesUnit = (data, response = {} ) => {
    const { id } = data;
    categoriasList.value = []
    categoriaByUnidadNegocio(id).then((data) => {
        const optionsCategorias = data.data.categorias || [];
        categoriasList.value = optionsCategorias.map((state) => ({ id: state._id, label: state.nombre }));
        if (props.path === 'update'){
          rate.value.categoria = _asignarOpcionesAlSelect(response)
        }
    }).catch(err => {
        console.log(err)
     })

};

const categoriaByUnidadNegocio = async (id) => {
    return await categoriesService.categoriasPorUnidadNegocio(id)
}

const action = (rate) => {
    const { _id,
        codigo,
        fecha,
        siglas,
        unidadNegocio,
        categoria,
        actual,
        anterior,        
        estado } = rate.value;

    const data = {
        _id,
        codigo,
        fecha: fecha.undefined,
        siglas: siglas.toUpperCase(),
        unidadNegocio: unidadNegocio.id,
        categoria: categoria.id,
        actual,
        anterior,         
        estado: estado.id
    }
    if (props.path === 'create') {
        data.fecha = moment(new Date(), 'DD-MM-YYYY').format('DD-MM-YYYY')
        return ratesService.create(data)
    }
    return ratesService.update(data);
}

const successMessage = props.path === 'create' ? t("message.rate.created.success") : t("message.rate.updated.success")
const errorMessage = props.path === 'create' ? t("message.rate.created.error") : t("message.rate.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();
    if (result) {
        action(rate)
            .then(() => {
                toast.success(successMessage);
                router.push('/setup/rates');
            })
            .catch(err => {
                if (err.response?.data?.msg) {
                    toast.error(`${errorMessage} ${err.response.data.msg}`)
                    return
                }

                if (err.response.data?.errors) {
                    const errors = err.response.data.errors;
                    let errorStr = '';
                    
                    // for (let attr of errors) {
                    // }
                    for (let value of Object.values(errors)) {
                        value.forEach(function(value, index) {
                            errorStr+= value;
                        });                        
                    }
                    toast.error(`${errorStr}`)                    
                }
            })
    } else {
        console.log('error')
    }
};

const onClickSomething = (newDate) => {
  console.log(newDate) // newDate instanceof dayjs
  console.log(rate.value.fecha)
}

const dDate = (date) => {
    console.log(date, rate.value.fecha)
    console.log(date <= new Date() )
    const format = 'DD-MM-YYYY'; 

const simulateToken = moment('01-05-2023', format)
const simulateNow   = moment(new Date(), format)

console.log('simulateNow ES MAYOR A simulateToken?', simulateNow.isAfter(simulateToken));

  return simulateNow.isBefore(simulateToken) 
  //|| date > new Date(2023, 0, 8);
}

const goTo = () => router.push('/setup/rates')
</script>

<template>
    <CardBox isForm @submit.prevent="submit">
        <div>
            <div class="container mx-auto">
                <div class="grid md:grid-cols-3 gap-3">
                    <FormField :label="$t('message.rate.code')" :help="v$?.codigo?.$errors[0]?.$message">
                        <FormControl 
                            :name="'codigo'" 
                            v-model="rate.codigo" 
                            :icon="mdiCodeBraces" />
                    </FormField>
                    <FormField :label="$t('message.rate.date')">
                        <vue-tailwind-datepicker 
                            class="h-12 border-gray-700"
                            :formatter="formatter"
                            as-single 
                            v-model="rate.fecha" 
                            :disabled="true"/>
                    </FormField> 
                    <FormField :label="$t('message.rate.acronyms')" :help="v$?.siglas?.$errors[0]?.$message">
                        <FormControl v-model="rate.siglas" :icon="mdiRenameBox" />
                    </FormField>
                    <!-- <FormField :label="$t('message.rate.name')" :help="v$?.nombre?.$errors[0]?.$message">
                        <FormControl v-model="rate.nombre" :icon="mdiRenameBox" />
                    </FormField> -->
                    <FormField :label="$t('message.rate.businessUnit')">
                        <FormControl v-model="rate.unidadNegocio" :icon="mdiListStatus" :options="bussinessUnitList"
                            @onSelectChange="selectedBussinesUnit" />
                    </FormField>
                    <FormField :label="$t('message.rate.categories')">
                        <FormControl v-model="rate.categoria" :icon="mdiListStatus" :options="categoriasList"/>
                    </FormField>                   
                    <FormField :label="$t('message.rate.currentRate')">
                        <FormControl v-model="rate.actual" :icon="mdiRenameBox" />                        
                    </FormField>
                    <!-- <ElCurrencyInput v-model="rate.actual" :options="{ currency: 'EUR'}" /> -->
                    
                </div>
                <div class="grid md:grid-cols-2 gap-2">
                    <FormField :label="$t('message.rate.previousRate')">
                        <FormControl v-model="rate.anterior" :icon="mdiRenameBox" />
                    </FormField>
                    <FormField :label="$t('message.rate.status')" :help="v$?.estado?.$errors[0]?.$message">
                        <FormControl v-model="rate.estado" :icon="mdiListStatus" :options="selectOptions" />
                    </FormField>
                </div>
            </div>
        </div>
        <template #footer>            
            <div style="display: flex; justify-content: space-between;">
                <BaseButton :label="$t(`message.${props.saveLabel}`)" type="submit" color="success" />
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

