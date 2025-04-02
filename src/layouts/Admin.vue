<template>
  <div>
    <Sidebar v-model:closePanel="closePanel"/>
    <div class="relative bg-[#f6f6f6] z-[1]" :class="{'md:ml-[220px]': !closePanel,'md:ml-[100px]': closePanel}">
      <AdminNavbar v-if="['Project Detail','Task Detail'].includes(route.name)"/>
      <div class="relative h-full">
        <div class=" mx-auto w-full">

          <div class="px-8 py-4 w-full sticky top-0 z-10 bg-[#f6f6f6]" v-if="showButton">
            <Button
                class="w-full h-[70px] text-center flex items-center justify-center text-xl font-bold uppercase"
                @on-click="sendRequest"
                label="Click Me"
                size="big"
                version="orange"
            />
          </div>

          <router-view :key="$route.params"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminNavbar from "../components/Navbars/AdminNavbar.vue";
import Sidebar from "../components/Sidebar/Sidebar.vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import Button from "../components/Button/Button.vue";
import {useUserStore} from "../store/user.js";
import {catchErrors} from "../utils/index.js";
import config from "../config/index.js";

//Store
const route = useRoute()
const userStore = useUserStore()

//State
const closePanel = ref(false)
const showButton = ref(false)
const showNotification = ref(false)
const beaconId = ref(null)
let timer = null

//Watch
watch(closePanel, (newVal) => {
  localStorage.setItem('isClosed', newVal)
})

onMounted(() => {
  closePanel.value = localStorage.getItem('isClosed') === 'true'

  timer = setInterval(() => {
    fetchBeaconQuery()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(timer)
  timer = null
});

const fetchBeaconQuery = async () => {
  try {
    const resp = await userStore.fetchBeaconQuery()
    if (resp.data.beacon?.id) {
      showButton.value = true
      beaconId.value = resp.data.beacon.id

      if (!showNotification.value) notifyMe()
    }

    document.title = resp.data.beacon?.id ? '!!! Click Me !!!' : config.PROJECT_NAME;
  } catch (e) {
    catchErrors(e)
  }
}

const sendRequest = async () => {
  try {
    const data = {"beacon": beaconId.value}
    await userStore.createBeaconQuery(data)

    showButton.value = false
    showNotification.value = false
    beaconId.value = null
  } catch (e) {
    catchErrors(e)
  }
}

const notifyMe = () => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.");
    return;
  }

  if (Notification.permission === "granted") {
    showNotification.value = true

    new Notification("!!! Click Me !!!", {
      body: "Dont forget to click on button.",
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        showNotification.value = true

        new Notification("!!! Click Me !!!", {
          body: "Dont forget to click on button.",
        });
      }
    });
  }
}
</script>

