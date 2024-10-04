<template>
  <div v-if="loading" class="mt-4">
    <Loader/>
  </div>

  <div v-else-if="pinnedTasks.length" class="mt-4 w-full">
    <div class="content w-full">
      <h3 class="font-bold mb-2 block md:hidden">Pinned Tasks</h3>

      <ul>
        <li v-for="task in pinnedTasks" :key="task.id">
          <router-link :to="`/dashboard/task/${task.id}`"
                       class="w-full mb-3 border border-[#fdebab] rounded-[4px] px-4 py-3 cursor-pointer bg-[#fdebab] flex justify-between items-center">
            <div>
              <p class="text-black-c mb-1">
                <span class="font-semibold text-black-c"> {{ task.title }}</span>
              </p>
              <div class="mt-1 text-sm text-white flex space-x-2">
                <span v-if="task.status" class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {{task.status}}
                </span>

                <span v-if="task.urgency_level" class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                  {{task.urgency_level}}
                </span>

                <span v-if="task.tag" class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                  {{task.tag}}
                </span>

              </div>

              <div class="mt-1 text-sm text-black-c" v-if="task?.project?.id">
            <span class="block">
              Project link:
              <span class="underline"
                    @click.stop="toLink(`/dashboard/project/${task.project.id}`)">{{ task.project.title }}</span>
            </span>
              </div>
            </div>

            <img width="20" height="20" src="https://img.icons8.com/ios-filled/20/pin--v1.png" alt="pin--v1"/>
          </router-link>
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

