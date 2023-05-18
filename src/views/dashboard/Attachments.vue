<template>
  <div class="main-container">
    <AttachmentsDataTable :hide-create="true"/>
  </div>
</template>

<script setup>
import AttachmentsDataTable from '../../components/Table/AttachmentsDataTable.vue'
</script>