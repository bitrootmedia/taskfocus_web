<script setup>

import Button from "../../Button/Button.vue";

const emit = defineEmits(['handleInput', 'sendMessage'])
defineProps({
  text: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 48
  },
})

const sendMessage = async () => {
  emit('sendMessage')
}
</script>

<template>
  <div class="footer min-h-[112px] p-4 border-t border-sand">
    <div class="flex justify-between gap-2">
      <div class="w-full flex">
          <textarea
              id="input-area"
              @input="emit('handleInput',)"
              placeholder="Message here..."
              class="bg-secondary outline-0 w-full min-h-[25px] max-h-[100px] resize-none overflow-y-auto"
          ></textarea>
      </div>
    </div>


    <div class="flex justify-end">
      <div
          class="bg-lightBlue min-w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-primary transition-all">
        <Button
            @on-click="sendMessage"
            label="Send"
            size="medium"
            version="green"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
