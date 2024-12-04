<template>
  <div v-if="loading" class="mt-4">
    <Loader/>
  </div>

  <div v-else-if="pinnedBoards.length" class="mt-4 w-full">
    <div class="content w-full">
      <h3 class="font-bold mb-2 block md:hidden">Pinned Boards</h3>

      <ul>
        <li v-for="board in pinnedBoards" :key="board.id">
          <router-link :to="`/dashboard/board/${board.id}`"
                       class="w-full mb-3 border border-[#fdebab] rounded-[4px] px-4 py-3 cursor-pointer bg-[#fdebab] flex justify-between items-center">
            <div>
              <p class="text-black-c mb-1">
                <span class="font-semibold text-black-c"> {{ board.name }}</span>
              </p>
            </div>

            <img width="20" height="20" src="https://img.icons8.com/ios-filled/20/pin--v1.png" alt="pin--v1"/>
          </router-link>
        </li>
      </ul>
    </div>
  </div>

  <Pagination
      v-if="paginate.pagination.value.total > 1 && !loading"
      :pagination="paginate.pagination.value"
      v-model:query="paginate.query.value"
  />
</template>

<script setup>
import Pagination from "../Pagination/Pagination.vue";
import {usePaginate} from "../../composables/usePaginate";
import Loader from "../Loader/Loader.vue";
import {ref} from "vue";
import {catchErrors} from "../../utils/index.js";
import {useBoardsStore} from "../../store/boards.js";
import config from "../../config/index.js";


//Store
const boardsStore = useBoardsStore()

//State
const loading = ref(true)
const pinnedBoards = ref([])

//Methods
const fetchPinnedBoards = async () => {
  try {
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
    }

    const resp = await boardsStore.fetchPinnedBoards(options)
    pinnedBoards.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

// Composables
const options = {
  pageSize: config.PINED
}
const paginate = usePaginate(fetchPinnedBoards, options)

fetchPinnedBoards()
</script>


