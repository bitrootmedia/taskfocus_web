<template>
  <div class="main-container pt-2">
    <LogsDataTable :hide-create="true"/>
  </div>
</template>

<script setup>
import LogsDataTable from '../../components/Table/LogsDataTable.vue'
</script>