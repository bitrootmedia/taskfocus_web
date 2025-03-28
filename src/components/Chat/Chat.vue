<template>
  <div class="chat-content border border-light-bg-c rounded-[10px] px-4 py-3 bg-white shadow-md">

    <div
        class="transition-margin duration-400 ease-in-out z-30 relative"
    >
      <div class="bg-secondary">
        <div ref="messagesContainer" class="content lg:px-2 py-4 min-h-[290px] h-[calc(100vh-450px)] md:h-[calc(100vh-340px)] lg:h-[calc(100vh-300px)] relative overflow-y-auto">

          <div class="message-wrapper relative">
            <div class="message-item mb-6"
                 :class="{ 'last:mb-6': isTyping, 'last:mb-1': !isTyping }"
                 v-for="message in messages" :key="message.id">

              <div class="message-header flex gap-2 items-center mb-[6px]"
              :class="{'justify-end': message.is_mine}">
                <span class="text-xs text-primary">{{ message.is_mine ? 'You' : message.user}}</span>

                <span class="text-xs text-sand">({{ dateFormat(message.created_at) }})</span>
              </div>

              <div class="message text-sm text-primary py-[10px] break-all px-4"
                   :class="{'bg-light-bg-c rounded-tl-md rounded-bl-md rounded-br-md': message.is_mine,
                  'bg-light-bg-c rounded-tr-md rounded-bl-md rounded-br-md': !message.is_mine}">
                {{ message.text }}
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
import {ref, nextTick, onMounted} from "vue";
import Typing from "./chat/Typing.vue";
import ChatContentFooter from "./chat/ChatContentFooter.vue";

//State
const text = ref('');
const isTyping = ref(false);
const messagesContainer = ref(null);
const messages = ref([
  {
    id: 1,
    text: 'Do you work with vegan wines?',
    is_mine: true,
    created_at: '2025-03-24 04:07:31'
  },
  {
    id: 2,
    text: 'Yes! Palm Bay offers several vegan wines. Here are some of our best selections:',
    is_mine: false,
    user: 'Mike',
    created_at: ' 2025-03-24 04:07:50'
  },
  {
    id: 3,
    text: 'Yes! Palm Bay offers several vegan wines. Here are some of our best selections:',
    is_mine: true,
    created_at: ' 2025-03-24 04:08:20'
  },
  // {
  //   id: 4,
  //   text: 'Several wineries in our portfolio use renewable energy, such as solar and wind power, to minimize their carbon footprint. For example, our partner, Cavit, operates fully on solar energy. Would you like details on how sustainability influences wine quality?',
  //   is_mine: false,
  //   user: 'Ann',
  //   created_at: ' 2025-03-24 04:08:50'
  // },
  // {
  //   id: 5,
  //   text: 'How does sustainability improve wine quality?',
  //   is_mine: true,
  //   created_at: ' 2025-03-24 04:09:40'
  // },
  // {
  //   id: 6,
  //   text: 'Sustainable viticulture often results in healthier vineyards, which can lead to better grape quality and enhanced flavour in wines. Sustainable practices like minimal chemical use and healthier soil can create wines with greater complexity and character.',
  //   is_mine: false,
  //   user: 'Mike',
  //   created_at: ' 2025-03-24 04:10:15'
  // }
])



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
      id: messages.value.length + 2,
      is_mine: true,
      text: inputArea.value,
      created_at: '2025-03-24 04:07:31'
    }

    messages.value.push(obj)
    inputArea.value = '';
    isTyping.value = true

    await nextTick();
    scrollToBottom()
    tempDelay()
  } catch (error) {
    console.error(error)
    console.log(error, 'error')
  }
}

const tempDelay = () => {
  //TODO in future we will remove this code, only for test
  setTimeout(async () => {
    const obj = {
      id: messages.value.length + 2,
      is_mine: false,
      user: 'Mike',
      text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered',
      created_at: '2025-03-24 04:07:31'
    }
    messages.value.push(obj)
    isTyping.value = false

    await nextTick();
    scrollToBottom()
  }, 1000)
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

</script>
