<template>
  <div class="main-container pt-6">

    <div class="chat-wrapper flex gap-10">
      <div class="left-side w-1/2 space-y-4">
        <GlobalSearch v-model:globalSearch="globalSearch"/>

        <div class="flex gap-4">
          <UsersList v-model:activeUser="activeUser"/>

          <ThreadsList v-model:activeThread="activeThread"/>
        </div>
      </div>

      <div class="right-side w-1/2 space-y-4">
        <ChatInfo />

        <Chat />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import GlobalSearch from "../../components/Chat/GlobalSearch.vue";
import UsersList from "../../components/Chat/UsersList.vue";
import ThreadsList from "../../components/Chat/ThreadsList.vue";
import ChatInfo from "../../components/Chat/ChatInfo.vue";
import Chat from "../../components/Chat/Chat.vue";

const globalSearch = ref('')
const activeUser = ref(null)
const activeThread = ref(null)

</script>

<style scoped>

</style>
