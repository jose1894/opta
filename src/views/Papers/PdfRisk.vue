<script setup>
import { defineProps, reactive, ref } from 'vue';
import { useI18n } from "vue-i18n";
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";

const { t } = useI18n();

const props = defineProps({
    risk: {},
})
const optionTrue = ref(true)
const optionFalse = ref(false)

</script>
<template>
    <div style="margin: 20px">
        <h1 class="c-center" style="margin-top: 10px;">
            {{ $t('message.audit.riskControlRegistration') }}
        </h1>

        <FormField :label="$t('message.risk.ref')">
           {{ risk.indice.indice }} - {{ risk.indice.nombre }} {{ risk.expectativasNegocio }}
        </FormField>

        <FormField :label="$t('message.risk.title')">
            <FormControl :name="'titulo'" v-model="risk.titulo"/>
        </FormField>

        <FormField :label="$t('message.risk.description')" style="margin-bottom: 0.5rem;">
            <FormControl type="textarea" v-model="risk.descripcion"/>
        </FormField>

        <h1 style="margin-bottom: 0.5rem; font-weight: 700;">
            {{ $t('message.risk.typeOfRisk') }}
        </h1>

        <div class="grid md:grid-cols-2 gap-2">
            <FormField label="">
                <FormCheckRadioGroup 
                    v-if="risk.typeRisk === 'A nivel de estados financieros'" 
                    v-model="optionTrue" 
                    name="sample-checkbox"
                    :options="{ 'A nivel de estados financieros': t('message.risk.atTheLevelOfFinancialStatements') }" />
                <FormCheckRadioGroup 
                    v-else
                    v-model="optionFalse" 
                    name="sample-checkbox"
                    :options="{ 'A nivel de estados financieros': t('message.risk.atTheLevelOfFinancialStatements') }" />                
            </FormField>

            <FormField label="">
                <FormCheckRadioGroup 
                    v-if="risk.typeRisk === 'A nivel de aseveraciones'" 
                    v-model="optionTrue" 
                    name="sample-checkbox"
                    :options="{ 'A nivel de aseveraciones': t('message.risk.atTheLevelOfAssertions') }" />
                <FormCheckRadioGroup 
                    v-else
                    v-model="optionFalse" 
                    name="sample-checkbox"
                    :options="{ 'A nivel de aseveraciones': t('message.risk.atTheLevelOfAssertions') }" />
            </FormField>
        </div>

        <div class="grid lg:grid-cols-3 gap-3" style="margin-bottom: 0.5rem;">
            <div class="c-card">
                <div class="c-card-header">
                    {{ $t('message.risk.riskFrom') }}
                </div>

                <div class="c-card-content">
                    <FormField>
                        <FormControl v-model="risk.riesgoProveniente"/>
                    </FormField>
                </div>                
            </div>

            <div class="c-card">
                <div class="c-card-header">
                    {{ $t('message.risk.quadrant') }}
                </div>
                <div class="c-card-content">
                    <FormField v-if="risk.cuadrante === 4">
                        {{ $t('message.risk.othersRisk') }}
                    </FormField>
                    <FormField v-if="risk.cuadrante === 3">
                        {{ $t('message.risk.quadrantIV') }}
                    </FormField>
                    <FormField v-if="risk.cuadrante === 2">
                        {{ $t('message.risk.quadrantIII') }}
                    </FormField>
                    <FormField v-if="risk.cuadrante === 1">
                        {{ $t('message.risk.quadrantII') }}
                    </FormField>
                    <FormField v-if="risk.cuadrante === 0">
                        {{ $t('message.risk.quadrantI') }}
                    </FormField>
                </div>
            </div>

            <div class="c-card">
                <div class="c-card-header">
                    {{ $t('message.risk.affectedProcess') }}
                </div>
                <div class="c-card-content">
                    <FormField v-if="risk.areaRiesgo === 3">
                        {{ $t('message.risk.support') }}
                    </FormField>
                    <FormField v-if="risk.areaRiesgo === 2">
                        {{ $t('message.risk.strategic') }}
                    </FormField>
                    <FormField v-if="risk.areaRiesgo === 1">
                        {{ $t('message.risk.critical') }}
                    </FormField>
                </div>
            </div>
        </div>

        <div class="grid lg:grid-cols-1 card-header" style="margin-bottom: 0.5rem;">
            <h1 style="margin-bottom: 0.5rem; font-weight: 700;" class="card-header-h1">
                {{ $t('message.risk.natureOfTheRisk') }}
            </h1>
        </div>

        <div class="grid lg:grid-cols-1 gap-1">
            <h1 style="font-weight: 700;">Riesgo de error en los estados financieros</h1>
            <div class="grid md:grid-cols-2 gap-2">
                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.expectativasNegocio === 'Intencional (Fraude)'" 
                        v-model="optionTrue" 
                        name="sample-radio" 
                        type="radio"
                        :options="{ 'Intencional (Fraude)': t('message.risk.intentional') }" />
                    <FormCheckRadioGroup 
                        v-else
                        v-model="optionFalse" 
                        name="sample-radio" 
                        type="radio"
                        :options="{ 'Intencional (Fraude)': t('message.risk.intentional') }" />                
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.expectativasNegocio === 'No Intencionales'" 
                        v-model="optionTrue" 
                        name="sample-radio" 
                        type="radio"
                        :options="{ 'No Intencionales': t('message.risk.unintentional') }" />
                    <FormCheckRadioGroup 
                        v-else
                        v-model="optionFalse" 
                        name="sample-radio" 
                        type="radio"
                        :options="{ 'No Intencionales': t('message.risk.unintentional') }" />                
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.expectativasNegocio === 'Viabilidad del negocio'" 
                        v-model="optionTrue" 
                        name="sample-radio" 
                        type="radio"
                        :options="{ 'Viabilidad del negocio': t('message.risk.businessViability') }" />
                    <FormCheckRadioGroup 
                        v-else
                        v-model="optionFalse" 
                        name="sample-radio" 
                        type="radio"
                        :options="{ 'Viabilidad del negocio': t('message.risk.businessViability') }" />                
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.expectativasNegocio === 'Viabilidad del negocio'" 
                        v-model="optionTrue"  
                        name="sample-radio" 
                        type="radio"
                        :options="{ 'Expectativas del cliente': t('message.risk.customerExpectations') }" />
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse"  
                        name="sample-radio" 
                        type="radio"
                        :options="{ 'Expectativas del cliente': t('message.risk.customerExpectations') }" />                                  
                </FormField>                
            </div>
        </div>
        <div class="grid lg:grid-cols-1 gap-1" style="margin-bottom: 0.5rem;">
            <h1 style="font-weight: 700;">
                {{ $t('message.risk.additionalProcedures') }}
            </h1>
            <div class="grid md:grid-cols-2" style="padding: 2px;">
                <FormField label="">
                    {{ risk.procedimientosAdicionales }}
                </FormField>
            </div>
        </div>

        <div v-show=" risk.procedimientosAdicionales === 'Si'">
            <div class="grid lg:grid-cols-1 card-header" style="margin-bottom: 0.5rem;">
                <h1 style="margin-bottom: 0.5rem; font-weight: 700;" class="card-header-h1">
                    {{ $t('message.risk.risksAssessment') }}
                </h1>
            </div>
            <div class="grid lg:grid-cols-3 gap-3 mb-4">
                <div class="c-card">
                    <div class="c-card-header">
                        {{ $t('message.risk.inherent') }}
                    </div>
                    <div class="c-card-content">
                        <FormField>
                            <FormControl v-model="risk.inherente"/>
                        </FormField>
                    </div>
                </div>

                <div class="c-card">
                    <div class="c-card-header">
                        {{ $t('message.risk.control') }}
                    </div>
                    <div class="c-card-content">
                        <FormField>
                            <FormControl v-model="risk.control"/>
                        </FormField>
                    </div>
                </div>

                <div class="c-card">
                    <div class="c-card-header">
                        {{ $t('message.risk.detection') }}
                    </div>
                    <div class="c-card-content">
                        <FormField>
                            <FormControl v-model="risk.analitico"/>
                        </FormField>
                    </div>
                </div>            
            </div>

            <div class="grid lg:grid-cols-1 gap-1 mb-8" style="margin-bottom: 0.5rem;">
                <FormField :label="$t('message.risk.riskFactor')">
                    <FormControl :name="'titulo'" v-model="risk.factorRiesgo"/>
                </FormField>
            </div>

            <div class="grid lg:grid-cols-2 gap-2" style="margin-bottom: 0.5rem;">
                <FormField :label="$t('message.risk.processesWhereRiskIsInvolved')">
                    <FormControl type="textarea" v-model="risk.procesosInvolucrados"/>
                </FormField>

                <FormField :label="$t('message.risk.causativeSourceOfRisk')">
                    <FormControl type="textarea" v-model="risk.fuentesCausantes"/>
                </FormField>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 0.5rem;">
                <h1 style="margin-bottom: 0.5rem; font-weight: 700;" class="card-header-h1">
                    {{ $t('message.risk.associatedAssertions') }}
                </h1>
            </div>

            <div class="grid lg:grid-cols-1 gap-1">
                <h1 style="margin-bottom: 0.5rem; font-weight: 700;">
                    {{ $t('message.risk.assertionsAboutTransactionClassesAndEvents') }}
                </h1>
            </div>

            <div class="grid md:grid-cols-3 gap-3">
                <FormField label="">
                    <FormCheckRadioGroup
                        v-if="risk.ase_a1 === 'I. Ocurrencia (O)'" 
                        v-model="optionTrue" 
                        name="sample-checkbox"
                        :options="{ 'I. Ocurrencia (O)': $t('message.risk.iOccurrence(O)') }"/>
                    <FormCheckRadioGroup
                        v-else 
                        v-model="optionFalse" 
                        name="sample-checkbox"
                        :options="{ 'I. Ocurrencia (O)': $t('message.risk.iOccurrence(O)') }"/>
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.ase_a2 === 'II. Integridad (I)'" 
                        v-model="optionTrue"
                        name="sample-checkbox"
                        :options="{ 'II. Integridad (I)': $t('message.risk.iiIntegrity(I)') }"/>
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse" 
                        name="sample-checkbox"
                        :options="{ 'II. Integridad (I)': $t('message.risk.iiIntegrity(I)') }"/>
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.ase_a3 === 'III. Precisión (P)'" 
                        v-model="optionTrue" 
                        name="sample-checkbox"
                        :options="{ 'III. Precisión (P)': $t('message.risk.iiiAccuracy(A)') }"/>
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse" 
                        name="sample-checkbox"
                        :options="{ 'III. Precisión (P)': $t('message.risk.iiiAccuracy(A)') }"/>
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.ase_a4 === 'IV. Corte (CO)'" 
                        v-model="optionTrue"  
                        name="sample-checkbox"
                        :options="{ 'IV. Corte (CO)': $t('message.risk.iVCourt(CO)') }"/>
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse"  
                        name="sample-checkbox"
                        :options="{ 'IV. Corte (CO)': $t('message.risk.iVCourt(CO)') }"/>
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup
                        v-if="risk.ase_a5 === 'V. Clasificación (CL)'" 
                        v-model="optionTrue" 
                        name="sample-checkbox"
                        :options="{ 'V. Clasificación (CL)': $t('message.risk.vClassification(CL)') }" />
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse"  
                        name="sample-checkbox"
                        :options="{ 'V. Clasificación (CL)': $t('message.risk.vClassification(CL)') }" />
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.ase_a5 === 'VI. Presentación (PR)'" 
                        v-model="optionTrue"
                        name="sample-checkbox"
                        :options="{ 'VI. Presentación (PR)': $t('message.risk.viPresentation(PR)') }"/>
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse"
                        name="sample-checkbox"
                        :options="{ 'VI. Presentación (PR)': $t('message.risk.viPresentation(PR)') }"/>
                </FormField>
            </div>

            <div class="grid lg:grid-cols-1 gap-1">
                <h1 style="margin-bottom: 0.5rem; font-weight: 700;">
                    {{ $t('message.risk.statementsOnBalancingItems') }}
                </h1>
            </div>
            
            <div class="grid md:grid-cols-2 gap-2">
                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.ase_b1 === 'I. Existencia (E)'" 
                        v-model="optionTrue" 
                        name="sample-checkbox"
                        :options="{ 'I. Existencia (E)': $t('message.risk.iExistence(E)') }"/>
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse"
                        name="sample-checkbox"
                        :options="{ 'I. Existencia (E)': $t('message.risk.iExistence(E)') }"/>
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.ase_b2 === 'II. Derechos y Obligaciones (DO)'" 
                        v-model="optionTrue" 
                        name="sample-checkbox"
                        :options="{ 'II. Derechos y Obligaciones (DO)': $t('message.risk.iiRightsAndObligations(RO)') }"/>
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse"
                        name="sample-checkbox"
                        :options="{ 'II. Derechos y Obligaciones (DO)': $t('message.risk.iiRightsAndObligations(RO)') }"/>
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.ase_b3 === 'III. Integrity (I)'" 
                        v-model="optionTrue" 
                        name="sample-checkbox"
                        :options="{ 'III. Integrity (I)': $t('message.risk.iiiIntegrity(I)') }"/>
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse" 
                        name="sample-checkbox"
                        :options="{ 'III. Integrity (I)': $t('message.risk.iiiIntegrity(I)') }"/>
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.ase_b4 === 'IV. Precisión, valoración y asignación (PVA)'" 
                        v-model="optionTrue" 
                        name="sample-checkbox"
                        :options="{ 'IV. Precisión, valoración y asignación (PVA)': $t('message.risk.ivAccuracyValuationAndAssignment(PVA)') }"/>
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse" 
                        name="sample-checkbox"
                        :options="{ 'IV. Precisión, valoración y asignación (PVA)': $t('message.risk.ivAccuracyValuationAndAssignment(PVA)') }"/>
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.ase_b5 === 'V. Clasificación (CL)'" 
                        v-model="optionTrue" 
                        name="sample-checkbox"
                        :options="{ 'V. Clasificación (CL)': $t('message.risk.vClassification(CL)') }"/>
                    <FormCheckRadioGroup 
                        v-else
                        v-model="optionFalse" 
                        name="sample-checkbox"
                        :options="{ 'V. Clasificación (CL)': $t('message.risk.vClassification(CL)') }"/>
                </FormField>

                <FormField label="">
                    <FormCheckRadioGroup 
                        v-if="risk.ase_b6 === 'VI. Presentación (PR)'" 
                        v-model="optionTrue" 
                        name="sample-checkbox"
                        :options="{ 'VI. Presentación (PR)': $t('message.risk.viPresentation(PR)') }"/>
                    <FormCheckRadioGroup 
                        v-else 
                        v-model="optionFalse" 
                        name="sample-checkbox"
                        :options="{ 'VI. Presentación (PR)': $t('message.risk.viPresentation(PR)') }"/>
                </FormField>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 0.5rem;">
                <h1 style="margin-bottom: 0.5rem; font-weight: 700;" class="card-header-h1">
                    {{ $t('message.risk.accountOfAffectedFinancialStatementsAndStatements') }}
                </h1>
            </div>

            <div class="grid lg:grid-cols-1 gap-1">
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, rowIndex) in risk?.ctaFA?.rows" :key="rowIndex">
                            <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                                {{  risk.ctaFA?.rows[rowIndex][cellIndex] }}
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
                                <div class="c-card-header">
                                    {{ $t('message.risk.monitoring') }}
                                </div>
                                <div class="c-card-content">
                                    <FormField>
                                        <FormControl v-model="risk.sel_mon"/>
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
                                        <FormControl v-model="risk.sel_mon2"/>
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
                                        <FormControl v-model="risk.sel_gen"/>
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
                                        <FormControl v-model="risk.sel_gen2"/>
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
                                        <FormControl v-model="risk.sel_esp"/>
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
                                        <FormControl v-model="risk.sel_esp2"/>
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
                                        <FormControl v-model="risk.sel2_ini"/>
                                    </FormField>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 0.5rem;">
                <h1 style="margin-bottom: 0.5rem; font-weight: 700;" class="card-header-h1">
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
                    <FormControl type="textarea" v-model="risk.padc_enf"/>
                </FormField>
                <FormField :label="$t('message.risk.outcomeOfTheAuditProceduresApplied')">
                    <FormControl type="textarea" v-model="risk.padc_res"/>
                </FormField>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 0.5rem;">
                <h1 style="margin-bottom: 0.5rem; font-weight: 700;" class="card-header-h1">
                    {{ $t('message.risk.reference(s)ToWorkingPapers') }}
                </h1>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 mb-4">
                <table>
                    <thead>
                        <tr>
                            <th>{{ $t('message.risk.ref') }}</th>
                            <th>{{ $t('message.risk.description') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, rowIndex) in risk.refDes?.rows" :key="rowIndex">
                            <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                                {{  risk.refDes?.rows[rowIndex][cellIndex]}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 0.5rem;">
                <h1 style="margin-bottom: 1.5rem; font-weight: 700;" class="card-header-h1">
                    {{ $t('message.risk.preventionOfFutureOccurrence:') }}
                </h1>
            </div>

            <div class="grid lg:grid-cols-1 gap-1">
                <FormField :label="$t('message.risk.recommendationForProcessImprovementprocess')">
                    <FormControl type="textarea" v-model="risk.pfo_mpro"/>
                </FormField>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 0.5rem;">
                <h1 style="margin-bottom: 0.5rem; font-weight: 700;" class="card-header-h1">
                    {{ $t('message.risk.residualAuditRisk') }}
                </h1>
            </div>

            <div class="grid lg:grid-cols-1 gap-1">
                <FormField label="">
                    <FormControl type="textarea" v-model="risk.rda_resi" :icon="mdiRenameBox" />
                </FormField>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header" style="margin-bottom: 0.5rem;">
                <h1 style="margin-bottom: 0.5rem; font-weight: 700;" class="card-header-h1">
                    {{ $t('message.risk.effectOnTheAuditOpinion') }}
                </h1>
            </div>

            <div class="grid lg:grid-cols-1 gap-1">
                <FormField label="">
                    <FormControl type="textarea" v-model="risk.conclusion" :icon="mdiRenameBox" />
                </FormField>
            </div>
        </div>
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
    height: 32px;
    background: #2563eb;
    color: white;
    font-weight: 700;
    border-radius: 10px 10px 0px 0px;
}

.c-card-content {
    padding: 10px;
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
    height: 38px;
}

.card-header-h1 {
    margin-bottom: 0.5rem;
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