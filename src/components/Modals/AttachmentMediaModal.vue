<template>
  <div v-if="showModal"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative mx-auto w-full h-full">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
        <div class="sticky top-0 z-[2] bg-slate-400">
          <div class="flex justify-between gap-x-3 py-2 main-container">
            <div>
              <button
                  v-if="ownerOfMedia.isAuth"
                  @click="openModal(ownerOfMedia.attachmentId)"
                  class="bg-red-500 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
              >
                Delete
              </button>
            </div>


            <div class="flex gap-x-3">
              <button
                  @click="downloadTemplate(active.path)"
                  class="bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
              >
                Download
              </button>

              <button
                  @click="emit('close')"
                  class="bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
              >
                Close
              </button>
            </div>

          </div>
        </div>
        <!--body-->
        <div class="relative p-6 mt-10 flex-auto">

          <div class="content max-h-[800px]">
            <img :src="active.src" alt="image" class="w-full h-[800px] object-contain">
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmDeleteModal
      :show-modal="confirmModal"
      :active-id="activeId"
      @close="confirmModal = false"
      @update="update"
  />

  <div v-if="showModal" class="opacity-90 fixed inset-0 z-40 bg-black"></div>
</template>

<script setup>
import ConfirmDeleteModal from './ConfirmDeleteModal.vue'
import {ref} from "vue";

const emit = defineEmits(['close', 'update', 'delete'])
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  active: {
    type: Object,
    default: () => {
    }
  },
  ownerOfMedia: {
    type: Object,
    default: () => {
    }
  },
})

const confirmModal = ref(false)
const activeId = ref(null)

const openModal = (id) => {
  confirmModal.value = true
  activeId.value = id
}

const update = (id)=>{
  emit('delete',id)
  confirmModal.value = false
}

const downloadTemplate = async (url, title) => {

  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.download = title;
  link.click();
}

</script>