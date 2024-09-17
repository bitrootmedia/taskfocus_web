<template>
  <div v-if="loading" class="mt-4">
    <Loader/>
  </div>

  <div v-else-if="pinnedTasks.length" class="mt-4 w-full">
    <div class="content w-full">
      <h3 class="font-bold mb-2 block md:hidden">Pinned Tasks</h3>

      <ul>
        <li v-for="task in pinnedTasks" :key="task.id"
            class="w-full mb-3 border border-[#fdebab] rounded-[4px] px-4 py-3 cursor-pointer bg-[#fdebab] flex justify-between items-center"
            @click="router.push(`/dashboard/task/${task.id}`)">
          <div>
            <p class="text-black-c mb-1">
              <span class="font-semibold text-black-c"> {{ task.title }}</span>
            </p>
            <div class="mt-1 text-sm text-black-c" v-if="task?.project?.id">
            <span class="block">
              Project link:
              <span class="underline"
                    @click.stop="toLink(`/dashboard/project/${task.project.id}`)">{{ task.project.title }}</span>
            </span>
            </div>
          </div>

          <img width="20" height="20" src="https://img.icons8.com/ios-filled/20/pin--v1.png" alt="pin--v1"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import Loader from '../Loader/Loader.vue'
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  pinnedTasks: {
    type: Array,
    default: () => []
  },
})

//Methods
const toLink = (link) => {
  router.push(link)
}

</script>

