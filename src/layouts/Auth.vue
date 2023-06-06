<template>
  <div>
    <AuthNavbar />
    <main>
      <section class="relative w-full h-full py-40 min-h-screen">
        <div
          class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
          :style="`background-image: url('/src/assets/img/register_bg_2.png');`"
        ></div>

        <router-view :key="$route.params"/>
      </section>
    </main>
  </div>
</template>

<script setup>
import AuthNavbar from "../components/Navbars/AuthNavbar.vue";
</script>




