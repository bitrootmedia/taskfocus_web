<template>
  <div v-if="showModal"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[390px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <div class="relative p-4 flex-auto">
          <h2 class="text-[22px] text-black-c font-semibold">Are you sure you want to delete this media?</h2>

          <div class="flex justify-center gap-x-3 mt-8">
            <Button
                @on-click="closeTask"
                :label="'Confirm'"
                version="yellow"
                size="medium"
            />
            <Button
                @on-click="emit('close')"
                :label="'Abort'"
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


const closeTask = ()=>{
  emit('update', props.activeId)
}
</script>
