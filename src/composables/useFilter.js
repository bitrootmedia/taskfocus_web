import {ref, watch} from "vue";

export const useFilter = (items,fetchCallback) => {
   const search = ref('')

    watch(search, (newValue, oldValue) => {
        if (newValue.length >= 3) {
            setTimeout(() => {
                fetchCallback()
            }, 500)
        } else if (!items.value.length || newValue.length === 0) {
            fetchCallback()
        }
    })

    return {
        search
    }
}