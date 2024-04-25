<template>
  <div v-if="showModal" ref="componentModalRef" @click.self="emit('close')"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[350px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <!--header-->
        <div class="py-3">
          <div class="flex items-center justify-between rounded-t p-3 border-b border-light-bg-c">
            <h3 class="text-[22px] text-black-c font-semibold">
              Select new owner
            </h3>

            <CloseBlackIcon class="cursor-pointer" @click="emit('close')"/>
          </div>
        </div>
        <!--body-->
        <div class="relative p-3 flex-auto">
          <Loader v-if="loading"/>

          <div v-else class="content">
            <ul>
              <li v-for="user in users" :key="user.id" class="flex justify-between items-center gap-x-1 mb-2">
                <span class="text-[13px] text-light-c font-medium"
                      v-if="user.first_name || user.last_name">{{ user.first_name }} {{ user.last_name }}</span>
                <span class="text-[13px] text-light-c font-medium" v-else>{{ user.username }}</span>
                <Button
                    @on-click="update(user)"
                    :label="'Assign'"
                    version="green-small"
                    size="small"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import Loader from "./../../components/Loader/Loader.vue"
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";
import CloseBlackIcon from "../Svg/CloseBlackIcon.vue";
import Button from '../Button/Button.vue'

const emit = defineEmits(['close', 'update'])
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: () => {
    }
  },
  task: {
    type: Object,
    default: () => {
    }
  },
  haveProjectAccess: {
    type: Array,
    default: () => []
  },
  haveProjectAccessIds: {
    type: Array,
    default: () => []
  },
  users: {
    type: Array,
    default: () => []
  },
  btnTitle: {
    type: String,
    default: ''
  },
})


const {cookies} = useCookies();
const toast = useToast()

// State
const componentModalRef = ref()
const loading = ref(false)
const owner = ref(null)


// Methods
const update = async (user) => {
  emit('update', user.id)
  emit('close')

}


const handleClick = (e) => {
  if (e.target.innerHTML === props.btnTitle) return false

  if (!componentModalRef.value === e.target) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('click', handleClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClick)
})

</script>
