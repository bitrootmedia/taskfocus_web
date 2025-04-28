<template>
  <div class="users-list w-1/2 border border-light-bg-c rounded-[10px] px-4 py-3 bg-white shadow-md">
    <h2 class="text-center font-semibold text-2xl text-black-c block mb-1">Users</h2>

    <input
        type="text"
        class="px-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        placeholder="Users Search..."
    />

    <ul v-if="users.length" class="mt-8">
      <li v-for="item in users"
          :key="item.user.id"
          class="flex flex-wrap sm:flex-nowrap gap-x-1 items-center justify-between sm:whitespace-nowrap mb-2 last:mb-0 px-3 py-1.5 cursor-pointer hover:bg-light-bg-c transition-all text-light-c"
          :class="{'bg-orange-c': activeUser?.id === item.user.id}"
          @click="emit('update:activeUser', item.user)"
      >
        <div>
          <span class="text-md font-semibold">{{ item.user.username }}</span>

          <span v-if="item.unread_count" class="text-xs font-medium">({{item.unread_count}})</span>
        </div>

        <span v-if="item.last_unread_message_date" class="text-xs font-medium">{{convertTimeAgo(item.last_unread_message_date)}}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {catchErrors} from "../../utils/index.js";
import {convertTimeAgo} from "../../utils";
import {useConversationsStore} from "../../store/conversations.js";


const emit = defineEmits([''])
const props = defineProps({
  activeUser: {
    type: Object,
    required: false
  }
})
//Store
const conversationsStore = useConversationsStore()

//State
const users = ref([])


//Methods
const fetchUsers = async (search) => {
  try {
    const resp = await conversationsStore.fetchAllUsers(search)
    users.value = resp.data
    console.log(users.value,'users.value')
  } catch (e) {
    catchErrors(e)
  }
}

//Run functions
fetchUsers()
</script>
