<script setup>
import {
  defineProps,
  reactive,
  ref
} from 'vue';
import BaseButton from "@/components/BaseButton.vue";
import { mdiPrinter } from "@mdi/js";
import { useI18n } from "vue-i18n";
import VueHtml2pdf from 'vue3-html2pdf';

const { t } = useI18n();

const props = defineProps({
  pdfFormat: {
    type: String,
    default: 'a4',
  },
  pdfOrientation: {
    type: String,
    default: 'portrait',
  },
  pdfNameFile: {
    type: String,
    default: 'report',
  },
  pdfContentWidth: {
    type: String,
    default: '800px',
  },
  showProgressBar: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    default: '',
  },
})

const html2Pdf = ref(null);
const progress = ref(0);

const downloadPdf = () => {
    const margin = {
        top: '60mm',
        bottom: '60mm',
        left: '30mm',
        right: '30mm',
      };
      const options = {
        margin
      };
  html2Pdf.value.generatePdf();
};

const onGenerated = (pdf) => {
  const blob = pdf.output('blob');
  FileSaver.saveAs(blob, 'document.pdf');
};

/*const onGenerated = (pdf) => {
  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${props.pdfNameFile}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};*/

</script>

<template>
<div>
    <vue-html2pdf
      :pdf-format="pdfFormat"
      :pdf-orientation="pdfOrientation"
      :pdf-content-width="pdfContentWidth"
      :paginate-elements-by-height="1400"
      :pdf-margin="{ top: 30, bottom: 30, left: 20, right: 20 }"
      :pdf-quality="1"
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :manual-pagination="true"
      @hasGenerated="onGenerated"
      ref="html2Pdf"
    >
      <template v-slot:pdf-content>
        <div>
          <slot name="pdf-content" />
        </div>        
      </template>
    </vue-html2pdf>
    <BaseButton 
      color="info" 
      :icon="mdiPrinter" 
      :messageTooltip="t('message.print')" 
      small
      @click="downloadPdf"></BaseButton>
  </div>
</template>
  