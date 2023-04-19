import {ref, watch} from "vue";
import config from '../config'

export const usePaginate = (fetchCallback, options) => {
    const pageSize = options?.pageSize || +config.DEFAULT_PAGE_SIZE
    const query = ref(`page=1&page_size=${pageSize}`)
    const pagination = ref({
        total: 1,
        current: 1,
        next: '',
        prev: '',
        pageSize
    })

    watch(query, () => {
        fetchCallback()
    })

    const updatePagination = (resp) => {
        pagination.value = {
            total: resp.data.total,
            next: resp.data.next,
            prev: resp.data.previous,
            current: resp.data.current,
            query: query.value,
            pageSize,
        }
    }

    return {
        pageSize, query, pagination, updatePagination
    }
}