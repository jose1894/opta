<script setup>
import { computed } from "vue";
import { mdiClose } from "@mdi/js";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import { useI18n } from "vue-i18n";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";

const { t } = useI18n();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  overlayClick: {
    type: Boolean,
    default: true,
  },
  button: {
    type: String,
    default: "info",
  },
  buttonLabel: {
    type: String,
    default: "Si",
  },
  hasCancel: Boolean,
  hasClose: Boolean,
  hasDone: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
  },
  data: {
    type: {},
    default: null,
  },
  claseModal: {
    type: String,
    default: "shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50 custom-modal",
  },
});

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
  value.value = false;
  emit(mode);
};

const confirm = () => confirmCancel("confirm");

const cancel = () => confirmCancel("cancel");

const overlayClose = () => {
  if(props.overlayClick) {
    value.value = false;
    emit("cancel");
  }
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && value.value) {    
    cancel();
  }
});
</script>

<template>
  <OverlayLayer v-show="value" @overlay-click="overlayClose">
    <CardBox
      v-show="value"
      :class="claseModal"
      is-modal
    >
      <CardBoxComponentTitle :title="title">
        <BaseButton
          v-if="hasClose"
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="cancel"
        />
      </CardBoxComponentTitle>

      <div class="space-y-3">
        <slot />
      </div>

      <template #footer>
        <BaseButtons>

          <BaseButton 
            v-if="hasDone" 
            :label="buttonLabel" 
            :color="button" 
            @click="confirm"/>

          <BaseButton
            v-if="hasCancel"
            :label="$t('message.cancel')"
            :color="button"
            outline
            @click="cancel"
          />
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>
<style scoped>
footer .footer{
  background: white!important;
}
</style>