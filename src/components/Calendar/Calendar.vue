<template>
  <!--  editable-events-->
  <!--  @event-change="onEventChange"-->
  <VueCal
      style="height: 800px"
      :events="events"
      :selected-date="currentDate"
      :time-from="0"
      :time-step="30"
      default-view="week"
      events-count-on-year-view
      events-on-month-view="short"
      @event-click="eventClick"
      @view-change="onViewChange"
  />
</template>

<script setup>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import moment from "moment";
import {ref} from "vue";
import {catchErrors} from "../../utils/index.js";
import {useTasksStore} from "../../store/tasks.js";
import {useCookies} from "vue3-cookies";
import {useRoute, useRouter} from "vue-router";

//Store
const {cookies} = useCookies();
const taskStore = useTasksStore()
const router = useRouter()
const route = useRoute()


//State
const currentDate = ref(moment().format("YYYY-MM-DD"));
const loading = ref(true)
const events = ref([])
const filters = ref({
  start: '',
  end: ''
})


//Methods
const setDefaultDate = () => {
  const startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
  const endOfWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');
  filters.value = {
    start: startOfWeek,
    end: endOfWeek,
  }
}

const onViewChange = (type) => {
  let start = ''
  let end = ''

  if (type.view === 'day') {
    start = end = moment(type.startDate).format("YYYY-MM-DD");
  }
  if (['week', 'year', 'years'].includes(type.view)) {
    start = moment(type.startDate).format("YYYY-MM-DD");
    end = moment(type.endDate).format("YYYY-MM-DD");
  }
  if (type.view === 'month') {
    start = moment(type.firstCellDate).format("YYYY-MM-DD");
    end = moment(type.lastCellDate).format("YYYY-MM-DD");
  }

  filters.value = {start: start, end: end}
  fetchEvents()
};

const eventClick = (event) => {
  router.push(`/dashboard/task/${event.task_id}`)
};

const fetchEvents = async () => {
  try {
    const userId = route.params.id
    if (!filters.value.start && !filters.value.end) await setDefaultDate()

    const options = {
      user_id: userId,
      start_date: filters.value.start,
      end_date: filters.value.end,
    }
    const resp = await taskStore.fetchEvents(options)
    events.value = resp.data.events
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}


// const onEventChange = (updatedEvent) => {
//   // const eventIndex = props.events.findIndex(event => event.start === updatedEvent.old.start && event.title === updatedEvent.old.title);
//
//   // if (eventIndex !== -1) {
//   //   console.log(updatedEvent,'1111')
//   //   // events.value[eventIndex] = updatedEvent.new; // Save the new event data
//   // }
// }


//Run functions
fetchEvents()
</script>

<style>
.vuecal__event {
  cursor: pointer;
  padding: 5px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Custom Green Theme */
.vuecal {
  background-color: #e0f2f1; /* Light green background */
  color: #369b93; /* Dark green text */
}

.vuecal .vuecal__header {
  background-color: #369b93; /* Green header */
  color: white;
}

.vuecal .vuecal__cell {
  border: 1px solid #a7dfdd; /* Light green borders for cells */
}

.vuecal .vuecal__event {
  background-color: #4ec3b9 !important; /* Green for events */
  color: white !important;
}

.vuecal .vuecal__today {
  background-color: #4ec3b9 !important; /* Lighter green for today's date */
}

.vuecal .vuecal__nav-btn {
  background-color: #4ec3b9; /* Green navigation buttons */
  color: white;
}

.vuecal .vuecal__cell-events-count {
  background-color: #4ec3b9;
  color: #fff;
}

.vuecal__event.lunch {
  color: #666666 !important;
  background: repeating-linear-gradient(45deg, transparent, transparent 10px, #f2f2f2 10px, #f2f2f2 20px);
  background-color: #d5d5d7 !important;
}
</style>

