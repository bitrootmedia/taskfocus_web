<template>
  <div class="main-container pt-2 pb-6">
    <AttachmentsDataTable :hide-create="true"/>
  </div>
</template>

<script setup>
import AttachmentsDataTable from '../../components/Table/AttachmentsDataTable.vue'
</script>