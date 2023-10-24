<script setup>
import { computed, ref, defineEmits, defineProps, reactive } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { mdiDelete, mdiPencilOutline, mdiEye, mdiRenameBox, mdiListStatus, mdiPlus, mdiMinus } from "@mdi/js";
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
import FileSaver from 'file-saver';
import VueHtml2pdf from 'vue3-html2pdf';
import SectionReportPDF from '@/components/SectionReportPDF.vue'
import PdfRisk from './PdfRisk.vue'
import { jsPDF } from "jspdf";

const { t } = useI18n();
const toast = useToast()
const router = useRouter();
const isModalFormRisk = ref(false);
const mainStore = useMainStore();
const selectedRisk = ref([]);
const hasDoneValue = ref(false);
const showFormPA = ref(false);
const overlayModal = ref(false);
const btnCloseModal = ref(true);
const inputsel_gen = ref(true);
const inputsel_gen2 = ref(true);
const inputsel_mon = ref(true)
const inputsel_mon2 = ref(true)
const inputsel_esp = ref(true)
const inputsel_esp2 = ref(true)
const html2Pdf = ref(null);
const onlyReadonly = ref(true);
const pdfFormat = 'a4';
const pdfOrientation = 'portrait';
const pdfContentWidth = '800px';

const risksFrom = [
    { id: 'Transacciones Recurrentes', label: t('message.risk.recurringTransactions') },
    { id: 'Transacciones no Recurrentes', label: t('message.risk.nonRecurringTransactions') },
    { id: 'Juicios y Estimaciones', label: t('message.risk.judgmentsAndEstimates') },
    { id: 'accountingClosingEntries', label: t('message.risk.accountingClosingEntries') }
];

const quadrantOption = [
    { id: 0, label: t('message.risk.quadrantI') },
    { id: 1, label: t('message.risk.quadrantII') },
    { id: 2, label: t('message.risk.quadrantIII') },
    { id: 3, label: t('message.risk.quadrantIV') },
    { id: 4, label: t('message.risk.othersRisk') }
];

const riskAreaOption = [
    { id: 0, label: t('message.risk.critical') },
    { id: 1, label: t('message.risk.strategic') },
    { id: 3, label: t('message.risk.support') }
];

const radioOptions = [
    { 'Intencional (Fraude)': t('message.risk.intentional') },
    { 'No Intencionales': t('message.risk.unintentional') },
    { 'Viabilidad del negocio': t('message.risk.businessViability') },
    { 'Expectativas del cliente': t('message.risk.customerExpectations') }
];

const radioTypeRiskOptions = [
    { 'A nivel de estados financieros': t('message.risk.atTheLevelOfFinancialStatements') },
    { 'A nivel de aseveraciones': t('message.risk.atTheLevelOfAssertions') }
];

const additionalProceduresOptions = [
    { 'Si': t('message.yes') },
    { 'No': t('message.no') },
];

const additionalSelectOptions = [
    { id: 'No probado', label: t('message.risk.untried') },
    { id: 'Probado', label: t('message.risk.tried') },
    //{ id: 'No', label: t('message.no') },
];

const additionalSelect2Options = [
    { id: 'No aprobado', label: t('message.risk.untried') },
    { id: 'Efectivo', label: t('message.risk.effective') },
    { id: 'No efectivo', label: t('message.risk.noeffective') },

];

const generalOptions = [
    { id: 'Alto', label: t('message.risk.high') },
    { id: 'Medio', label: t('message.risk.middle') },
    { id: 'Bajo', label: t('message.risk.low') },

];

const customChekSTR1Form = reactive({
    checkbox: []
});

const customChekSTR2Form = reactive({
    checkbox: []
});

const customElementsENForm = reactive({
    radio: [],
});

const customAdditionalProceduresForm = reactive({
    switch: [],
});

const customElementsForm = reactive({
    switch: []
});

const customTypeRiskForm = reactive({
    radio: [],
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

const customChekS6Form = reactive({
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

const customChekSB5Form = reactive({
    checkbox: []
});

const customChekSB6Form = reactive({
    checkbox: []
});

/*const customChekSC1Form = reactive({
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
});*/

const props = defineProps({
    path: '',
    saveLabel: ''
})

const tableData = ref({
    rows: [],
});

const refDesTableData = ref({
    rows: [],
});

const dataInitial = {
    _id: '',
    titulo: "",
    descripcion: "",
    typeRisk: "",
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
    ctaFA: tableData,
    analitico: "",
    ase_a1: "",
    ase_a2: "",
    ase_a3: "",
    ase_a4: "",
    ase_a5: "",
    ase_a6: "",
    ase_b1: "",
    ase_b2: "",
    ase_b3: "",
    ase_b4: "",
    ase_b5: "",
    ase_b6: "",
    sel_mon: additionalSelectOptions[0],
    ref_sel_mon: "",
    sel_mon2: additionalSelectOptions[0],
    ref_sel_mon2: "",
    sel_gen: additionalSelectOptions[0],
    ref_sel_gen: "",
    sel_gen2: additionalSelectOptions[0],
    ref_sel_gen2: "",
    sel_esp: additionalSelectOptions[0],
    ref_sel_esp: "",
    sel_esp2: additionalSelectOptions[0],
    ref_sel_esp2: "",
    sel2_ini: additionalSelect2Options[0],
    ref_sel2_ini: "",
    refDes: refDesTableData,
    padc_enf: "",
    padc_res: "",
    pfo_mpro: "",
    rda_resi: "",
    reasons_NT_cont: "",
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

const formattedNumber = (number, decimalPlaces = 2, thousandsSeparator = '.') => {
  const value = Number(number)
  if (isNaN(value)) {
    return ''
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: true,
    grouping: thousandsSeparator
  })
}

const formattedNumberReverse = (number ) => {
  let newNumber = Number(number) 
  if(isNaN(newNumber)) {
    let N1 = number.replace(/\./g, '');
    const newNumber1 = N1.replace(/\,/g, '.');
    return newNumber1
  }
  return number
}

const openModalForm = (riskData, option) => {
    
    onlyReadonly.value = option === 0 ? true : false

    const { indice, titulo, descripcion, typeRisk, _id, riesgoProveniente,
        cuadrante, areaRiesgo, expectativasNegocio, procedimientosAdicionales,
        inherente, control, analitico, factorRiesgo, procesosInvolucrados,
        fuentesCausantes, ctaFA, ase_a1, ase_a2, ase_a3, ase_a4,
        ase_a5, ase_a6, ase_b1, ase_b2, ase_b3, ase_b4, ase_b5, ase_b6, sel_mon,ref_sel_mon,
        sel_mon2, ref_sel_mon2, sel_gen, ref_sel_gen, sel_gen2, ref_sel_gen2, sel_esp, ref_sel_esp, 
        sel_esp2, ref_sel_esp2, sel2_ini, ref_sel2_ini, reasons_NT_cont, refDes, padc_enf, padc_res, pfo_mpro, rda_resi,
        conclusion } = riskData

    riskDataSave.value.ref = `${indice.indice} - ${indice.nombre}`
    riskDataSave.value.titulo = titulo
    riskDataSave.value.descripcion = descripcion
    riskDataSave.value._id = _id

    const tableDat = ctaFA !== null ? ctaFA?.rows : []

    const transfData = tableDat.map((i) => {
        return i.map((item,index) => {
            if(index === 2 || index === 3) {
                item = formattedNumber(item)
            }
            return item            
        })
    }) 
    tableData.value.rows = transfData
    //ctaFA !== null ? ctaFA?.rows : []
    riskDataSave.value.ctaFA = tableData

    refDesTableData.value.rows = refDes !== null ? refDes?.rows : []
    riskDataSave.value.refDes = refDesTableData

    if (typeRisk === 'Seleccione' || typeRisk === '') {
        customChekSTR2Form.checkbox = []
        customChekSTR1Form.checkbox = []
    } else {
        customChekSTR1Form.checkbox = typeRisk === 'A nivel de estados financieros' ? [typeRisk] : []
        customChekSTR2Form.checkbox = typeRisk !== 'A nivel de estados financieros' ? [typeRisk] : []
    }
    riskDataSave.value.riesgoProveniente = risksFrom.filter(riskItem => riskItem.id === riesgoProveniente)[0]
    riskDataSave.value.cuadrante = quadrantOption.filter(item => item.id === cuadrante)[0]
    riskDataSave.value.areaRiesgo = riskAreaOption.filter(item => item.id === areaRiesgo)[0]
    customElementsENForm.radio = expectativasNegocio
    customTypeRiskForm.radio = typeRisk
    customElementsForm.switch = procedimientosAdicionales === 'Si' ? [procedimientosAdicionales] : []
    showFormPA.value = procedimientosAdicionales === 'Si' ? true : false
    riskDataSave.value.inherente = generalOptions.filter(item => item.id === inherente)[0]
    riskDataSave.value.control = generalOptions.filter(item => item.id === control)[0]
    riskDataSave.value.analitico = generalOptions.filter(item => item.id === analitico)[0]
    riskDataSave.value.factorRiesgo = factorRiesgo
    riskDataSave.value.procesosInvolucrados = procesosInvolucrados
    riskDataSave.value.fuentesCausantes = fuentesCausantes
    customChekS1Form.checkbox = ase_a1 !== '' ? [ase_a1] : []
    customChekS2Form.checkbox = ase_a2 !== '' ? [ase_a2] : []
    customChekS3Form.checkbox = ase_a3 !== '' ? [ase_a3] : []
    customChekS4Form.checkbox = ase_a4 !== '' ? [ase_a4] : []
    customChekS5Form.checkbox = ase_a5 !== '' ? [ase_a5] : []
    customChekS6Form.checkbox = ase_a6 !== '' ? [ase_a6] : []

    customChekSB1Form.checkbox = ase_b1 !== '' ? [ase_b1] : []
    customChekSB2Form.checkbox = ase_b2 !== '' ? [ase_b2] : []
    customChekSB3Form.checkbox = ase_b3 !== '' ? [ase_b3] : []
    customChekSB4Form.checkbox = ase_b4 !== '' ? [ase_b4] : []
    customChekSB5Form.checkbox = ase_b5 !== '' ? [ase_b5] : []
    customChekSB6Form.checkbox = ase_b6 !== '' ? [ase_b6] : []

    riskDataSave.value.sel_mon = additionalSelectOptions.filter(item => item.id === sel_mon)[0]
    riskDataSave.value.ref_sel_mon = ref_sel_mon
    riskDataSave.value.sel_mon2 = additionalSelectOptions.filter(item => item.id === sel_mon2)[0]
    riskDataSave.value.ref_sel_mon2 = ref_sel_mon2
    riskDataSave.value.sel_gen = additionalSelectOptions.filter(item => item.id === sel_gen)[0]
    riskDataSave.value.ref_sel_gen = ref_sel_gen
    riskDataSave.value.sel_gen2 = additionalSelectOptions.filter(item => item.id === sel_gen2)[0]
    riskDataSave.value.ref_sel_gen2 = ref_sel_gen2
    riskDataSave.value.sel_esp = additionalSelectOptions.filter(item => item.id === sel_esp)[0]
    riskDataSave.value.ref_sel_esp = ref_sel_esp
    riskDataSave.value.sel_esp2 = additionalSelectOptions.filter(item => item.id === sel_esp2)[0]
    riskDataSave.value.ref_sel_esp2 = ref_sel_esp2
    riskDataSave.value.sel2_ini = additionalSelect2Options.filter(item => item.id === sel2_ini)[0]
    riskDataSave.value.ref_sel2_ini = ref_sel2_ini
    riskDataSave.value.reasons_NT_cont = reasons_NT_cont

    riskDataSave.value.padc_enf = padc_enf,
    riskDataSave.value.padc_res = padc_res,
    riskDataSave.value.pfo_mpro = pfo_mpro,
    riskDataSave.value.rda_resi = rda_resi,
    riskDataSave.value.conclusion = conclusion
    isModalFormRisk.value = true
}

const clearFormValue = () => {
    riskDataSave.value.inherente = generalOptions[0]
    riskDataSave.value.control = generalOptions[0]
    riskDataSave.value.analitico = generalOptions[0]
    riskDataSave.value.factorRiesgo = ""
    riskDataSave.value.procesosInvolucrados = ""
    riskDataSave.value.fuentesCausantes = ""
    customChekSTR1Form.checkbox = []
    customChekSTR2Form.checkbox = []
    customChekS1Form.checkbox = []
    customChekS2Form.checkbox = []
    customChekS3Form.checkbox = []
    customChekS4Form.checkbox = []
    customChekS5Form.checkbox = []
    customChekS6Form.checkbox = []

    customChekSB1Form.checkbox = []
    customChekSB2Form.checkbox = []
    customChekSB3Form.checkbox = []
    customChekSB4Form.checkbox = []
    customChekSB5Form.checkbox = []
    customChekSB6Form.checkbox = []

    riskDataSave.value.sel_mon = additionalSelectOptions[0]
    riskDataSave.value.ref_sel_mon = ""
    riskDataSave.value.sel_mon2 = additionalSelectOptions[0]
    riskDataSave.value.ref_sel_mon2 = "" 
    riskDataSave.value.sel_gen = additionalSelectOptions[0]
    riskDataSave.value.ref_sel_gen = ""
    riskDataSave.value.sel_gen2 = additionalSelectOptions[0]
    riskDataSave.value.ref_sel_gen2 = ""
    riskDataSave.value.sel_esp = additionalSelectOptions[0]
    riskDataSave.value.ref_sel_esp = ""
    riskDataSave.value.sel_esp2 = additionalSelectOptions[0]
    riskDataSave.value.ref_sel_esp2 = ""
    riskDataSave.value.sel2_ini = additionalSelect2Options[0]
    riskDataSave.value.ref_sel2_ini = ""
    riskDataSave.value.reasons_NT_cont = ""

    riskDataSave.value.padc_enf = ""
    riskDataSave.value.padc_res = ""
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
                toast.success(successMessage);
            })
            .catch(err => {
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
    let {
        _id,
        titulo,
        typeRisk,
        descripcion,
        ref,
        riesgoProveniente,
        cuadrante,
        areaRiesgo,
        expectativasNegocio,
        procedimientosAdicionales,
        inherente,
        control,
        analitico,
        factorRiesgo,
        procesosInvolucrados,
        fuentesCausantes,
        ctaFA,
        ase_a1,
        ase_a2,
        ase_a3,
        ase_a4,
        ase_a5,
        ase_a6,
        ase_b1,
        ase_b2,
        ase_b3,
        ase_b4,
        ase_b5,
        ase_b6,
        sel_mon,
        ref_sel_mon,
        sel_mon2,
        ref_sel_mon2,
        sel_gen,
        ref_sel_gen,
        sel_gen2,
        ref_sel_gen2,
        sel_esp,
        ref_sel_esp,
        sel_esp2,
        ref_sel_esp2,
        sel2_ini,
        ref_sel2_ini,
        reasons_NT_cont,
        refDes,
        padc_enf,
        padc_res,
        pfo_mpro,
        rda_resi,
        conclusion
    } = riskDataSave.value;

    const tableDat = ctaFA?.rows || []
    const transfData = tableDat.map((i) => {
        return i.map((item,index) => {
            if(index === 2 || index === 3) {
                item = formattedNumberReverse(item)
            }
            return item            
        })
    })
    const resultData = {
        rows: transfData
    }
    const data = {
        _id,
        titulo,
        typeRisk,
        descripcion,
        ref,
        riesgoProveniente: riesgoProveniente.id,
        cuadrante: cuadrante.id,
        areaRiesgo: areaRiesgo.id,
        expectativasNegocio,
        procedimientosAdicionales,
        inherente: inherente.id,
        control: control.id,
        analitico: analitico.id,
        factorRiesgo,
        procesosInvolucrados,
        fuentesCausantes,
        ctaFA:resultData,
        ase_a1,
        ase_a2,
        ase_a3,
        ase_a4,
        ase_a5,
        ase_a6,
        ase_b1,
        ase_b2,
        ase_b3,
        ase_b4,
        ase_b5,
        ase_b6,
        sel_mon: sel_mon.id,
        ref_sel_mon,
        sel_mon2: sel_mon2.id,
        ref_sel_mon2,
        sel_gen: sel_gen.id,
        ref_sel_gen,
        sel_gen2: sel_gen2.id,
        ref_sel_gen2,
        sel_esp: sel_esp.id,
        ref_sel_esp,
        sel_esp2: sel_esp2.id,
        ref_sel_esp2,
        sel2_ini: sel2_ini.id,
        ref_sel2_ini,
        reasons_NT_cont,
        refDes,
        padc_enf,
        padc_res,
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
}

const onChangeCheckboxPA = (option) => {
    let valueId = ''
    valueId = customElementsForm.switch
    clearFormValue()
    riskDataSave.value.procedimientosAdicionales = valueId[0] === undefined ? '' : valueId[0]
    showFormPA.value = !showFormPA.value
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
        case 'ase_a6':
            valueId = customChekS6Form.checkbox
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
        case 'ase_b5':
            valueId = customChekSB5Form.checkbox
            break;
        case 'ase_b6':
            valueId = customChekSB6Form.checkbox
            break;
        default:
            valueId = ''
            break;
    }
    riskDataSave["value"][key] = valueId[0] === undefined ? '' : valueId[0]
}

const onChangeTypeRiskCustomCheckbox = (key) => {
    let valueId = ''
    switch (key) {
        case 'TR1':
            valueId = customChekSTR1Form.checkbox
            customChekSTR2Form.checkbox = []
            break;
        case 'TR2':
            valueId = customChekSTR2Form.checkbox
            customChekSTR1Form.checkbox = []
            break;
        default:
            valueId = ''
            customChekSTR2Form.checkbox = []
            customChekSTR1Form.checkbox = []
            break;
    }
    riskDataSave.value.typeRisk = valueId[0] === undefined ? '' : valueId[0]
}

const addRow = () => {
    const newRow = ['', '', '', '', '']
    tableData.value.rows.push(newRow);
};

const deleteRow = (item) => {
    let dataNew = tableData.value.rows
    dataNew.splice(item.rowIndex, 1);
    tableData.value.rows = dataNew
};



const addRowRefDes = () => {
    const newRow = ['', '']
    refDesTableData.value.rows.push(newRow);
};

const deleteRowRefDes = (item) => {
    let dataNew = refDesTableData.value.rows
    dataNew.splice(item.rowIndex, 1);
    refDesTableData.value.rows = dataNew
};

const getStyleRefDes = (i) => {
    if (i === 0) {
        return {
            width: `10%`,
        }
    }

    return {
        width: `84%`,
    }

}
const getStyle = (i) => {
    if (i === 0) {
        return {
            width: `8%`,
        }
    }

    if (i === 2 || i === 3) {
        return {
            width: `14%`,
            'text-align': `right`,
            'padding-left': '0px',
            'padding-righ': '0px'
        }
    }
};

const activeInputRef = (i) => {
    switch (i) {
        case "sel_gen":
            const valueOp = riskDataSave.value.sel_gen
            if (valueOp.id === "Probado") {
                inputsel_gen.value = false
            } else {
                riskDataSave.value.ref_sel_gen = ""
                inputsel_gen.value = true                
            }            
        break;
        case "sel_gen2":
            const valueOp22 = riskDataSave.value.sel_gen2
            if (valueOp22.id === "Probado") {
                inputsel_gen2.value = false
            } else {
                riskDataSave.value.ref_sel_gen2 = ""
                inputsel_gen2.value = true                
            }            
        break;
        case "sel_mon":
            const valueOp1 = riskDataSave.value.sel_mon
            if (valueOp1.id === "Probado") {
                inputsel_mon.value = false
            } else {
                riskDataSave.value.ref_sel_mon = ""
                inputsel_mon.value = true                
            }            
        break;
        case "sel_mon2":
            const valueOp2 = riskDataSave.value.sel_mon2
            if (valueOp2.id === "Probado") {
                inputsel_mon2.value = false
            } else {
                riskDataSave.value.ref_sel_mon2 = ""
                inputsel_mon2.value = true                
            }            
        break;
        case "sel_esp":
            const valueOp3 = riskDataSave.value.sel_esp
            if (valueOp3.id === "Probado") {
                inputsel_esp.value = false
            } else {
                riskDataSave.value.ref_sel_esp = ""
                inputsel_esp.value = true                
            }            
        break;
        case "sel_esp2":
            const valueOp32 = riskDataSave.value.sel_esp2
            if (valueOp32.id === "Probado") {
                inputsel_esp2.value = false
            } else {
                riskDataSave.value.ref_sel_esp2 = ""
                inputsel_esp2.value = true                
            }            
        break;    
        default:
            break;
    }
};

const confirmModal = () => {
    submit()
};

const cancelModal = () => {
    clearFormValue()
    isModalFormRisk.value = false
};

const descriptionCuadrante = (option) => {
    if (option === 1) {
        return t('message.audit.quadrantI')
    } else if (option === 2) {
        return t('message.audit.quadrantII')
    } else if (option === 3) {
        return t('message.audit.quadrantIII')
    } else if (option === 4) {
        return t('message.audit.quadrantIV')
    } else {
        return t('message.audit.quadrant')
    }
};

const successMessageDelete = t("message.audit.deleted.success")
const deleteRisk = (id) => {
    actionDelete(id)
        .then(() => {
            toast.success(successMessageDelete);
            emit('changePage', currentPage.value)
        })
        .catch(err => {
            toast.error(`${t("message.audit.deleted.error")} ${err?.response?.data.msg}`)
        })
};

const data = [
    { label: 'Name', value: 'John Doe' },
    { label: 'Email', value: 'johndoe@example.com' },
    { label: 'Phone', value: '555-555-5555' },
    { label: 'Input', value: 'This is a long text that should wrap to multiple lines and occupy the full width of the page while respecting the margins.' },
];

const generatePdf = (item) => {
    const content = `
        <div>
          <h1>PDF Content</h1>
          <p>Column 1: ${item.titulo}</p>
          <p>Column 2: ${item.titulo}</p>
        </div>
      `;
    html2Pdf.value.generatePdf(content);
};

const onGenerated = (pdf) => {
    const blob = pdf.output('blob');
    FileSaver.saveAs(blob, 'document.pdf');
};

const actionDelete = (id) => {
    return riesgosServices.delete(id);
}

const changeFormatN = (value, rI, cI) => {
    const numberValue = formattedNumberReverse(value)
    tableData.value.rows[rI][cI] = formattedNumber(numberValue)
}

const getContent = (item) => {
    return `
        <div>
          <h1>PDF Content</h1>
          <p>Column 1: ${item.titulo}</p>
          <p>Column 2: ${item.titulo}</p>
        </div>
      `;
}
</script>

<template>
    <CardBoxModal v-model="isModalFormRisk" :hasClose="btnCloseModal" :hasDone="hasDoneValue" :title="addTitle()"
        claseModal="shadow-lg max-h-modal w-11/12 md:w-11/12 lg:w-11/12 xl:w-11/12 z-50 form-risk" style="height: 100%;"
        :overlayClick="overlayModal">
        <CardBox isForm @submit.prevent="submit" style="height: 600px; overflow-y: auto;">
            <div>
                <div class="container mx-auto">
                    <div class="grid md:grid-cols-1 gap-1">
                        <FormField :label="$t('message.risk.ref')">
                            <FormControl :name="'ref'" v-model="riskDataSave.ref" :icon="mdiRenameBox" :readonly="true" />
                        </FormField>

                        <FormField :label="$t('message.risk.title')" :help="v$?.titulo?.$errors[0]?.$message">
                            <FormControl :name="'titulo'" v-model="riskDataSave.titulo" :icon="mdiRenameBox"
                                :readonly="true" />
                        </FormField>

                        <FormField :label="$t('message.risk.description')" :help="v$?.descripcion?.$errors[0]?.$message"
                            style="margin-bottom: 1.5rem;">
                            <FormControl 
                                type="textarea" 
                                v-model="riskDataSave.descripcion" 
                                :icon="mdiRenameBox" 
                                :readonly="onlyReadonly"/>
                        </FormField>
                    </div>

                    <div class="grid lg:grid-cols-1 gap-1">
                        <h1 style="margin-bottom: 1.5rem; font-weight: 700;">
                            {{ $t('message.risk.typeOfRisk') }}
                        </h1>
                    </div>
                    <div class="grid md:grid-cols-2 gap-2">

                        <FormField label="">
                            <FormCheckRadioGroup 
                                v-model="customChekSTR1Form.checkbox" 
                                name="sample-checkbox"
                                :readonly="onlyReadonly"
                                :options="{ 'A nivel de estados financieros': t('message.risk.atTheLevelOfFinancialStatements') }"
                                @change="onChangeTypeRiskCustomCheckbox('TR1')"                                
                                />
                        </FormField>

                        <FormField label="">
                            <FormCheckRadioGroup 
                                v-model="customChekSTR2Form.checkbox" 
                                name="sample-checkbox"
                                :readonly="onlyReadonly"
                                :options="{ 'A nivel de aseveraciones': t('message.risk.atTheLevelOfAssertions') }"
                                @change="onChangeTypeRiskCustomCheckbox('TR2')" />
                        </FormField>

                        <!-- <FormField label="" v-for="(opions, i) in radioTypeRiskOptions">
                            <FormCheckRadioGroup v-model="customTypeRiskForm.radio" name="sample-radio" type="radio"
                                :options="radioTypeRiskOptions[i]" @change="onChangeTypeRiskCheckbox(radioTypeRiskOptions[i])" />
                        </FormField> -->
                    </div>

                    <div class="grid lg:grid-cols-3 gap-3" style="margin-bottom: 1.5rem;">
                        <div class="c-card">
                            <div class="c-card-header">
                                {{ $t('message.risk.riskFrom') }}
                            </div>
                            <div class="c-card-content">
                                <FormField>
                                    <FormControl 
                                        v-model="riskDataSave.riesgoProveniente" 
                                        :icon="mdiListStatus"
                                        :options="risksFrom"
                                        :readonly="onlyReadonly" />
                                </FormField>
                            </div>
                        </div>
                        <div class="c-card">
                            <div class="c-card-header">
                                {{ $t('message.risk.quadrant') }}
                            </div>
                            <div class="c-card-content">
                                <FormField>
                                    <FormControl 
                                        v-model="riskDataSave.cuadrante" 
                                        :icon="mdiListStatus"
                                        :options="quadrantOption" 
                                        :readonly="onlyReadonly"/>
                                </FormField>
                            </div>
                        </div>

                        <div class="c-card">
                            <div class="c-card-header">
                                {{ $t('message.risk.affectedProcess') }}
                            </div>
                            <div class="c-card-content">
                                <FormField>
                                    <FormControl 
                                        v-model="riskDataSave.areaRiesgo" 
                                        :icon="mdiListStatus"
                                        :options="riskAreaOption" 
                                        :readonly="onlyReadonly"/>
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
                        <!-- <h1 style=" font-weight: 700;">Expectativas del cliente</h1> -->
                        <div class="grid md:grid-cols-2 gap-2">
                            <FormField label="" v-for="(opions, i) in radioOptions">
                                <FormCheckRadioGroup 
                                    v-model="customElementsENForm.radio" 
                                    name="sample-radio" type="radio"
                                    :readonly="onlyReadonly"
                                    :options="radioOptions[i]" @change="onChangeENCheckbox(radioOptions[i])" />
                            </FormField>
                        </div>
                    </div>

                    <div class="grid lg:grid-cols-1 gap-1">
                        <h1 style="margin-bottom: 1.5rem; font-weight: 700;">{{ $t('message.risk.additionalProcedures') }}
                        </h1>
                        <div class="grid md:grid-cols-2 gap-2" style="padding-bottom: 20px;">
                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customElementsForm.switch" 
                                    name="sample-switch" 
                                    type="switch"
                                    :readonly="onlyReadonly"
                                    :options="{ 'Si': t('message.yes') }" @change="onChangeCheckboxPA(1)" />
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
                                        <FormControl 
                                            v-model="riskDataSave.inherente" 
                                            :icon="mdiListStatus"
                                            :options="generalOptions" 
                                            :readonly="onlyReadonly"/>
                                    </FormField>
                                </div>
                            </div>

                            <div class="c-card">
                                <div class="c-card-header">
                                    {{ $t('message.risk.control') }}
                                </div>
                                <div class="c-card-content">
                                    <FormField>
                                        <FormControl 
                                            v-model="riskDataSave.control" 
                                            :icon="mdiListStatus"
                                            :options="generalOptions" 
                                            :readonly="onlyReadonly"/>
                                    </FormField>
                                </div>
                            </div>

                            <div class="c-card">
                                <div class="c-card-header">
                                    {{ $t('message.risk.detection') }}
                                </div>
                                <div class="c-card-content">
                                    <FormField>
                                        <FormControl 
                                            v-model="riskDataSave.analitico" 
                                            :icon="mdiListStatus"
                                            :options="generalOptions" 
                                            :readonly="onlyReadonly"/>
                                    </FormField>
                                </div>
                            </div>
                        </div>
                        <div class="grid lg:grid-cols-1 gap-1" style="margin-bottom: 1.5rem;">
                            <FormField :label="$t('message.risk.riskFactor')">
                                <FormControl 
                                    :name="'titulo'" 
                                    v-model="riskDataSave.factorRiesgo" 
                                    :icon="mdiRenameBox" 
                                    :readonly="onlyReadonly"/>
                            </FormField>

                        </div>

                        <div class="grid lg:grid-cols-2 gap-2" style="margin-bottom: 1.5rem;">
                            <FormField :label="$t('message.risk.processesWhereRiskIsInvolved')">
                                <FormControl 
                                    type="textarea" 
                                    v-model="riskDataSave.procesosInvolucrados"
                                    :icon="mdiRenameBox" 
                                    :readonly="onlyReadonly"/>
                            </FormField>

                            <FormField :label="$t('message.risk.causativeSourceOfRisk')">
                                <FormControl 
                                    type="textarea" 
                                    v-model="riskDataSave.fuentesCausantes" 
                                    :icon="mdiRenameBox" 
                                    :readonly="onlyReadonly"/>
                            </FormField>
                        </div>

                        <!-- <div class="grid lg:grid-cols-1 gap-1">
                            <FormField :label="$t('message.risk.impactOnTheFinancialStatementsAndAccountsConcerned')">
                                <FormControl type="textarea" v-model="riskDataSave.consecuenciaEF" :icon="mdiRenameBox" />
                            </FormField>
                        </div> -->

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
                                <FormCheckRadioGroup 
                                    v-model="customChekS1Form.checkbox" 
                                    name="sample-checkbox"
                                    :options="{ 'I. Ocurrencia (O)': $t('message.risk.iOccurrence(O)') }"
                                    :messageTooltip="t('message.risk.ocurrence')"
                                    :readonly="onlyReadonly"
                                    @change="onChangeCustomCheckbox('ase_a1')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekS2Form.checkbox" 
                                    name="sample-checkbox"
                                    :options="{ 'II. Integridad (I)': $t('message.risk.iiIntegrity(I)') }"
                                    :messageTooltip="t('message.risk.integrity')"
                                    :readonly="onlyReadonly"
                                    @change="onChangeCustomCheckbox('ase_a2')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekS3Form.checkbox" 
                                    name="sample-checkbox"
                                    :options="{ 'III. Precisión (P)': $t('message.risk.iiiAccuracy(A)') }"
                                    :messageTooltip="t('message.risk.precision')"
                                    :readonly="onlyReadonly"
                                    @change="onChangeCustomCheckbox('ase_a3')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekS4Form.checkbox" 
                                    name="sample-checkbox"
                                    :options="{ 'IV. Corte (CO)': $t('message.risk.iVCourt(CO)') }"
                                    :messageTooltip="t('message.risk.court')" 
                                    :readonly="onlyReadonly"
                                    @change="onChangeCustomCheckbox('ase_a4')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekS5Form.checkbox" 
                                    name="sample-checkbox"
                                    :readonly="onlyReadonly"
                                    :options="{ 'V. Clasificación (CL)': $t('message.risk.vClassification(CL)') }"
                                    :messageTooltip="t('message.risk.classification')"
                                    @change="onChangeCustomCheckbox('ase_a5')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekS6Form.checkbox" 
                                    name="sample-checkbox"
                                    :readonly="onlyReadonly"
                                    :options="{ 'VI. Presentación (PR)': $t('message.risk.viPresentation(PR)') }"
                                    :messageTooltip="t('message.risk.presentation')"
                                    @change="onChangeCustomCheckbox('ase_a6')" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;">
                                {{ $t('message.risk.statementsOnBalancingItems') }}
                            </h1>
                        </div>

                        <div class="grid md:grid-cols-2 gap-2">
                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekSB1Form.checkbox" 
                                    name="sample-checkbox"
                                    :options="{ 'I. Existencia (E)': $t('message.risk.iExistence(E)') }"
                                    :messageTooltip="t('message.risk.existence')"
                                    :readonly="onlyReadonly"
                                    @change="onChangeCustomCheckbox('ase_b1')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekSB2Form.checkbox" 
                                    name="sample-checkbox"
                                    :options="{ 'II. Derechos y Obligaciones (DO)': $t('message.risk.iiRightsAndObligations(RO)') }"
                                    :messageTooltip="t('message.risk.rightsAndObligations')"
                                    :readonly="onlyReadonly"
                                    @change="onChangeCustomCheckbox('ase_b2')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekSB3Form.checkbox" 
                                    name="sample-checkbox"
                                    :options="{ 'III. Integrity (I)': $t('message.risk.iiiIntegrity(I)') }"
                                    :messageTooltip="t('message.risk.integrity1')"
                                    :readonly="onlyReadonly"
                                    @change="onChangeCustomCheckbox('ase_b3')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekSB4Form.checkbox" 
                                    name="sample-checkbox"
                                    :options="{ 'IV. Precisión, valoración y asignación (PVA)': $t('message.risk.ivAccuracyValuationAndAssignment(PVA)') }"
                                    :messageTooltip="t('message.risk.accuracyValuationAndAllocation')"
                                    :readonly="onlyReadonly"
                                    @change="onChangeCustomCheckbox('ase_b4')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekSB5Form.checkbox" 
                                    name="sample-checkbox"
                                    :options="{ 'V. Clasificación (CL)': $t('message.risk.vClassification(CL)') }"
                                    :messageTooltip="t('message.risk.clasification1')"
                                    :readonly="onlyReadonly"
                                    @change="onChangeCustomCheckbox('ase_b5')" />
                            </FormField>

                            <FormField label="">
                                <FormCheckRadioGroup 
                                    v-model="customChekSB6Form.checkbox" 
                                    name="sample-checkbox"
                                    :options="{ 'VI. Presentación (PR)': $t('message.risk.viPresentation(PR)') }"
                                    :messageTooltip="t('message.risk.presentation1')"
                                    :readonly="onlyReadonly"
                                    @change="onChangeCustomCheckbox('ase_b6')" />
                            </FormField>
                        </div>

                        <!-- <div class="grid lg:grid-cols-1 gap-1">
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
                        </div> -->

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.accountOfAffectedFinancialStatementsAndStatements') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 mb-4">
                            <table>
                                <thead>
                                    <tr class="trHeader">
                                        <th></th>
                                        <th></th>
                                        <th colspan="2" class="trHeader2">{{ $t('message.risk.balance') }}</th>
                                        <th colspan="2"></th>
                                    </tr>
                                    <tr style="background: #2563eb;color: white;">
                                        <th class="c-center">{{ $t('message.risk.ref') }}</th>
                                        <th class="c-center">{{ $t('message.risk.accountName') }}</th>
                                        <th class="c-center">{{ $t('message.risk.preliminary') }}</th>
                                        <th class="c-center">{{ $t('message.risk.final') }}</th>
                                        <th class="c-center">{{ $t('message.risk.affectedClaims') }}</th>
                                        <th class="c-center">
                                            <BaseButton 
                                                @click.prevent="addRow" 
                                                :icon="mdiPlus" 
                                                label="" 
                                                color="success"
                                                :disabled="onlyReadonly"
                                                small />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, rowIndex) in tableData.rows" :key="rowIndex">
                                        <td v-for="(cell, cellIndex) in row" :key="cellIndex" :style="getStyle(cellIndex)">
                                            <input v-if="cellIndex === 2 || cellIndex === 3" type="text"
                                                :id="`${rowIndex}_${cellIndex}`"
                                                v-model="tableData.rows[rowIndex][cellIndex]" 
                                                style=" width: 100%; text-align: right;" 
                                                @blur="changeFormatN(tableData.rows[rowIndex][cellIndex], rowIndex, cellIndex)"
                                                v-decimal :readonly="onlyReadonly"/>
                                            <input v-else type="text"
                                                v-model="tableData.rows[rowIndex][cellIndex]" style="width: 100%" :readonly="onlyReadonly"/>
                                        </td>
                                        <td class="c-center">
                                            <BaseButton 
                                                @click.prevent="deleteRow({ rowIndex, row })" 
                                                :icon="mdiMinus"
                                                label="" 
                                                color="danger"
                                                small 
                                                :disabled="onlyReadonly"/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
                                            <div class="c-card-header-ref">
                                                <div class="div-ref">
                                                    {{ $t('message.risk.monitoring') }}
                                                </div>
                                                <div class="div-ref">
                                                    {{ $t('message.risk.ref') }}
                                                </div>                                                
                                            </div>
                                            <div class="c-card-content c-card-content-ref">
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.sel_mon" 
                                                            :icon="mdiListStatus"
                                                            :options="additionalSelectOptions"
                                                            :readonly="onlyReadonly" 
                                                            @onSelectChange="activeInputRef('sel_mon')"/>
                                                    </FormField>                                                
                                                </div>
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.ref_sel_mon" 
                                                            :icon="mdiRenameBox"
                                                            :readonly="inputsel_mon"/>
                                                    </FormField>                                                
                                                </div>                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="c-card">
                                            <div class="c-card-header-ref">
                                                <div class="div-ref">
                                                    {{ $t('message.risk.monitoring') }}
                                                </div>
                                                <div class="div-ref">
                                                    {{ $t('message.risk.ref') }}
                                                </div>
                                            </div>
                                            <div class="c-card-content c-card-content-ref">
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.sel_mon2" 
                                                            :icon="mdiListStatus"
                                                            :options="additionalSelectOptions" 
                                                            :readonly="onlyReadonly"
                                                            @onSelectChange="activeInputRef('sel_mon2')"/>
                                                    </FormField>                                                
                                                </div>
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl
                                                            v-model="riskDataSave.ref_sel_mon2" 
                                                            :icon="mdiRenameBox"
                                                            :readonly="inputsel_mon2"/>
                                                    </FormField>
                                                </div>                                                
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
                                            <div class="c-card-header-ref">
                                                <div class="div-ref">
                                                    {{ $t('message.risk.general') }}
                                                </div>
                                                <div class="div-ref">
                                                    {{ $t('message.risk.ref') }}
                                                </div>                                                
                                            </div>
                                            <div class="c-card-content c-card-content-ref">
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.sel_gen" 
                                                            :icon="mdiListStatus"
                                                            :options="additionalSelectOptions" 
                                                            :readonly="onlyReadonly"
                                                            @onSelectChange="activeInputRef('sel_gen')"/>
                                                    </FormField>                                                
                                                </div>                                                
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.ref_sel_gen" 
                                                            :icon="mdiRenameBox"
                                                            :readonly="inputsel_gen"/>
                                                    </FormField>                                                
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="c-card">
                                            <div class="c-card-header-ref">
                                                <div class="div-ref">
                                                    {{ $t('message.risk.general') }}
                                                </div>
                                                <div class="div-ref">
                                                    {{ $t('message.risk.ref') }}
                                                </div>                                                
                                            </div>
                                            <div class="c-card-content c-card-content-ref">
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.sel_gen2" 
                                                            :icon="mdiListStatus"
                                                            :options="additionalSelectOptions"
                                                            :readonly="onlyReadonly" 
                                                            @onSelectChange="activeInputRef('sel_gen2')"/>
                                                    </FormField>                                                
                                                </div>                                                
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.ref_sel_gen2" 
                                                            :icon="mdiRenameBox"
                                                            :readonly="inputsel_gen2"/>
                                                    </FormField>                                                
                                                </div>
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
                                            <div class="c-card-header-ref">
                                                <div class="div-ref">
                                                    {{ $t('message.risk.specific') }}
                                                </div>
                                                <div class="div-ref">
                                                    {{ $t('message.risk.ref') }}
                                                </div>
                                            </div>
                                            <div class="c-card-content c-card-content-ref">
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.sel_esp" 
                                                            :icon="mdiListStatus"
                                                            :options="additionalSelectOptions" 
                                                            :readonly="onlyReadonly"
                                                            @onSelectChange="activeInputRef('sel_esp')"/>
                                                    </FormField>                                                
                                                </div>                                                
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.ref_sel_esp" 
                                                            :icon="mdiRenameBox"
                                                            :readonly="inputsel_esp"/>
                                                    </FormField>                                                
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="c-card">
                                            <div class="c-card-header-ref">
                                                <div class="div-ref">
                                                    {{ $t('message.risk.specific') }}
                                                </div>
                                                <div class="div-ref">
                                                    {{ $t('message.risk.ref') }}
                                                </div>                                                
                                            </div>
                                            <div class="c-card-content c-card-content-ref">
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.sel_esp2" 
                                                            :icon="mdiListStatus"
                                                            :options="additionalSelectOptions"
                                                            :readonly="onlyReadonly" 
                                                            @onSelectChange="activeInputRef('sel_esp2')"/>
                                                    </FormField>                                                
                                                </div>                                                
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.ref_sel_esp2" 
                                                            :icon="mdiRenameBox"
                                                            :readonly="inputsel_esp2"/>
                                                    </FormField>                                                
                                                </div>
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
                                            <div class="c-card-header-ref">
                                                <div class="div-ref">
                                                    {{ $t('message.risk.informationIntegrity') }}
                                                </div>
                                                <div class="div-ref">
                                                    {{ $t('message.risk.ref') }}
                                                </div>                                                
                                            </div> 

                                            <div class="c-card-content c-card-content-ref">
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.sel2_ini" 
                                                            :icon="mdiListStatus"
                                                            :readonly="onlyReadonly"
                                                            :options="additionalSelect2Options" />
                                                    </FormField>                                                
                                                </div>                                                
                                                <div style="width: 50%;">
                                                    <FormField>
                                                        <FormControl 
                                                            v-model="riskDataSave.ref_sel2_ini" 
                                                            :icon="mdiRenameBox"
                                                            :readonly="onlyReadonly"/>
                                                    </FormField>                                                
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.reasonsForNotTestingControls') }}
                            </h1>
                        </div>
                        <div class="grid lg:grid-cols-1 gap-1">
                            <FormField>
                                <FormControl 
                                    type="textarea" 
                                    v-model="riskDataSave.reasons_NT_cont" 
                                    :icon="mdiRenameBox"
                                    :readonly="onlyReadonly" />
                            </FormField>
                        </div>

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
                                <FormControl 
                                    type="textarea" 
                                    v-model="riskDataSave.padc_enf" 
                                    :icon="mdiRenameBox"
                                    :readonly="onlyReadonly" />
                            </FormField>
                            <FormField :label="$t('message.risk.outcomeOfTheAuditProceduresApplied')">
                                <FormControl 
                                    type="textarea" 
                                    v-model="riskDataSave.padc_res" 
                                    :icon="mdiRenameBox"
                                    :readonly="onlyReadonly" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.reference(s)ToWorkingPapers') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 mb-4">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{{ $t('message.risk.ref') }}</th>
                                        <th>{{ $t('message.risk.descriptionOfAuditTests') }}</th>
                                        <th class="c-center">

                                            <BaseButton 
                                                @click.prevent="addRowRefDes" 
                                                :icon="mdiPlus" 
                                                label=""
                                                color="success" 
                                                small 
                                                :disabled="onlyReadonly"/>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, rowIndex) in refDesTableData.rows" :key="rowIndex">
                                        <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                                            :style="getStyleRefDes(cellIndex)">
                                            <input 
                                                type="text" 
                                                v-model="refDesTableData.rows[rowIndex][cellIndex]"
                                                style="width: 100%" 
                                                :readonly="onlyReadonly"/>
                                        </td>
                                        <td class="c-center">
                                            <BaseButton 
                                                @click.prevent="deleteRowRefDes({ rowIndex, row })" 
                                                :icon="mdiMinus"
                                                label="" 
                                                color="danger" 
                                                small 
                                                :disabled="onlyReadonly"/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.preventionOfFutureOccurrence:') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <FormField :label="$t('message.risk.recommendationForProcessImprovementprocess')">
                                <FormControl 
                                    type="textarea" 
                                    v-model="riskDataSave.pfo_mpro" 
                                    :icon="mdiRenameBox"
                                    :readonly="onlyReadonly" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.residualAuditRisk') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <FormField label="">
                                <FormControl 
                                type="textarea" 
                                v-model="riskDataSave.rda_resi" 
                                :icon="mdiRenameBox"
                                :readonly="onlyReadonly" />
                            </FormField>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 1.5rem;">
                            <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                                {{ $t('message.risk.effectOnTheAuditOpinion') }}
                            </h1>
                        </div>

                        <div class="grid lg:grid-cols-1 gap-1">
                            <FormField label="">
                                <FormControl 
                                type="textarea" 
                                v-model="riskDataSave.conclusion" 
                                :icon="mdiRenameBox"
                                :readonly="onlyReadonly" />
                            </FormField>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <BaseButton 
                    :label="$t(`message.submit`)" 
                    type="submit" 
                    color="success" 
                    :disabled="onlyReadonly"/>
                <BaseButton 
                    :label="$t(`message.cancel`)" 
                    color="danger" 
                    style="margin-left: 5px;" 
                    @click="cancelModal" 
                    :disabled="onlyReadonly"/>
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
                    {{ descriptionCuadrante(risk.cuadrante) }}
                </td>
                <td :data-label="$t('message.audit.date')">
                    16-08-2023
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <div style="display: flex;">
                        <SectionReportPDF style="margin-right: 10px;" :pdf-format="pdfFormat"
                            :pdf-orientation="pdfOrientation" :pdf-content-width="pdfContentWidth"
                            :content="getContent(risk)">
                            <template v-slot:pdf-content>
                                <PdfRisk :risk="risk"/>
                            </template>
                            
                        </SectionReportPDF>
                        <BaseButtons type="justify-start lg:justify-end" no-wrap>
                            <BaseButton 
                                color="info" 
                                :icon="mdiEye" 
                                :messageTooltip="t('message.information')" 
                                small
                                @click="openModalForm(risk,0)" />
                            <BaseButton 
                                color="success" 
                                :icon="mdiPencilOutline" 
                                :messageTooltip="t('message.edit')" 
                                small
                                @click="openModalForm(risk,1)" />
                            <BaseButton 
                                color="danger" 
                                :icon="mdiDelete" 
                                :messageTooltip="t('message.delete')" 
                                small
                                @click="deleteRisk(risk._id)" />
                        </BaseButtons>
                    </div>
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

.c-card-header-ref {
    width: 100%; 
    padding: 0 15px;
    display: flex;
    flex-direction: row;
    gap: 5px;
    height: 35px;
    background: #2563eb;
    color: white;
    font-weight: 700;
    border-radius: 10px 10px 0px 0px;
}

.div-ref {
    display: grid; 
    place-content: center; 
    width: 50%;
}

.c-card-content-ref {
    display: flex; 
    flex-direction: row; 
    width: 100%; 
    gap:5px
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

.trHeader {
    background: rgb(221, 221, 228);
    color: rgb(0, 0, 0);
    border: 1px solid rgb(248, 239, 239);
}

.trHeader2 {
    text-align: center;
    border: 1px solid rgb(248, 239, 239);
}

.inputNumber {
    text-align: right;
    width: 100%;
    padding-left: 0px;
    padding-right: 0px;
}

.c-center {
    text-align: center;
}
</style>