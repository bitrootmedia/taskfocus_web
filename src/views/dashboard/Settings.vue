<template>
  <div class="main-container">
    <div class="content mt-4">
      <h2 class="text-black-c text-2xl font-semibold mb-4">Settings</h2>

      <div class="passwords-wrapper w-full sm:w-[300px]">
        <form @keypress="enterIn">
          <div class="relative w-full mb-4">
            <Input placeholder="Password" label="Password" v-model:value="form.password" type="password"/>
            <span class="text-xs font-medium text-red-600"
                  v-if="v$.password.$error"> {{ v$.password.$errors[0].$message }} </span>
          </div>

          <div class="relative w-full mb-4">
            <Input placeholder="Confirm Password" label="Confirm Password" v-model:value="form.confirmPassword" type="confirmPassword"/>
            <span class="text-xs font-medium text-red-600"
                  v-if="v$.confirmPassword.$error"> {{ v$.confirmPassword.$errors[0].$message }} </span>
          </div>

          <div class="mt-6">
            <Button
                @on-click="changePassword"
                label="Update Password"
                :disabled="loading"
                size="medium"
                version="yellow"
            />
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from 'vue-router'
import {useToast} from 'vue-toastification';
import {useCookies} from "vue3-cookies";
import {useUserStore} from "../../store/user";
import {catchErrors} from "../../utils";
import {useVuelidate} from '@vuelidate/core'
import {required, sameAs} from '@vuelidate/validators'
import Input from '../../components/Input/Input.vue'
import Button from "../../components/Button/Button.vue"

const userStore = useUserStore()
const {cookies} = useCookies();
const toast = useToast()
const router = useRouter()


// State
const loading = ref(false)
const form = ref({
  password: '',
  confirmPassword: '',
})

// ValidationRules
const rules =  ()=> {
  return {
    password:{required},
    confirmPassword: {
      required,
      sameAsPassword: sameAs(form.value.password),
    }
  }
}

const v$ = useVuelidate(rules, form)

// Methods
const enterIn = (e) => {
  if (e.charCode === 13) changePassword()
}

const changePassword = async()=>{
  try {
    loading.value = true
    const isValid = await v$.value.$validate();

    if (isValid) {
      const data = {
        new_password1: form.value.password,
        new_password2: form.value.confirmPassword,
      }
      const resp = await userStore.updatePassword(data)
      await toast.success(resp.data.detail);
      form.value = {
        password: '',
        confirmPassword: '',
      }
      await v$.value.$reset()
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}
</script>
