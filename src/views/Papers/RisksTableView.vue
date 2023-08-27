<script setup>
import { computed, ref, defineEmits, defineProps, reactive } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { mdiDelete, mdiPencilOutline, mdiPrinter, mdiRenameBox, mdiListStatus } from "@mdi/js";
import { required } from '@/utils/i18n-validators';
import { useI18n } from "vue-i18n";
import { useToast } from 'vue-toastification';
import BaseLevel from "@/components/BaseLevel.vue";
import FormField from '@/components/FormField.vue';
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import FormControl from '@/components/FormControl.vue';
import CardBox from '@/components/CardBox.vue';
import useValidate from '@vuelidate/core';
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import riesgosServices from '@/services/riesgos.service';

const { t } = useI18n();
const toast = useToast()
const router = useRouter();
const isModalFormRisk = ref(false);
const mainStore = useMainStore();
const selectedRisk = ref([]);
const hasModalValue = false;
const showFormPA = ref(false);

const risksFrom = [
    { id: 'Transacciones Recurrentes', label: t('message.risk.recurringTransactions') },
    { id: 'Transacciones no Recurrentes', label: t('message.risk.nonRecurringTransactions') },
    { id: 'Juicios y Estimaciones', label: t('message.risk.judgmentsAndEstimates') },
    { id: 'accountingClosingEntries', label: t('message.risk.accountingClosingEntries') }
];

const quadrantOption = [
    { id: 0, label: t('message.risk.quadrantI') },
    { id: 1, label: t('message.risk.quadrantII') },
    { id: 2, label: t('message.risk.quadrantII') },
    { id: 3, label: t('message.risk.quadrantIV') },
    { id: 4, label: t('message.risk.othersRisk') }
];

const riskAreaOption = [
    { id: 0, label: t('message.risk.critical') },
    { id: 1, label: t('message.risk.strategic') },
    { id: 3, label: t('message.risk.support') }
];

const radioOptions = [
    { 'Intencionales': t('message.risk.intentional') },
    { 'No Intencionales': t('message.risk.unintentional') },
    { 'Viabilidad del negocio': t('message.risk.businessViability') },
    { 'Expectativas del cliente': t('message.risk.customerExpectations') }
];

const additionalProceduresOptions = [
    { 'Si': t('message.yes') },
    { 'No': t('message.no') },
];

const additionalSelectOptions = [
    { id: 'No aprobado', label: t('message.risk.untried') },
    { id: 'Si', label: t('message.yes') },
    { id: 'No', label: t('message.no') },
];

const additionalSelect2Options = [
    { id: 'No aprobado', label: t('message.risk.untried') },
    { id: 'Efectivo', label: t('message.risk.effective') },
    { id: 'No efectivo', label: t('message.risk.noeffective') },

];

const generalOptions = [
    { id: 'Medio', label: t('message.risk.middle') },
    { id: 'Largo', label: t('message.risk.low') },
    { id: 'Alto', label: t('message.risk.high') },
];

const customElementsENForm = reactive({
    radio: [],
});

const customAdditionalProceduresForm = reactive({
    switch: [],
});

const customElementsForm = reactive({
    switch: []
});

const customElementsFormNo = reactive({
    switch: []
});

const customChekS1Form = reactive({
    checkbox: []
});

const customChekS2Form = reactive({
    checkbox: []
});

const customChekS3Form = reactive({
    checkbox: []
});

const customChekS4Form = reactive({
    checkbox: []
});

const customChekS5Form = reactive({
    checkbox: []
});

const customChekSB1Form = reactive({
    checkbox: []
});

const customChekSB2Form = reactive({
    checkbox: []
});

const customChekSB3Form = reactive({
    checkbox: []
});

const customChekSB4Form = reactive({
    checkbox: []
});

const customChekSC1Form = reactive({
    checkbox: []
});

const customChekSC2Form = reactive({
    checkbox: []
});

const customChekSC3Form = reactive({
    checkbox: []
});

const customChekSC4Form = reactive({
    checkbox: []
});

const props = defineProps({
    path: '',
    saveLabel: ''
})

const dataInitial = {
    _id: '',
    titulo: "",
    descripcion: "",
    ref: "",
    riesgoProveniente: risksFrom[0],
    cuadrante: quadrantOption[0],
    areaRiesgo: riskAreaOption[0],
    expectativasNegocio: "",
    procedimientosAdicionales: "",
    inherente: generalOptions[0],
    control: generalOptions[0],
    analítico: generalOptions[0],
    factorRiesgo: "",
    procesosInvolucrados: "",
    fuentesCausantes: "",
    consecuenciaEF: "",
    ase_a1: "",
    ase_a2: "",
    ase_a3: "",
    ase_a4: "",
    ase_a5: "",
    ase_b1: "",
    ase_b2: "",
    ase_b3: "",
    ase_b4: "",
    ase_c1: "",
    ase_c2: "",
    ase_c3: "",
    ase_c4: "",
    sel_mon: additionalSelectOptions[0],
    sel_mon2: additionalSelectOptions[0],
    sel_gen: additionalSelectOptions[0],
    sel_gen2: additionalSelectOptions[0],
    sel_esp: additionalSelectOptions[0],
    sel_esp2: additionalSelectOptions[0],
    sel2_ini: additionalSelect2Options[0],
    padc_enf: "",
    padc_res: "",
    referencia: "",
    pfo_mpro: "",
    rda_resi: "",
    conclusion: "",
}

const riskDataSave = ref(dataInitial);

const items = computed(() => mainStore.listRisk.riesgos);
const total = computed(() => mainStore.listRisk.total)

const itemsPaginated = computed(() =>
    items.value
);

const perPage = computed(() => mainStore.listRisk.perPage);

const currentPage = computed(() => mainStore.listRisk.page);

/* Sorting */
const currentSort = 'name';
const sortDesc = ref(false);

const sort = (s) => {
    sortDesc.value = !sortDesc.value;
    emit('sort', s, sortDesc.value);
}
/* Sorting */

const numPages = computed(() => Math.ceil(total.value / perPage.value));

const currentPageHuman = computed(() => +currentPage.value);

const pagesList = computed(() => {
    const pagesList = [];

    for (let i = 0; i < numPages.value; i++) {
        pagesList.push(i);
    }

    return pagesList;
});

const emit = defineEmits(['changePage', 'confirm', 'sort'])

const rules = computed(() => ({
    titulo: { required, },
    descripcion: { required },
}));
const v$ = useValidate(rules, riskDataSave);

const changePage = (page) => {
    emit('changePage', page)
}

const openModalForm = (riskData) => {
    const { indice, titulo, descripcion, _id, riesgoProveniente,
        cuadrante, areaRiesgo, expectativasNegocio, procedimientosAdicionales,
        inherente, control, analitico, factorRiesgo, procesosInvolucrados,
        fuentesCausantes, consecuenciaEF, ase_a1, ase_a2, ase_a3, ase_a4,
        ase_a5, ase_b1, ase_b2, ase_b3, ase_b4, ase_c1, ase_c2, ase_c3,
        ase_c4, sel_mon, sel_mon2, sel_gen, sel_gen2, sel_esp, sel_esp2,
        sel2_ini, padc_enf, padc_res, referencia, pfo_mpro, rda_resi,
        conclusion } = riskData
    riskDataSave.value.ref = `${indice.indice} - ${indice.nombre}`
    riskDataSave.value.titulo = titulo
    riskDataSave.value.descripcion = descripcion
    riskDataSave.value._id = _id
    riskDataSave.value.riesgoProveniente = risksFrom.filter(riskItem => riskItem.id === riesgoProveniente)[0]
    riskDataSave.value.cuadrante = quadrantOption.filter(item => item.id === cuadrante)[0]
    riskDataSave.value.areaRiesgo = riskAreaOption.filter(item => item.id === areaRiesgo)[0]
    customElementsENForm.radio = expectativasNegocio
    customElementsForm.switch = procedimientosAdicionales === 'Si' ? [procedimientosAdicionales] : []
    customElementsFormNo.switch = procedimientosAdicionales === 'No' ? [procedimientosAdicionales] : []
    showFormPA.value = procedimientosAdicionales === 'Si' ? true : false
    riskDataSave.value.inherente = generalOptions.filter(item => item.id === inherente)[0]
    riskDataSave.value.control = generalOptions.filter(item => item.id === control)[0]
    riskDataSave.value.analitico = generalOptions.filter(item => item.id === analitico)[0]
    riskDataSave.value.factorRiesgo = factorRiesgo
    riskDataSave.value.procesosInvolucrados = procesosInvolucrados
    riskDataSave.value.fuentesCausantes = fuentesCausantes
    riskDataSave.value.consecuenciaEF = consecuenciaEF
    customChekS1Form.checkbox = ase_a1 !== '' ? [ase_a1] : []
    customChekS2Form.checkbox = ase_a2 !== '' ? [ase_a2] : []
    customChekS3Form.checkbox = ase_a3 !== '' ? [ase_a3] : []
    customChekS4Form.checkbox = ase_a4 !== '' ? [ase_a4] : []
    customChekS5Form.checkbox = ase_a5 !== '' ? [ase_a5] : []

    customChekSB1Form.checkbox = ase_b1 !== '' ? [ase_b1] : []
    customChekSB2Form.checkbox = ase_b2 !== '' ? [ase_b2] : []
    customChekSB3Form.checkbox = ase_b3 !== '' ? [ase_b3] : []
    customChekSB4Form.checkbox = ase_b4 !== '' ? [ase_b4] : []

    customChekSC1Form.checkbox = ase_c1 !== '' ? [ase_c1] : []
    customChekSC2Form.checkbox = ase_c2 !== '' ? [ase_c2] : []
    customChekSC3Form.checkbox = ase_c3 !== '' ? [ase_c3] : []
    customChekSC4Form.checkbox = ase_c4 !== '' ? [ase_c4] : []

    riskDataSave.value.sel_mon = additionalSelectOptions.filter(item => item.id === sel_mon)[0]
    riskDataSave.value.sel_mon2 = additionalSelectOptions.filter(item => item.id === sel_mon2)[0]
    riskDataSave.value.sel_gen = additionalSelectOptions.filter(item => item.id === sel_gen)[0]
    riskDataSave.value.sel_gen2 = additionalSelectOptions.filter(item => item.id === sel_gen2)[0]
    riskDataSave.value.sel_esp = additionalSelectOptions.filter(item => item.id === sel_esp)[0]
    riskDataSave.value.sel_esp2 = additionalSelectOptions.filter(item => item.id === sel_esp2)[0]
    riskDataSave.value.sel2_ini = additionalSelect2Options.filter(item => item.id === sel2_ini)[0]

    riskDataSave.value.padc_enf = padc_enf,
    riskDataSave.value.padc_res = padc_res,
    riskDataSave.value.referencia = referencia,
    riskDataSave.value.pfo_mpro = pfo_mpro,
    riskDataSave.value.rda_resi = rda_resi,
    riskDataSave.value.conclusion = conclusion

    console.log(ase_a1)



    isModalFormRisk.value = true

}

const clearFormValue = () => {

    riskDataSave.value.inherente = generalOptions[0]
    riskDataSave.value.control = generalOptions[0]
    riskDataSave.value.analitico = generalOptions[0]
    riskDataSave.value.factorRiesgo = ""
    riskDataSave.value.procesosInvolucrados = ""
    riskDataSave.value.fuentesCausantes = ""
    riskDataSave.value.consecuenciaEF = ""
    customChekS1Form.checkbox = []
    customChekS2Form.checkbox = []
    customChekS3Form.checkbox = []
    customChekS4Form.checkbox = []
    customChekS5Form.checkbox = []

    customChekSB1Form.checkbox = []
    customChekSB2Form.checkbox = []
    customChekSB3Form.checkbox = []
    customChekSB4Form.checkbox = []

    customChekSC1Form.checkbox = []
    customChekSC2Form.checkbox = []
    customChekSC3Form.checkbox = []
    customChekSC4Form.checkbox = []

    riskDataSave.value.sel_mon = additionalSelectOptions[0]
    riskDataSave.value.sel_mon2 = additionalSelectOptions[0]
    riskDataSave.value.sel_gen = additionalSelectOptions[0]
    riskDataSave.value.sel_gen2 = additionalSelectOptions[0]
    riskDataSave.value.sel_esp = additionalSelectOptions[0]
    riskDataSave.value.sel_esp2 = additionalSelectOptions[0]
    riskDataSave.value.sel2_ini = additionalSelect2Options[0]

    riskDataSave.value.padc_enf = ""
    riskDataSave.value.padc_res = ""
    riskDataSave.value.referencia = ""
    riskDataSave.value.pfo_mpro = ""
    riskDataSave.value.rda_resi = ""
    riskDataSave.value.conclusion = ""
}

const selectedItem = (risk) => selectedRisk.value = risk

const addTitle = () => t('message.audit.riskControlRegistration')

const successMessage = t("message.risk.updated.success")
const errorMessage = t("message.risk.updated.error")

const submit = async () => {
    const result = await v$.value.$validate();
    if (result) {
        action(riskDataSave)
            .then(() => {
                isModalFormRisk.value = false
                changePage(currentPageHuman.value)
                //enfoque.value = dataInitial
                toast.success(successMessage);
            })
            .catch(err => {
                console.log(err)
                if (err.response?.data?.msg) {
                    toast.error(`${t("message.ridk.created.error")} ${err.response.data.msg}`)
                    return
                }

                if (err.response?.data?.errors) {
                    const errors = err.response.data.errors;
                    let errorStr = '';
                    for (let attr of errors) {
                    }
                }
            })
    } else {
        console.log('error')
    }
}

const action = async (riskDatae) => {
    const {
        _id,
        titulo,
        descripcion,
        ref,
        riesgoProveniente,
        cuadrante,
        areaRiesgo,
        expectativasNegocio,
        procedimientosAdicionales,
        inherente,
        control,
        analítico,
        factorRiesgo,
        procesosInvolucrados,
        fuentesCausantes,
        consecuenciaEF,
        ase_a1,
        ase_a2,
        ase_a3,
        ase_a4,
        ase_a5,
        ase_b1,
        ase_b2,
        ase_b3,
        ase_b4,
        ase_c1,
        ase_c2,
        ase_c3,
        ase_c4,
        sel_mon,
        sel_mon2,
        sel_gen,
        sel_gen2,
        sel_esp,
        sel_esp2,
        sel2_ini,
        padc_enf,
        padc_res,
        referencia,
        pfo_mpro,
        rda_resi,
        conclusion
    } = riskDataSave.value;

    const data = {
        _id,
        titulo,
        descripcion,
        ref,
        riesgoProveniente: riesgoProveniente.id,
        cuadrante: cuadrante.id,
        areaRiesgo: areaRiesgo.id,
        expectativasNegocio,
        procedimientosAdicionales,
        inherente: inherente.id,
        control: control.id,
        analítico: analítico.id,
        factorRiesgo,
        procesosInvolucrados,
        fuentesCausantes,
        consecuenciaEF,
        ase_a1,
        ase_a2,
        ase_a3,
        ase_a4,
        ase_a5,
        ase_b1,
        ase_b2,
        ase_b3,
        ase_b4,
        ase_c1,
        ase_c2,
        ase_c3,
        ase_c4,
        sel_mon: sel_mon.id,
        sel_mon2: sel_mon2.id,
        sel_gen: sel_gen.id,
        sel_gen2: sel_gen2.id,
        sel_esp: sel_esp.id,
        sel_esp2: sel_esp2.id,
        sel2_ini: sel2_ini.id,
        padc_enf,
        padc_res,
        referencia,
        pfo_mpro,
        rda_resi,
        conclusion

    }
    return riesgosServices.update(data);
}

const onChangeENCheckbox = (option) => {
    let valueId = customElementsENForm.radio
    valueId[0] === undefined ? '' : valueId[0]
    riskDataSave.value.expectativasNegocio = valueId
    console.log(riskDataSave)
    /*personaProyecto.value = personaProyecto.value.map((item) => {
      item.encargado = (valueId === item.personaId) ? true : false
      return item
    })*/
}

const onChangeCheckboxPA = (option) => {
    let valueId = ''
    switch (option) {
        case 0:
             valueId = customElementsFormNo.switch  
             customElementsForm.switch =  []
             showFormPA.value = false         
            break;
        case 1:
             valueId = customElementsForm.switch
             customElementsFormNo.switch =  []
             showFormPA.value = true 
            break;    
        default:
            valueId = ''
            break;
    }  
    clearFormValue()  
    riskDataSave.value.procedimientosAdicionales = valueId[0] === undefined ? '' : valueId[0]
}

const onChangeCustomCheckbox = (key) => {
    let valueId = ''
    switch (key) {
        case 'ase_a1':
            valueId = customChekS1Form.checkbox
            break;
        case 'ase_a2':
            valueId = customChekS2Form.checkbox
            break;
        case 'ase_a3':
            valueId = customChekS3Form.checkbox
            break;
        case 'ase_a4':
            valueId = customChekS4Form.checkbox
            break;
        case 'ase_a5':
            valueId = customChekS5Form.checkbox
            break;
        case 'ase_b1':
            valueId = customChekSB1Form.checkbox
            break;
        case 'ase_b2':
            valueId = customChekSB2Form.checkbox
            break;
        case 'ase_b3':
            valueId = customChekSB3Form.checkbox
            break;
        case 'ase_b4':
            valueId = customChekSB4Form.checkbox
            break;
        case 'ase_c1':
            valueId = customChekSC1Form.checkbox
            break;
        case 'ase_c2':
            valueId = customChekSC2Form.checkbox
            break;
        case 'ase_c3':
            valueId = customChekSC3Form.checkbox
            break;
        case 'ase_c4':
            valueId = customChekSC4Form.checkbox
            break;
        default:
            valueId = ''
            break;
    }
    riskDataSave["value"][key] = valueId[0] === undefined ? '' : valueId[0]
    console.log(riskDataSave)
    /*personaProyecto.value = personaProyecto.value.map((item) => {
      item.encargado = (valueId === item.personaId) ? true : false
      return item
    })*/
}
</script>

<template>
    <CardBoxModal v-model="isModalFormRisk" :title="addTitle()" :hasDone="hasModalValue"
        claseModal="shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-8/12 xl:w-8/12 z-50" style="height: 100%;">
        <CardBox isForm @submit.prevent="submit" style="height: 600px; overflow-y: auto;">
            <div>
                <div class="container mx-auto">
                    <div class="grid md:grid-cols-1 gap-1">
                        <FormField :label="$t('message.risk.ref')">
                            <FormControl :name="'ref'" v-model="riskDataSave.ref" :icon="mdiRenameBox" />
                        </FormField>

                        <FormField :label="$t('message.risk.title')" :help="v$?.titulo?.$errors[0]?.$message">
                            <FormControl :name="'titulo'" v-model="riskDataSave.titulo" :icon="mdiRenameBox" />
                        </FormField>

                        <FormField :label="$t('message.risk.description')" :help="v$?.descripcion?.$errors[0]?.$message"
                            style="margin-bottom: 1.5rem;">
                            <FormControl type="textarea" v-model="riskDataSave.descripcion" :icon="mdiRenameBox" />
                        </FormField>
                    </div>

                    <div class="grid lg:grid-cols-3 gap-3" style="margin-bottom: 1.5rem;">
                        <div class="c-card">
                            <div class="c-card-header">
                                {{ $t('message.risk.riskFrom') }}
                            </div>
                            <div class="c-card-content">
                                <FormField>
                                    <FormControl v-model="riskDataSave.riesgoProveniente" :icon="mdiListStatus"
                                        :options="risksFrom" />
                                </FormField>
                            </div>
                        </div>
                        <div class="c-card">
                            <div class="c-card-header">
                                {{ $t('message.risk.quadrant') }}
                            </div>
                            <div class="c-card-content">
                                <FormField>
                                    <FormControl v-model="riskDataSave.cuadrante" :icon="mdiListStatus"
                                        :options="quadrantOption" />
                                </FormField>
                            </div>
                        </div>

                        <div class="c-card">
                            <div class="c-card-header">
                                {{ $t('message.risk.riskArea') }}
                            </div>
                            <div class="c-card-content">
                                <FormField>
                                    <FormControl v-model="riskDataSave.areaRiesgo" :icon="mdiListStatus"
                                        :options="riskAreaOption" />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                        <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                            {{ $t('message.risk.natureOfTheRisk') }}
                        </h1>
                    </div>

                    <div class="grid lg:grid-cols-1 gap-1">
                        <h1 style="font-weight: 700;">Riesgo de error en los estados financieros</h1>
                        <h1 style=" font-weight: 700;">Expectativas del cliente</h1>
                        <div class="grid md:grid-cols-2 gap-2">
                            <FormField label="" v-for="(opions, i) in radioOptions">
                                <FormCheckRadioGroup v-model="customElementsENForm.radio" name="sample-radio" type="radio"
                                    :options="radioOptions[i]" @change="onChangeENCheckbox(radioOptions[i])" />
                            </FormField>
                        </div>
                    </div>

                    <div class="grid lg:grid-cols-1 gap-1">
                        <h1 style="margin-bottom: 1.5rem; font-weight: 700;">{{ $t('message.risk.additionalProcedures') }}
                        </h1>
                        <div class="grid md:grid-cols-2 gap-2">
                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customElementsForm.switch" 
                                    name="sample-switch" 
                                    type="switch"
                                    :options="{ 'Si': t('message.yes')}" 
                                    @change="onChangeCheckboxPA(1)"/>
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customElementsFormNo.switch" 
                                    name="sample-switch" 
                                    type="switch"
                                    :options="{'No': t('message.no') }" 
                                    @change="onChangeCheckboxPA(0)"/>
                            </FormField>

                        </div>
                    </div>

                    <div v-show="showFormPA">
                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.risksAssessment') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-3 gap-3" style="margin-bottom: 1.5rem;">
                            <div class="c-card">
                                <div class="c-card-header">
                                    {{ $t('message.risk.inherent') }}
                                </div>
                                <div class="c-card-content">
                                    <FormField>
                                        <FormControl v-model="riskDataSave.inherente" :icon="mdiListStatus"
                                            :options="generalOptions" />
                                    </FormField>
                                </div>
                            </div>

                            <div class="c-card">
                                <div class="c-card-header">
                                    {{ $t('message.risk.control') }}
                                </div>
                                <div class="c-card-content">
                                    <FormField>
                                        <FormControl v-model="riskDataSave.control" :icon="mdiListStatus"
                                            :options="generalOptions" />
                                    </FormField>
                                </div>
                            </div>

                            <div class="c-card">
                                <div class="c-card-header">
                                    {{ $t('message.risk.analytic') }}
                                </div>
                                <div class="c-card-content">
                                    <FormField>
                                        <FormControl v-model="riskDataSave.analítico" :icon="mdiListStatus"
                                            :options="generalOptions" />
                                    </FormField>
                                </div>
                            </div>
                        </div>
                        <div class="grid lg:grid-cols-1 gap-1" style="margin-bottom: 1.5rem;">
                            <FormField :label="$t('message.risk.riskFactor')">
                                <FormControl :name="'titulo'" v-model="riskDataSave.factorRiesgo" :icon="mdiRenameBox" />
                            </FormField>

                        </div>

                        <div class="grid lg:grid-cols-2 gap-2" style="margin-bottom: 1.5rem;">
                            <FormField :label="$t('message.risk.processesWhereRiskIsInvolved')">
                                <FormControl type="textarea" v-model="riskDataSave.procesosInvolucrados"
                                    :icon="mdiRenameBox" />
                            </FormField>

                            <FormField :label="$t('message.risk.causativeSourceOfRisk')">
                                <FormControl type="textarea" v-model="riskDataSave.fuentesCausantes" :icon="mdiRenameBox" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <FormField :label="$t('message.risk.impactOnTheFinancialStatementsAndAccountsConcerned')">
                                <FormControl type="textarea" v-model="riskDataSave.consecuenciaEF" :icon="mdiRenameBox" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.associatedAssertions') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;">
                                {{ $t('message.risk.assertionsAboutTransactionClassesAndEvents') }}
                            </h1>
                        </div>
                        <div class="grid md:grid-cols-3 gap-3">
                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekS1Form.checkbox" name="sample-checkbox"
                                    :options="{ 'I. Ocurrencia (O)': $t('message.risk.iOccurrence(O)') }"
                                    @change="onChangeCustomCheckbox('ase_a1')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekS2Form.checkbox" name="sample-checkbox"
                                    :options="{ 'II. Integridad (I)': $t('message.risk.iiIntegrity(I)') }"
                                    @change="onChangeCustomCheckbox('ase_a2')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekS3Form.checkbox" name="sample-checkbox"
                                    :options="{ 'III. Precisión (P)': $t('message.risk.iiiAccuracy(A)') }"
                                    @change="onChangeCustomCheckbox('ase_a3')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekS4Form.checkbox" name="sample-checkbox"
                                    :options="{ 'IV. Corte (CO)': $t('message.risk.iVCourt(CO)') }"
                                    @change="onChangeCustomCheckbox('ase_a4')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekS5Form.checkbox" name="sample-checkbox"
                                    :options="{ 'V. Clasificación (CL)': $t('message.risk.vClassification(CL)') }"
                                    @change="onChangeCustomCheckbox('ase_a5')" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.statementsOnBalancingItems') }}
                            </h1>
                        </div>

                        <div class="grid md:grid-cols-2 gap-2">
                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekSB1Form.checkbox" name="sample-checkbox"
                                    :options="{ 'I. Existencia (E)': $t('message.risk.iExistence(E)') }"
                                    @change="onChangeCustomCheckbox('ase_b1')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekSB2Form.checkbox" name="sample-checkbox"
                                    :options="{ 'II. Derechos y Obligaciones (DO)': $t('message.risk.iiRightsAndObligations(RO)') }"
                                    @change="onChangeCustomCheckbox('ase_b2')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekSB3Form.checkbox" name="sample-checkbox"
                                    :options="{ 'III. Integrity (I)': $t('message.risk.iiiIntegrity(I)') }"
                                    @change="onChangeCustomCheckbox('ase_b3')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekSB4Form.checkbox" name="sample-checkbox"
                                    :options="{ 'IV. Evaluación y Asignación (VA)': $t('message.risk.ivEvaluationAndAssignment(EA)') }"
                                    @change="onChangeCustomCheckbox('ase_b4')" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;">
                                {{ $t('message.risk.assertionsAboutPresentationAndDisclosure') }}
                            </h1>
                        </div>

                        <div class="grid md:grid-cols-2 gap-2">
                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekSC1Form.checkbox" name="sample-checkbox"
                                    :options="{ 'I. La Ocurrencia y los Derechos y Oblicgaciones (ODO)': $t('message.risk.iTheOccurrenceAndRightsAndOblications(ORO)') }"
                                    @change="onChangeCustomCheckbox('ase_c1')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekSC2Form.checkbox" name="sample-checkbox"
                                    :options="{ 'II. Integirdad (I)': $t('message.risk.iiIntegrity(I)') }"
                                    @change="onChangeCustomCheckbox('ase_c2')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekSC3Form.checkbox" name="sample-checkbox"
                                    :options="{ 'III. Clasificación y Comprensión (CC)': $t('message.risk.iiiClassificationAndComprehension(CC)') }"
                                    @change="onChangeCustomCheckbox('ase_c3')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup v-model="customChekSC4Form.checkbox" name="sample-checkbox"
                                    :options="{ 'IV. Precisión y Valuación (PV)': $t('message.risk.ivAccuracyAndValuation(AV)') }"
                                    @change="onChangeCustomCheckbox('ase_c4')" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.evaluationOfControls') }}
                            </h1>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>{{ $t('message.risk.effectiveDesign') }} </th>
                                    <th>{{ $t('message.risk.effectiveOperability') }} </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td :data-label="$t('message.risk.monitoring')">
                                        {{ t('message.risk.monitoring') }}
                                    </td>
                                    <td>
                                        <div class="c-card">
                                            <div class="c-card-header">
                                                {{ $t('message.risk.monitoring') }}
                                            </div>
                                            <div class="c-card-content">
                                                <FormField>
                                                    <FormControl v-model="riskDataSave.sel_mon" :icon="mdiListStatus"
                                                        :options="additionalSelectOptions" />
                                                </FormField>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="c-card">
                                            <div class="c-card-header">
                                                {{ $t('message.risk.monitoring') }}
                                            </div>
                                            <div class="c-card-content">
                                                <FormField>
                                                    <FormControl v-model="riskDataSave.sel_mon2" :icon="mdiListStatus"
                                                        :options="additionalSelectOptions" />
                                                </FormField>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td :data-label="$t('message.risk.general')">
                                        {{ t('message.risk.general') }}
                                    </td>
                                    <td>
                                        <div class="c-card">
                                            <div class="c-card-header">
                                                {{ $t('message.risk.general') }}
                                            </div>
                                            <div class="c-card-content">
                                                <FormField>
                                                    <FormControl v-model="riskDataSave.sel_gen" :icon="mdiListStatus"
                                                        :options="additionalSelectOptions" />
                                                </FormField>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="c-card">
                                            <div class="c-card-header">
                                                {{ $t('message.risk.general') }}
                                            </div>
                                            <div class="c-card-content">
                                                <FormField>
                                                    <FormControl v-model="riskDataSave.sel_gen2" :icon="mdiListStatus"
                                                        :options="additionalSelectOptions" />
                                                </FormField>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td :data-label="$t('message.risk.specific')">
                                        {{ t('message.risk.specific') }}
                                    </td>
                                    <td>
                                        <div class="c-card">
                                            <div class="c-card-header">
                                                {{ $t('message.risk.specific') }}
                                            </div>
                                            <div class="c-card-content">
                                                <FormField>
                                                    <FormControl v-model="riskDataSave.sel_esp" :icon="mdiListStatus"
                                                        :options="additionalSelectOptions" />
                                                </FormField>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="c-card">
                                            <div class="c-card-header">
                                                {{ $t('message.risk.specific') }}
                                            </div>
                                            <div class="c-card-content">
                                                <FormField>
                                                    <FormControl v-model="riskDataSave.sel_esp2" :icon="mdiListStatus"
                                                        :options="additionalSelectOptions" />
                                                </FormField>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td :data-label="$t('message.risk.informationIntegrity')">
                                        {{ t('message.risk.informationIntegrity') }}
                                    </td>
                                    <td>
                                        <div class="c-card">
                                            <div class="c-card-header">
                                                {{ $t('message.risk.informationIntegrity') }}
                                            </div>
                                            <div class="c-card-content">
                                                <FormField>
                                                    <FormControl v-model="riskDataSave.sel2_ini" :icon="mdiListStatus"
                                                        :options="additionalSelect2Options" />
                                                </FormField>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.riskReductionApproach') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;">
                                {{ $t('message.risk.detect/CorrectExistingErrors') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-2 gap-2">
                            <FormField :label="$t('message.risk.approach')">
                                <FormControl type="textarea" v-model="riskDataSave.padc_enf" :icon="mdiRenameBox" />
                            </FormField>
                            <FormField :label="$t('message.risk.outcomeOfTheAuditProceduresApplied')">
                                <FormControl type="textarea" v-model="riskDataSave.padc_res" :icon="mdiRenameBox" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;">
                                {{ $t('message.risk.reference(s)ToWorkingPapers') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1" style="margin-bottom: 1.5rem;">
                            <FormField label="">
                                <FormControl type="textarea" v-model="riskDataSave.referencia" :icon="mdiRenameBox" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.preventionOfFutureOccurrence:') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <FormField :label="$t('message.risk.recommendationForProcessImprovementprocess')">
                                <FormControl type="textarea" v-model="riskDataSave.pfo_mpro" :icon="mdiRenameBox" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.residualAuditRisk') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <FormField label="">
                                <FormControl type="textarea" v-model="riskDataSave.rda_resi" :icon="mdiRenameBox" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.effectOnTheAuditOpinion') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <FormField label="">
                                <FormControl type="textarea" v-model="riskDataSave.conclusion" :icon="mdiRenameBox" />
                            </FormField>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <BaseButton :label="$t(`message.submit`)" type="submit" color="success" />
            </template>
        </CardBox>
    </CardBoxModal>
    <table>
        <thead>
            <tr>
                <th>{{ $t('message.audit.ref') }}</th>
                <th>{{ $t('message.audit.title') }}</th>
                <th>{{ $t('message.audit.auditor') }}</th>
                <th>{{ $t('message.audit.quadrant') }}</th>
                <th>{{ $t('message.audit.date') }}</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="(risk, index) in itemsPaginated" :key="risk._id" @click="selectedItem(risk)">
                <td :data-label="$t('message.audit.ref')">
                    {{ risk.indice.indice }}
                </td>
                <td :data-label="$t('message.audit.title')">
                    {{ risk.titulo }}
                </td>
                <td :data-label="$t('message.audit.auditor')">
                    {{ risk.usuario.lastname }} {{ risk.usuario.firstname }}
                </td>
                <td :data-label="$t('message.audit.quadrant')">
                    cuadrante
                </td>
                <td :data-label="$t('message.audit.date')">
                    16-08-2023
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>

                        <BaseButton 
                            color="info" 
                            :icon="mdiPencilOutline" 
                            :messageTooltip="t('message.edit')"
                            small 
                            @click="openModalForm(risk)" />

                        <BaseButton 
                            color="info" 
                            :icon="mdiPrinter" 
                            :messageTooltip="t('message.print')"
                            small />

                        <BaseButton 
                            color="info" 
                            :icon="mdiDelete" 
                            :messageTooltip="t('message.delete')" 
                            small />

                    </BaseButtons>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <BaseLevel>
            <BaseButtons>
                <BaseButton v-for="page in pagesList" :key="page" :active="page === (currentPage - 1)" :label="page + 1"
                    :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="changePage(page + 1)" />
            </BaseButtons>
            <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
        </BaseLevel>
    </div>
</template>
<style scoped>
.c-card {
    display: flex;
    flex-direction: column;
}

.c-card-header {
    display: grid;
    place-content: center;
    height: 35px;
    background: #2563eb;
    color: white;
    font-weight: 700;
    border-radius: 10px 10px 0px 0px;
}

.c-card-content {
    padding: 15px;
    border-color: #80808054;
    border-width: 1px;
}

.title-modal {
    background: #ddd;
    padding: 8px;
    border-radius: 6px;
}

.card-header {
    background: #2563eb;
    display: grid;
    place-content: center;
    color: white;
    padding-left: 10px;
    height: 48px;
}

.card-header-h1 {
    margin-bottom: 1.5rem;
    font-weight: 700;
    height: 100%;
    display: grid;
    place-content: center;
}
</style>