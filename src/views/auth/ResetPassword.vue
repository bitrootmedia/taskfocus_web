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
                Reset Password
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
                  Email
                </label>
                <input
                    v-model="form.email"
                    type="email"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Email"
                />
                <span class="text-xs font-medium text-red-600"
                      v-if="v$.email.$error"> {{ v$.email.$errors[0].$message }} </span>
              </div>

              <div class="text-center mt-6">
                <button
                    @click="sendEmail"
                    :disabled="loading"
                    class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="button"
                >
                  Send
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
import {useUserStore} from "../../store/user";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {required,  email} from "@vuelidate/validators";
import {ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {catchErrors} from "../../utils";

const userStore = useUserStore()
const {cookies} = useCookies();
const toast = useToast()
const router = useRouter()

// ValidationRules
const rules = {
  email: {required,  email},
}


// State
const loading = ref(false)
const form = ref({
  email: '',
})

// Methods
const enterIn = (e) => {
  if (e.charCode === 13) sendEmail()
}

const sendEmail = async () => {
  try {
    loading.value = true
    const isValid = await v$.value.$validate();
    console.log(isValid,'isValid')

    if (isValid) {
      const resp = await userStore.resetPassword(form.value)
      await toast.success(resp.data.detail || "Successfully send");
      await router.push('/')
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const v$ = useVuelidate(rules, form)
</script>
