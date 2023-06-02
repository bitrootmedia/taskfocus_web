<template>
  <div class="main-container">
    <CommentsDataTable :show-search="true" :hide-create="true"/>
  </div>
</template>

<script setup>
import CommentsDataTable from '../../components/Table/CommentsDataTable.vue'
</script>
