<template>
  <div class="main-container">
    <CommentsDataTable :hide-create="true"/>
  </div>
</template>

<script setup>
import CommentsDataTable from '../../components/Table/CommentsDataTable.vue'
</script>
