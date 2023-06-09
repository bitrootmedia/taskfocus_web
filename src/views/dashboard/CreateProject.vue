<template>
  <div class="main-container">
    <form class="" @submit="createProject">
      <div class="relative w-full md:w-2/4 mb-4">
        <input
            v-model="name"
            type="text"
            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Project Name"
        />
        <span class="text-xs font-medium text-red-600" v-if="v$.name.$error"> {{ v$.name.$errors[0].$message }} </span>
      </div>

<!--      <div class="w-full md:w-2/4 mb-4">-->
<!--        <textarea-->
<!--            v-model="description"-->
<!--            type="text"-->
<!--            rows="5"-->
<!--            class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"-->
<!--            placeholder="Project Description"-->
<!--        />-->
<!--      </div>-->

      <button
          @click="createProject"
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
import {ref} from "vue";
import {catchErrors} from "../../utils";
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {useProjectStore} from "../../store/project";

const projectStore = useProjectStore()
const toast = useToast()
const router = useRouter()

// ValidationRules
const rules = {
  name: { required },
}


// State
const loading = ref(false)
const name = ref('')
const description = ref('')

const v$ = useVuelidate(rules, { name })

// Methods
const createProject = async(e)=>{
  e.preventDefault()
  try {
    loading.value = true
    const isValid = await v$.value.$validate();
    if (isValid){
      const data = {
        title: name.value
      }

      const resp = await projectStore.createProject(data)
      name.value = ''
      await toast.success("Project created");
      await router.push(`/dashboard/project/${resp.data.id}`)
    }
  }catch (e) {
    catchErrors(e)
  }finally {
    loading.value = false
  }
}

</script>

