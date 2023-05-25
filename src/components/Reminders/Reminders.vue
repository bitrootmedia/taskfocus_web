<template>
  <div>
    <Loader v-if="loading"/>

    <div v-else class="reminders">
      <div class="header flex items-center gap-x-6 mb-4">
        <h2 class="font-bold text-xl block text-blueGray-700">Reminders</h2>
      </div>

      <ul>
        <li v-for="reminder in reminders" :key="reminder.id"
            class="w-full lg:w-[700px] mb-3 border border-blueGray-300 rounded-[4px] px-4 py-3">
          <div class="flex items-center justify-between">
            <span class="text-blueGray-700 font-semibold">{{ convertDateTime(reminder.reminder_date) }}</span>

            <button
                v-if="!hide"
                @click="close(reminder)"
                class="bg-red-400 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Close
            </button>
          </div>

          <div>
            <div class="mt-2">
              <span class="text-blueGray-400 font-semibold block mb-2">User: {{ fullName(reminder) }}</span>

              <p class="text-blueGray-500 ">{{ reminder.message }}</p>
            </div>
          </div>
        </li>
      </ul>

      <Pagination
          v-if="paginate.pagination.value.total > 1 && !loading"
          :pagination="paginate.pagination.value"
          v-model:query="paginate.query.value"
          :position="'right'"
      />
    </div>
  </div>
</template>

<script setup>
import Pagination from '../Pagination/Pagination.vue'
import {catchErrors, convertDateTime} from "../../utils";
import Loader from '../Loader/Loader.vue'
import {useTasksStore} from "../../store/tasks";
import {useToast} from "vue-toastification";

const emit = defineEmits(['update'])
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  hide: {
    type: Boolean,
    default: false
  },
  paginate: {
    type: Object,
    default: () => {
    }
  },
  reminders: {
    type: Array,
    default: () => []
  },
  users: {
    type: Array,
    default: () => []
  }
})

const taskStore = useTasksStore()
const toast = useToast()

// Methods
const fullName = (reminder) => {
  const findItem = props.users.find((item) => item.id === reminder.user)
  if (findItem) return findItem.first_name + ' ' + findItem.last_name

  return ''
}

const close = async (reminder) => {
  try {
    await taskStore.closeReminder({id: reminder.id})
    await toast.success('Successfully closed')
    await emit('update')
  } catch (e) {
    catchErrors(e)
  }
}

</script>
