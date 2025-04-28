<template>
  <div class="main-container pt-6">

    <div class="chat-wrapper flex gap-10">
      <div class="left-side w-1/2 hidden lg:block space-y-4">
        <GlobalSearch v-model:globalSearch="globalSearch"/>

        <div class="flex gap-4 h-[calc(100vh-107px)]">
          <UsersList v-model:activeUser="activeUser"/>

          <ThreadsList v-model:activeThread="activeThread" :activeUser="activeUser"/>
        </div>
      </div>

      <div v-if="showMobileMenu" class="left-side fixed z-50 bg-amber-100 left-0 md:left-[220px] top-[89px] sm:top-[108px] p-4 block lg:hidden space-y-4 transition-all"
      :class="{'w-[370px] sm:w-[500px] opacity-1': showMobileMenu, 'w-[0px] opacity-0': !showMobileMenu}">
        <div class="flex items-center justify-between gap-3.5">
          <GlobalSearch v-model:globalSearch="globalSearch"/>

          <CloseBlackIcon class="cursor-pointer" @click="showMobileMenu = false"/>
        </div>

        <div class="flex gap-2 sm:gap-4 h-[calc(100vh-170px)] sm:h-[calc(100vh-190px)]">
          <UsersList v-model:activeUser="activeUser"/>

          <ThreadsList v-model:activeThread="activeThread" :activeUser="activeUser"/>
        </div>
      </div>

      <div class="right-side w-full lg:w-1/2">
        <button
            class="mb-4 cursor-pointer text-black-c lg:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            @click="showMobileMenu = true"
        >
          <i class="fas fa-bars text-black-c"></i>
        </button>

        <ChatInfo />

        <Chat :activeUser="activeUser" :activeThread="activeThread"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import CloseBlackIcon from "../../components/Svg/CloseBlackIcon.vue";
import Button from "../../components/Button/Button.vue";
import GlobalSearch from "../../components/Chat/GlobalSearch.vue";
import UsersList from "../../components/Chat/UsersList.vue";
import ThreadsList from "../../components/Chat/ThreadsList.vue";
import ChatInfo from "../../components/Chat/ChatInfo.vue";
import Chat from "../../components/Chat/Chat.vue";

const globalSearch = ref('')
const activeUser = ref(null)
const activeThread = ref(null)

const showMobileMenu = ref(false)

</script>
