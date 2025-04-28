<template>
  <div class="chat-content border border-light-bg-c rounded-[10px] px-4 py-3 bg-white shadow-md">

    <div
        class="transition-margin duration-400 ease-in-out z-30 relative"
    >
      <div class="bg-secondary">
        <div ref="messagesContainer"
             class="content lg:px-2 py-4 min-h-[290px] h-[calc(100vh-450px)] md:h-[calc(100vh-340px)] lg:h-[calc(100vh-300px)] relative overflow-y-auto">

          <div class="message-wrapper relative">
            <div class="message-item mb-6"
                 :class="{ 'last:mb-6': isTyping, 'last:mb-1': !isTyping }"
                 v-for="message in messages" :key="message.id">

              <div class="message-header flex gap-2 items-center mb-[6px]"
                   :class="{'justify-end': authUser.pk === message.sender.id}">
                <span class="text-xs text-primary">{{ authUser.pk === message.sender.id ? 'You' : message.sender.username }}</span>

                <span class="text-xs text-sand">({{ dateFormat(message.created_at) }})</span>
              </div>

              <div class="message text-sm text-primary py-[10px] break-all px-4"
                   :class="{'bg-light-bg-c rounded-tl-md rounded-bl-md rounded-br-md': authUser.pk === message.sender.id,
                  'bg-light-bg-c rounded-tr-md rounded-bl-md rounded-br-md': authUser.pk !== message.sender.id}">
                {{ message.content }}
              </div>
            </div>

            <Typing v-if="isTyping"/>
          </div>
        </div>

        <ChatContentFooter
            v-model:text="text"
            @handleInput="handleInput"
            @sendMessage="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, nextTick, onMounted, watch, computed} from "vue";
import Typing from "./chat/Typing.vue";
import {useCookies} from "vue3-cookies";
import ChatContentFooter from "./chat/ChatContentFooter.vue";
import {catchErrors, pusherEventNames} from "../../utils/index.js";
import {useConversationsStore} from "../../store/conversations.js";
import {usePusher} from "../../composables/usePusher.js";

const {bindEvent, setPusherChannel} = usePusher()
const conversationsStore = useConversationsStore()
const {cookies} = useCookies();

//State
const text = ref('');
const isTyping = ref(false);
const messagesContainer = ref(null);
const messages = ref([])

const emit = defineEmits([''])
const props = defineProps({
  activeThread: {
    type: Object,
    required: false
  },
  activeUser: {
    type: Object,
    required: false
  }
})

watch(() => props.activeThread, (val) => {
  if (val.thread) {
    fetchConversationByThreadId(val.thread)
    setPusherChannel(props?.activeThread?.thread)
  }
})

watch(() => props.activeUser, () => {
  if (props.activeThread.thread) {
    fetchConversationByThreadId(props.activeThread.thread)
    setPusherChannel(props?.activeThread?.thread)
  }
})

const authUser = computed(() => {
  if (!cookies.get('task_focus_user')) return ''
  return cookies.get('task_focus_user')
})


const dateFormat = (date) => {
  const dateObj = new Date(date);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[dateObj.getDay()];

  let hours = dateObj.getHours();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  let minutes = dateObj.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${dayName} ${hours}:${minutes}${ampm}`;
}

const handleInput = () => {
  const inputArea = document.getElementById('input-area')

  if (inputArea) {
    text.value = inputArea.value;
  }
};

const sendMessage = async () => {
  const inputArea = document.getElementById('input-area')
  if (!inputArea.value) return

  try {

    const obj = {
      thread: props.activeThread.thread,
      content: inputArea.value,
      sender: authUser.value.pk,
    }

    await conversationsStore.sendMessage(obj)
    await fetchConversationByThreadId(props.activeThread.thread)
    inputArea.value = '';

    await nextTick();
    scrollToBottom()
  } catch (error) {
    console.error(error)
    console.log(error, 'error')
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth',
    });
  }
}

onMounted(() => {
  scrollToBottom()
})

const fetchConversationByThreadId = async (id) => {
  try {
    const resp = await conversationsStore.fetchConversationByThreadId({id})
    console.log(resp.data.results, 'resp')
    messages.value = resp.data.results.reverse()

    await nextTick();
    scrollToBottom()
  } catch (e) {
    catchErrors(e)
  }
}

const test = ()=>{
  console.log('111111111')
}

// console.log(props.activeThread?.id, 'activeThread?.id')
// Config Pusher
bindEvent(pusherEventNames.message_added, test)

</script>
