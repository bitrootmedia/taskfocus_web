<template>
  <div class="main-container pt-2">
    <TrackerDataTable :hide-create="true"/>
  </div>
</template>

<script setup>
import TrackerDataTable from '../../components/Table/TrackerDataTable.vue'
</script>