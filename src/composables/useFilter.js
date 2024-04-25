import {ref, watch} from "vue";

export const useFilter = (items, fetchCallback) => {
    const search = ref('')
    const projectSearch = ref('')
    const tagSearch = ref('')

    watch([search], ([newValue, oldValue]) => {
        searchHandler(newValue)
    })
    watch([projectSearch], ([newValue, oldValue]) => {
        searchHandler(newValue)
    })
    watch([tagSearch], ([newValue, oldValue]) => {
        searchHandler(newValue)
    })

    const searchHandler = (newValue) => {
        if (newValue.length >= 3) {
            setTimeout(() => {
                fetchCallback()
            }, 500)
        } else if (!items.value.length || newValue.length === 0) {
            fetchCallback()
        }
    }

    const resetAll = () => {
        search.value = ''
        projectSearch.value = ''
        tagSearch.value = ''

        fetchCallback()
    }

    return {
        search, projectSearch, tagSearch, resetAll
    }
}