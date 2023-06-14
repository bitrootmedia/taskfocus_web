<template>
  <div v-if="showModal"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[390px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <div class="relative p-6 flex-auto">
          <h2 class="text-lg font-semibold ">Are you sure you want to delete this media?</h2>



          <div class="flex justify-around mt-8">

            <button
                @click="emit('close')"
                class="mt-2 bg-red-400 text-white active:bg-blueGray-600 text-md font-bold px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Abort
            </button>
            <button
                @click="closeTask"
                class="mt-2 bg-blueGray-800 text-white active:bg-blueGray-600 text-md font-bold px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</template>

<script setup>
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
