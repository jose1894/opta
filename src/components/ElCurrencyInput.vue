<template>
    <el-input ref="inputRef" v-model="formattedValue" />
  </template>
  
  <script>
  import { useCurrencyInput } from "vue-currency-input";
  
  export default {
    name: "ElCurrencyInput",
    props: {
      modelValue: Number,
      options: Object,
    },
    setup(props) {
      const { inputRef, formattedValue } = useCurrencyInput(props.options);
  
      return { inputRef, formattedValue };
    },
  };
  </script>