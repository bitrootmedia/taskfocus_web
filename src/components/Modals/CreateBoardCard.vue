<template>
  <div v-if="showModal"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[390px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <div class="py-3">
          <div class="flex items-center justify-between rounded-t p-3 border-b border-light-bg-c">
            <h2 class="text-[22px] text-black-c font-semibold">Create New Card</h2>

            <CloseBlackIcon class="cursor-pointer" @click="emit('close')"/>
          </div>
        </div>

        <div class="relative p-4 flex-auto">
          <div class="relative w-full">
            <Input placeholder="Title of Card" v-model:value="name"/>
          </div>

          <div class="flex justify-center gap-x-3 mt-8">
            <Button
                @on-click="emit('close')"
                :label="'Cancel'"
                version="yellow"
                size="medium"
            />
            <Button
                @on-click="createTask"
                :label="'Create'"
                version="green"
                size="medium"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</template>

<script setup>
import Button from '../Button/Button.vue'
import Input from "../Input/Input.vue";
import {ref} from "vue";
import {useToast} from "vue-toastification";
import CloseBlackIcon from "../Svg/CloseBlackIcon.vue";
const emit = defineEmits(['close','update'])
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  activeId: {
    type: String,
    default: ''
  },
})

const toast = useToast()
const name = ref('')

const createTask = async()=>{
  if (!name.value.length) return toast.error("Name is required");

  await emit('create', name.value)
  await emit('close')
  name.value = ''
}
</script>
