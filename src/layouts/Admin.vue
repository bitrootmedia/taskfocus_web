<template>
  <div>
    <Sidebar v-model:closePanel="closePanel"/>
    <div class="relative bg-blueGray-100" :class="{'md:ml-64': !closePanel,'md:ml-16': closePanel}">
      <AdminNavbar />
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
import {ref} from "vue";

const closePanel = ref(false)

</script>

