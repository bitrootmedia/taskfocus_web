<template>
  <div>
    <Loader v-if="loading"/>

    <div v-else class="reminders">
      <div class="header flex items-center gap-x-6 mb-3">
        <h2 class="font-semibold text-lg text-black-c block">Reminders</h2>
      </div>

      <ul>
        <li v-for="reminder in reminders" :key="reminder.id"
            class="w-full mb-3 rounded-[10px]"
            :class="[reminderCheck(reminder.reminder_date) === 'today' ? 'bg-red-light-c' : reminderCheck(reminder.reminder_date) === 'tmr' ? 'bg-orange-c' : '']"
        >
          <div class="header flex items-center justify-between border-b border-[#7b797938] px-3 pt-3 pb-2">
            <div class="flex items-center">
              <span class="text-black-c text-sm font-semibold mr-1">{{ fullName(reminder) }}</span>
              <span class="text-black-c text-sm mr-2">({{ userName(reminder) }})</span>
              <span class="text-black-c text-sm font-semibold">{{ convertDateTime(reminder.reminder_date) }}</span>
            </div>

            <Button
                v-if="!hide"
                @on-click="close(reminder)"
                :label="'Delete'"
                version="red-small"
                size="medium"
            />
          </div>

          <div class="mt-2 px-3 pb-3">
            <div class="mb-2 text-xs text-black-c">
              <span v-if="showLinks && reminder.task?.id" class="block">Task link: <router-link
                  class="underline"
                  :to="`/dashboard/task/${reminder.task.id}`">{{ reminder.task.title }}</router-link></span>
              <span v-if="showLinks && reminder.task?.project?.id" class="block">Project link: <router-link
                  class="underline"
                  :to="`/dashboard/project/${reminder.task.project.id}`">{{
                  reminder.task.project.title
                }}</router-link></span>
            </div>

            <p class="text-black-c text-sm w-full lg:w-[720px]">{{ reminder.message }}</p>
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
import moment from "moment";
import Button from '../Button/Button.vue'

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
  showLinks: {
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

const userName = (reminder) => {
  const findItem = props.users.find((item) => item.id === reminder.user)
  if (findItem) return findItem.username

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

const reminderCheck = (date) => {
  const isToday = moment(0, "HH").diff(date, "days") >= 0
  const isTmr = moment(0, "HH").diff(date, "days") === -1

  if (isToday) return 'today'
  if (isTmr) return 'tmr'

  return ''
}


</script>
