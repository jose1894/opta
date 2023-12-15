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
        <h1 class="c-center" style="margin-top: 10px; font-weight: 700;">
            {{ $t('message.audit.riskControlRegistration') }}
        </h1>

        <h3 style="margin-top: 10px;font-weight: bold;">
            {{ $t('message.risk.ref') }}
        </h3>
        <div class="div-p">
            <p class="texto-p"> 
                {{ risk.indice.indice }} - {{ risk.indice.nombre }}
            </p>
        </div>

        <h3 style="margin-top: 10px;font-weight: bold;">
            {{ $t('message.risk.title') }}
        </h3>
        <div class="div-p">
            <p class="texto-p"> 
                {{ risk.titulo }}
            </p>
        </div>
        
        <h3 style="margin-top: 10px;font-weight: bold;">
            {{ $t('message.risk.description') }}
        </h3>
        <div class="div-p">
            <p class="texto-p"> 
                {{ risk.descripcion }} 
            </p>
        </div>

        <h3 style="margin-top: 10px; margin-bottom: 15px; font-weight: bold;">
            {{ $t('message.risk.typeOfRisk') }}
        </h3>

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
                    <h3 style="margin-top: 10px;font-weight: bold;">
                        {{ $t('message.risk.riskFrom') }}
                    </h3>                    
                </div>

                <div class="c-card-content">
                    <div class="div-p c-center border-p">
                        <p class="texto-p">
                            {{ risk.riesgoProveniente }}
                        </p>
                    </div>
                </div>                
            </div>

            <div class="c-card">
                <div class="c-card-header">
                    <h3 style="margin-top: 10px;font-weight: bold;">
                        {{ $t('message.risk.quadrant') }}
                    </h3>
                </div>
                <div class="c-card-content">
                    <div class="div-p c-center border-p">
                        <p class="texto-p" v-if="risk.cuadrante === 0">
                            {{ $t('message.risk.othersRisk') }}
                        </p>
                        <p class="texto-p" v-if="risk.cuadrante === 4">
                            {{ $t('message.risk.quadrantIV') }}
                        </p>
                        <p class="texto-p" v-if="risk.cuadrante === 3">
                            {{ $t('message.risk.quadrantIII') }}
                        </p>
                        <p class="texto-p" v-if="risk.cuadrante === 2">
                            {{ $t('message.risk.quadrantII') }}
                        </p>
                        <p class="texto-p" v-if="risk.cuadrante === 1">
                            {{ $t('message.risk.quadrantI') }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="c-card">
                <div class="c-card-header">
                    <h3 style="margin-top: 10px;font-weight: bold;">
                        {{ $t('message.risk.affectedProcess') }}
                    </h3>                    
                </div>
                <div class="c-card-content">
                    <div class="div-p c-center border-p">
                        <p class="texto-p" v-if="risk.areaRiesgo === 2">
                            {{ $t('message.risk.support') }}
                        </p>
                        <p class="texto-p" v-if="risk.areaRiesgo === 1">
                            {{ $t('message.risk.strategic') }}
                        </p>
                        <p class="texto-p" v-if="risk.areaRiesgo === 0">
                            {{ $t('message.risk.critical') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid lg:grid-cols-1 card-header c-center">
            <h3 style="font-weight: bold;">
                {{ $t('message.risk.natureOfTheRisk') }}
            </h3>
        </div>

        <div class="grid lg:grid-cols-1 gap-1">
            <h3 style="font-weight: bold;">
                Riesgo de error en los estados financieros
            </h3>
            <div class="grid md:grid-cols-2 gap-2">
                <div style="position: relative;">                    
                    <input 
                        v-if="risk.expectativasNegocio === 'Intencional (Fraude)'" 
                        type="radio" 
                        value="true" 
                        v-model="optionTrue" 
                        style="background: #4CAF50;">
                    <input 
                        v-else 
                        type="radio" 
                        v-model="optionFalse">
                    <span class="div-span"> 
                        {{ t('message.risk.intentional') }} 
                    </span>  
                </div>                

                <div style="position: relative;">                    
                    <input 
                        v-if="risk.expectativasNegocio === 'No Intencionales'" 
                        type="radio" 
                        value="true" 
                        v-model="optionTrue" 
                        style="background: #4CAF50;">
                    <input 
                        v-else 
                        type="radio" 
                        v-model="optionFalse">
                    <span class="div-span"> 
                        {{ t('message.risk.unintentional') }} 
                    </span>  
                </div>

                <div style="position: relative;">                    
                    <input 
                        v-if="risk.expectativasNegocio === 'Viabilidad del negocio'" 
                        type="radio" 
                        value="true" 
                        v-model="optionTrue" 
                        style="background: #4CAF50;">
                    <input 
                        v-else 
                        type="radio" 
                        v-model="optionFalse">
                    <span class="div-span"> 
                        {{ t('message.risk.businessViability') }} 
                    </span>  
                </div>

                <div style="position: relative;">                    
                    <input 
                        v-if="risk.expectativasNegocio === 'Expectativas del cliente'" 
                        type="radio" 
                        value="true" 
                        v-model="optionTrue" 
                        style="background: #4CAF50;">
                    <input 
                        v-else 
                        type="radio" 
                        v-model="optionFalse">
                    <span class="div-span"> 
                        {{ t('message.risk.customerExpectations') }} 
                    </span>  
                </div>                             
            </div>
        </div>
        <div class="grid lg:grid-cols-1 gap-1" style="margin-bottom: 0.5rem; display: flex; ">
            <h3 style="font-weight: bold;">
                {{ $t('message.risk.additionalProcedures') }}
            </h3>
            <div class="div-p">
                <p class="texto-p"> 
                    {{ risk.procedimientosAdicionales }}
                </p>
            </div>
        </div>

        <div v-show=" risk.procedimientosAdicionales === 'Si'">
            <div class="grid lg:grid-cols-1 card-header c-center" style="margin-bottom:15px">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.risksAssessment') }}
                </h3>
            </div>
            <div class="grid lg:grid-cols-3 gap-3 mb-4">
                <div class="c-card">
                    <div class="c-card-header">
                        <h3 style="margin-top: 10px;font-weight: bold;">
                            {{ $t('message.risk.affectedProcess') }}
                        </h3> 
                    </div>
                    <div class="c-card-content">
                        <div class="div-p c-center border-p">
                            <p class="texto-p">
                                 {{ risk.inherente }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="c-card">
                    <div class="c-card-header">
                        <h3 style="margin-top: 10px;font-weight: bold;">
                            {{ $t('message.risk.control') }}
                        </h3>                         
                    </div>
                    <div class="c-card-content">
                        <div class="div-p c-center border-p">
                            <p class="texto-p">
                                 {{ risk.control }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="c-card">
                    <div class="c-card-header">
                        <h3 style="margin-top: 10px;font-weight: bold;">
                            {{ $t('message.risk.detection') }}
                        </h3> 
                    </div>
                    <div class="c-card-content">
                        <div class="div-p c-center border-p">
                            <p class="texto-p">
                                 {{ risk.analitico }}
                            </p>
                        </div>
                    </div>
                </div>            
            </div>

            <div class="grid lg:grid-cols-1 gap-1 mb-8" style="margin-bottom: 0.5rem;">

                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.riskFactor') }}
                </h3>
                <div class="div-p">
                    <p class="texto-p">
                        {{ risk.factorRiesgo }}
                    </p>
                </div>

            </div>

            <div class="grid grid-cols-1 gap-2" style="margin-bottom: 0.5rem;">

                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.processesWhereRiskIsInvolved') }}
                </h3>
                <div class="div-p">
                    <p class="texto-p">
                        {{ risk.procesosInvolucrados }}
                    </p>
                </div>

            </div>

            <div class="grid grid-cols-1 gap-2" style="margin-bottom: 0.5rem;">

                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.causativeSourceOfRisk') }}
                </h3>
                <div class="div-p">
                    <p class="texto-p">
                        {{ risk.fuentesCausantes }}
                    </p>
                </div>

            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header c-center" style="margin-bottom: 0.5rem;">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.associatedAssertions') }}
                </h3>                
            </div>

            <div class="grid lg:grid-cols-1 gap-1">
                <h3 style="font-weight: bold; margin-bottom: 12px;">
                    {{ $t('message.risk.assertionsAboutTransactionClassesAndEvents') }}
                </h3>
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
                <h3 style="font-weight: bold; margin-bottom: 12px;">
                    {{ $t('message.risk.statementsOnBalancingItems') }}
                </h3>
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

            <div class="grid lg:grid-cols-1 gap-1 card-header c-center" style="margin-bottom: 0.5rem;">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.accountOfAffectedFinancialStatementsAndStatements') }}
                </h3>
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

            <div class="grid lg:grid-cols-1 gap-1 card-header c-center" style="margin-bottom: 1.5rem;">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.evaluationOfControls') }}
                </h3>                
            </div>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>
                            <h3 style="margin-top: 10px;font-weight: bold;">
                                {{ $t('message.risk.effectiveDesign') }}
                            </h3>
                        </th>
                        <th>
                            <h3 style="margin-top: 10px;font-weight: bold;">
                                {{ $t('message.risk.effectiveOperability') }} 
                            </h3>                             
                        </th>
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
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.monitoring') }}
                                        </h3> 
                                    </div>
                                    <div class="div-ref">
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.ref') }}
                                        </h3>
                                    </div>                                                
                                </div>
                                <div class="c-card-content-ref">
                                    <div class="div-p border-p" style="width: 100%; display: flex;">
                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p"> 
                                                {{ risk.sel_mon }}
                                            </p>                                        
                                        </div>

                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p">
                                                {{ risk.ref_sel_mon }}
                                            </p>                                        
                                        </div>                                        
                                    </div>
                                </div>
                            </div> 
                        </td>
                        <td>
                            <div class="c-card">
                                <div class="c-card-header-ref">
                                    <div class="div-ref">
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.monitoring') }}
                                        </h3>                                        
                                    </div>
                                    <div class="div-ref">
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.ref') }}
                                        </h3>                                        
                                    </div>                                                
                                </div>
                                <div class="c-card-content-ref">
                                    <div class="div-p border-p" style="width: 100%; display: flex;">
                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p"> 
                                                {{ risk.sel_mon2 }}
                                            </p>                                        
                                        </div>

                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p">
                                                {{ risk.ref_sel_mon2 }}
                                            </p>                                        
                                        </div>                                        
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
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.general') }}
                                        </h3>
                                    </div>
                                    <div class="div-ref">
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.ref') }}
                                        </h3>
                                    </div>                                                
                                </div>
                                <div class="c-card-content-ref">
                                    <div class="div-p border-p" style="width: 100%; display: flex;">
                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p"> 
                                                {{ risk.sel_gen }}
                                            </p>                                        
                                        </div>

                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p">
                                                {{ risk.ref_sel_gen }}
                                            </p>                                        
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="c-card">
                                <div class="c-card-header-ref">
                                    <div class="div-ref">
                                         <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.general') }}
                                        </h3>                                        
                                    </div>
                                    <div class="div-ref">
                                         <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.ref') }}
                                        </h3>                                        
                                    </div>                                                
                                </div>
                                <div class="c-card-content-ref">
                                    <div class="div-p border-p" style="width: 100%; display: flex;">
                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p"> 
                                                {{ risk.sel_gen2 }}
                                            </p>                                        
                                        </div>

                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p">
                                                {{ risk.ref_sel_gen2 }}
                                            </p>                                        
                                        </div>                                        
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
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.specific') }}
                                        </h3>
                                    </div>
                                    <div class="div-ref">
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.ref') }}
                                        </h3>
                                    </div>                                                
                                </div>
                                <div class="c-card-content-ref">
                                    <div class="div-p border-p" style="width: 100%; display: flex;">
                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p"> 
                                                {{ risk.sel_esp }}
                                            </p>                                        
                                        </div>

                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p">
                                                {{ risk.ref_sel_esp }}
                                            </p>                                        
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="c-card">
                                <div class="c-card-header-ref">
                                    <div class="div-ref">
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.specific') }}
                                        </h3>                                        
                                    </div>
                                    <div class="div-ref">
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.ref') }}
                                        </h3>                                        
                                    </div>                                                
                                </div>
                                <div class="c-card-content-ref">
                                    <div class="div-p border-p" style="width: 100%; display: flex;">
                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p"> 
                                                {{ risk.sel_esp2 }}
                                            </p>                                        
                                        </div>

                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p">
                                                {{ risk.ref_sel_esp2 }}
                                            </p>                                        
                                        </div>                                        
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
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.informationIntegrity') }}
                                        </h3>
                                    </div>
                                    <div class="div-ref">
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.ref') }}
                                        </h3> 
                                    </div>                                                
                                </div>
                                <div class="c-card-content-ref">
                                    <div class="div-p border-p" style="width: 100%; display: flex;">
                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p"> 
                                                {{ risk.sel2_ini }}
                                            </p>                                        
                                        </div>

                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p">
                                                {{ risk.ref_sel2_ini }}
                                            </p>                                        
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="c-card">
                                <div class="c-card-header-ref">
                                    <div class="div-ref">
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.informationIntegrity') }}
                                        </h3>                                        
                                    </div>
                                    <div class="div-ref">
                                        <h3 style="margin-top: 10px;font-weight: bold;">
                                            {{ $t('message.risk.ref') }}
                                        </h3>                                        
                                    </div>                                                
                                </div>
                                <div class="c-card-content-ref">
                                    <div class="div-p border-p" style="width: 100%; display: flex;">
                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p"> 
                                                {{ risk.sel2_ini2 }} 
                                            </p>                                        
                                        </div>

                                        <div style="width: 50%;" class="c-center">
                                            <p class="texto-p">
                                                {{ risk.ref_sel2_ini2 }}
                                            </p>                                        
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="grid lg:grid-cols-1 gap-1 card-header c-center" style="margin-bottom: 0.5rem;">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.reasonsForNotTestingControls') }}
                </h3> 
                <div class="div-p">
                    <p class="texto-p">
                        {{ risk.reasons_NT_cont }}
                    </p>
                </div>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header c-center" style="margin-bottom: 0.5rem;">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.riskReductionApproach') }}
                </h3> 
            </div>

            <div class="grid lg:grid-cols-1 gap-1 c-center">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.detect/CorrectExistingErrors') }}
                </h3>
            </div>

            <div class="grid lg:grid-cols-1 gap-2">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.approach') }}
                </h3>
                <div class="div-p">
                    <p class="texto-p">
                        {{ risk.padc_enf }}
                    </p>
                </div>
            </div>

            <div class="grid lg:grid-cols-1 gap-2">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.outcomeOfTheAuditProceduresApplied') }}
                </h3>
                <div class="div-p">
                    <p class="texto-p">
                        {{ risk.padc_res }}
                    </p>
                </div>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header c-center" style="margin-bottom: 0.5rem;">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.reference(s)ToWorkingPapers') }}
                </h3>
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

            <div class="grid lg:grid-cols-1 gap-1 card-header c-center" style="margin-bottom: 0.1rem;">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.preventionOfFutureOccurrence:') }}
                </h3>
            </div>

            <div class="grid lg:grid-cols-1 gap-1" style="margin-bottom: 15px;">
                <h3 style="margin-top: 10px;font-weight: bold;">
                    {{ $t('message.risk.recommendationForProcessImprovementprocess') }}
                </h3>
                <div class="div-p">
                    <p class="texto-p">
                        {{ risk.pfo_mpro }}
                    </p>
                </div>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header c-center" style="margin-bottom: 0.1rem;">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.residualAuditRisk') }}
                </h3>
            </div>

            <div class="grid lg:grid-cols-1 gap-1" style="margin-bottom: 15px;">
                <div class="div-p">
                    <p class="texto-p">
                        {{ risk.rda_resi }}
                    </p>
                </div>
            </div>

            <div class="grid lg:grid-cols-1 gap-1 card-header c-center" style="margin-bottom: 0.1rem;">
                <h3 style="font-weight: bold;">
                    {{ $t('message.risk.effectOnTheAuditOpinion') }}
                </h3>
            </div>

            <div class="grid lg:grid-cols-1 gap-1">
                <div class="div-p">
                    <p class="texto-p">
                        {{ risk.conclusion }}
                    </p>
                </div>
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
    padding-bottom: 12px;
}

.c-card-content {
    border: none;
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
    height: 28px;
    padding-bottom: 10px;
}

.card-header-h1 {
    /*margin-bottom: 0.5rem;
    font-weight: 700;*/
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
.div-p {
    height: auto; 
    padding: 0px;
} 

.texto-p {
    height: auto; 
    padding: 2px; 
    word-wrap: break-word;
}

h3 {
    font-size: 12px;
}

.border-p {
    border-color: #1a181854; 
    border-width: 1px;
    padding-bottom: 15px;
}

.radio-button:checked {
  background-color: #4CAF50;
}

.div-span {
    padding-left: 10px; 
    margin-top: -7px; 
    position: absolute;
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
    padding-bottom: 15px;
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
</style>