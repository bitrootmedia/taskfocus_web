<template>
  <div>
    <Sidebar v-model:closePanel="closePanel"/>
    <div class="relative bg-blueGray-100 z-[1]" :class="{'md:ml-[312px]': !closePanel,'md:ml-[100px]': closePanel}">
      <AdminNavbar/>
      <div class="relative pt-6 pb-8 md:pb-6 h-full">
        <div class=" mx-auto w-full">
          <router-view :key="$route.params"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminNavbar from "../components/Navbars/AdminNavbar.vue";
import Sidebar from "../components/Sidebar/Sidebar.vue";
import {onMounted, ref, watch} from "vue";

const closePanel = ref(false)

//Watch
watch(closePanel, (newVal) => {
  localStorage.setItem('isClosed', newVal)
})

onMounted(() => {
  closePanel.value = localStorage.getItem('isClosed') === 'true'
  console.log(closePanel.value,'00000000')
})
</script>

