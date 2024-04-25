<template>
  <div class="main-container pt-6">
    <form class="" @submit="createProject">
      <div class="flex items-center items-baseline gap-x-4">
        <div class="relative w-[250px]">
          <Input placeholder="Project Name" v-model:value="name" />
          <span class="text-xs font-medium text-red-600" v-if="v$.name.$error"> {{ v$.name.$errors[0].$message }} </span>
        </div>

        <Button
            @on-click="createProject"
            label="New Project"
            :disabled="loading"
            size="medium"
            version="yellow"
        />
      </div>
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
import Input from '../../components/Input/Input.vue'
import Button from '../../components/Button/Button.vue'

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

