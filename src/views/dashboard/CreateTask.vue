<template>
  <div class="main-container">
    <h2 v-if="tempProject" class="text-md block text-blueGray-700 mb-4 sm:mb-8">Project: <b>{{tempProject.name}}</b></h2>

    <form class="flex items-center items-baseline gap-x-8" @submit="createTask">
      <div class="relative w-2/4">
        <input
            v-model="name"
            type="text"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Task Name"
        />
        <span class="text-xs font-medium text-red-600" v-if="v$.name.$error"> {{ v$.name.$errors[0].$message }} </span>
      </div>

      <button
          @click="createTask"
          :disabled="loading"
          class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button"
      >
        Next
      </button>
    </form>
  </div>
</template>

<script setup>
import { onBeforeRouteLeave } from 'vue-router'
import {ref, onMounted} from "vue";
import {catchErrors} from "../../utils";
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {useTasksStore} from "../../store/tasks";

const taskStore = useTasksStore()
const toast = useToast()
const router = useRouter()

// ValidationRules
const rules = {
  name: { required },
}


// State
const loading = ref(false)
const name = ref('')
const tempProject = ref(null)

const v$ = useVuelidate(rules, { name })

// Methods
const createTask = async(e)=>{
  e.preventDefault()

  try {
    loading.value = true
    const isValid = await v$.value.$validate();
    if (isValid){
      const data = {
        title: name.value,
        project: tempProject.value?.id || null
      }
      const resp = await taskStore.createTask(data)
      name.value = ''
      await toast.success("Task created");
      await router.push(`/dashboard/task/${resp.data.id}`)
    }
  }catch (e) {
    catchErrors(e)
  }finally {
    loading.value = false
  }
}

onMounted(() => {
  const temp = localStorage.getItem('tempProject')
  if (temp) tempProject.value = JSON.parse(temp)
})

onBeforeRouteLeave((to, from) => {
  localStorage.removeItem('tempProject')
})

</script>

