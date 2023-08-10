import { ref } from "vue";
import { defineStore } from "pinia";

export const useLayouteStore = defineStore("layoutStore", () => {
    const isAsideMobileExpanded = ref(false)
    const isAsideLgActive = ref(false)

    const toggleIsAsideMobileExpanded = () => {
        isAsideMobileExpanded.value = !isAsideMobileExpanded.value
    }

    const toggleIsAsideMobileExpandedValue = (value) => {
        isAsideMobileExpanded.value = value
    }

    function toggleIsAsideLgActiveTrue (value)  {
        isAsideLgActive.value = value
    }

    /*const toggleIsAsideLgActiveFalse = () =>  {
        this.isAsideLgActive.value = false
    }*/

    const toggleIsAsideLgActive = () =>  {
        isAsideLgActive.value = !isAsideLgActive.value
    }

    return{
        isAsideMobileExpanded,
        isAsideLgActive,
        toggleIsAsideMobileExpanded,
        toggleIsAsideMobileExpandedValue,
        toggleIsAsideLgActiveTrue,
        toggleIsAsideLgActive 
    }
});

/*export const useLayouteStore = defineStore("layoutStore", {
    state: () => ({
        isAsideMobileExpanded: false,
        isAsideLgActive: false,
    }),
    actions: {
        toggleIsAsideMobileExpanded() {
            this.isAsideMobileExpanded = !this.isAsideMobileExpanded
        },

        toggleIsAsideLgActiveTrue() {
            this.isAsideLgActive = true
        },

        toggleIsAsideLgActiveFalse() {
            this.isAsideLgActive = false
        },

        toggleIsAsideLgActive() {
            this.isAsideLgActive = !this.isAsideLgActive
        }
    }

});*/