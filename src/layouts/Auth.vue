<template>
  <div>
    <AuthNavbar />
    <main>
      <section class="relative w-full h-full py-40 min-h-screen">
        <div
          class="absolute top-0 w-full h-full bg-[#d5d5d5] bg-no-repeat bg-full"
        ></div>

        <router-view :key="$route.params"/>
      </section>
    </main>
  </div>
</template>

<script setup>
import AuthNavbar from "../components/Navbars/AuthNavbar.vue";
</script>




