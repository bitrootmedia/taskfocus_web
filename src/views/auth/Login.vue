<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-4/12 px-4">
        <div
            class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
        >
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-blueGray-500 text-sm font-bold">
                Sign in
              </h6>
            </div>
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form @keypress="enterIn">
              <div class="relative w-full mb-3">
                <label
                    class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                >
                  Username
                </label>
                <input
                    v-model="form.username"
                    type="text"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Username"
                />
                <span class="text-xs font-medium text-red-600"
                      v-if="v$.username.$error"> {{ v$.username.$errors[0].$message }} </span>
              </div>

              <div class="relative w-full mb-3">
                <label
                    class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                >
                  Password
                </label>
                <input
                    v-model="form.password"
                    type="password"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password"
                />
                <span class="text-xs font-medium text-red-600"
                      v-if="v$.password.$error"> {{ v$.password.$errors[0].$message }} </span>
              </div>

              <div class="flex justify-end">
                <span @click="router.push('/reset-password')" class="cursor-pointer text-blueGray-600 underline font-semibold">
                  Forgot Password?
                </span>

              </div>

              <div class="text-center mt-6">
                <button
                    @click="signIn"
                    :disabled="loading"
                    class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="button"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
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
import {required} from '@vuelidate/validators'
import axios from "axios";

const userStore = useUserStore()
const {cookies} = useCookies();
const toast = useToast()
const router = useRouter()

// ValidationRules
const rules = {
  username: {required},
  password: {required},
}


// State
const loading = ref(false)
const form = ref({
  username: '',
  password: '',
})

const v$ = useVuelidate(rules, form)

// Methods
const enterIn = (e) => {
  if (e.charCode === 13) signIn()
}

const signIn = async () => {
  try {
    loading.value = true
    const isValid = await v$.value.$validate();

    if (isValid) {
      const resp = await userStore.login(form.value)
      await cookies.set('task_focus_token', resp.data.key)
      axios.defaults.headers.common['Authorization'] = `Token ${resp.data.key}`
      const respUser = await userStore.fetchUser(resp.data.key)
      await cookies.set('task_focus_user', respUser.data)
      await router.push('/dashboard')
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

</script>

