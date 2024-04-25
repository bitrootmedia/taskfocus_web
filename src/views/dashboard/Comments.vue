<template>
  <div class="main-container pt-2 pb-6">
    <CommentsDataTable :show-search="true" :hide-create="true"/>
  </div>
</template>

<script setup>
import CommentsDataTable from '../../components/Table/CommentsDataTable.vue'
</script>
