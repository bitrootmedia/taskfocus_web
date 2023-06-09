<template>
  <div class="main-container">
    <div class="content mt-4">
      <h2 class="font-bold text-xl block text-blueGray-700 mb-6">Settings</h2>

      <div class="passwords-wrapper w-[500px]">
        <h2 class="font-bold text-md block text-blueGray-700 mb-3">Change Password</h2>
        <form @keypress="enterIn">
          <div class="relative w-full mb-3">
            <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
            >
              Password
            </label>
            <input
                v-model="form.password"
                id="grid-password"
                type="password"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Password"
            />
            <span class="text-xs font-medium text-red-600"
                  v-if="v$.password.$error"> {{ v$.password.$errors[0].$message }} </span>
          </div>

          <div class="relative w-full mb-3">
            <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-confirmPassword"
            >
              Confirm Password
            </label>
            <input
                v-model="form.confirmPassword"
                id="grid-confirmPassword"
                type="password"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Confirm Password"
            />
            <span class="text-xs font-medium text-red-600"
                  v-if="v$.confirmPassword.$error"> {{ v$.confirmPassword.$errors[0].$message }} </span>
          </div>

          <div class="text-center mt-6">
            <button
                @click="changePassword"
                :disabled="loading"
                class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="button"
            >
              Update Password
            </button>
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
