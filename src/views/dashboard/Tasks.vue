<template>
  <div class="main-container">
    <div class="actions flex gap-x-6">
      <button
          @click="router.push('/dashboard/create-task')"
          class="bg-yellow-600 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button"
      >
        Create Task
      </button>
    </div>

    <TasksDataTable :hide-create="true"/>
  </div>
</template>

<script setup>
import TasksDataTable from '../../components/Table/TasksDataTable.vue'
import {useRouter} from "vue-router";

const router = useRouter()

</script>

