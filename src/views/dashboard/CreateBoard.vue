<template>
  <div class="main-container pt-6">
    <form class="" @submit="createBoard">
      <div class="flex items-baseline gap-x-4">
        <div class="relative w-[250px]">
          <Input placeholder="Board Name" v-model:value="name" />
          <span class="text-xs font-medium text-red-600" v-if="v$.name.$error"> {{ v$.name.$errors[0].$message }} </span>
        </div>

        <Button
            @on-click="createBoard"
            label="New Board"
            :disabled="loading"
            size="medium"
            version="yellow"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {catchErrors} from "../../utils";
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {useProjectStore} from "../../store/project";
import Input from '../../components/Input/Input.vue'
import Button from '../../components/Button/Button.vue'
import {useBoardsStore} from "../../store/boards.js";
import {useCookies} from "vue3-cookies";

const boardsStore = useBoardsStore()
const toast = useToast()
const router = useRouter()
const {cookies} = useCookies();

// ValidationRules
const rules = {
  name: { required },
}


// State
const loading = ref(false)
const name = ref('')
const description = ref('')

const v$ = useVuelidate(rules, { name })

const authUser = computed(() => {
  if (!cookies.get('task_focus_user')) return ''
  return cookies.get('task_focus_user')
})

// Methods
const createBoard = async(e)=>{
  if(e) e.preventDefault()

  try {
    loading.value = true
    const isValid = await v$.value.$validate();
    if (!isValid) return toast.error("Name is required");

    const data = {
      name: name.value,
      owner: authUser.value.pk
    }

    const resp = await boardsStore.createBoard(data)
    await router.push(`/dashboard/board/${resp.data.id}`)
    toast.success("Successfully created!");
  } catch (e) {
    catchErrors(e)
  }finally {
    loading.value = false
  }
}

</script>

