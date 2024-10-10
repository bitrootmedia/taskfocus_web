<template>
  <div class="main-container">
    <div class="content mt-6 mb-6">
      <Loader v-if="loading"/>

      <div v-else>
        <div class="header flex justify-between md:justify-end mb-4">
          <Button
              class="block md:hidden max-w-[200px] justify-center"
              :label="showSidebar ? 'Hide List' : 'Show List'"
              size="big"
              version="green"
              @on-click="showSidebar = !showSidebar"
          />

          <Button
              class="max-w-[200px] justify-center"
              label="Add New Note"
              size="big"
              version="green"
              @on-click="addNote"
          />
        </div>

        <span class="w-full h-[1px] bg-[#E5E7E7] block mb-4"></span>

        <div v-if="notes.length" class="flex">
          <div
              v-if="showSidebar"
              class="mobile-version fixed left-0 bg-white sidebar notifications-wrapper min-w-[220px] max-w-[220px] overflow-y-auto border-r border-[#E5E7E7] h-[calc(100vh-165px)]">
            <ul class="">
              <li v-for="note in notes" :key="note.id"
                  @click="selectNote(note)"
                  :class="{'bg-light-bg-c': active.id === note.id}"
                  class="px-4 py-4 border-b border-[#E5E7E7] cursor-pointer hover:bg-gray-200 transition">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-sm text-gray-400 block">{{ convertDateTime(note.created_at) }}</span>
                  <TrashIcon class="cursor-pointer text-red bg-red" @click.stop="deleteNote(note)"></TrashIcon>
                </div>

                <h5 class="font-bold text-2xl line-clamp-1 truncate mb-1">{{ note.title }}</h5>
                <p class="text-sm text-gray-400 text-line-2 ">{{ note.content }}</p>
              </li>
            </ul>
          </div>

          <div
              class="hidden md:block sidebar notifications-wrapper min-w-[300px] max-w-[300px] overflow-y-auto border-r border-[#E5E7E7] h-[calc(100vh-180px)]">
            <ul class="">
              <li v-for="note in notes" :key="note.id"
                  @click="selectNote(note)"
                  :class="{'bg-light-bg-c': active.id === note.id}"
                  class="px-4 py-4 border-b border-[#E5E7E7] cursor-pointer hover:bg-gray-200 transition">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-sm text-gray-400 block">{{ convertDateTime(note.created_at) }}</span>
                  <TrashIcon class="cursor-pointer text-red bg-red" @click.stop="deleteNote(note)"></TrashIcon>
                </div>

                <h5 class="font-bold text-2xl line-clamp-1 truncate mb-1">{{ note.title }}</h5>
                <p class="text-sm text-gray-400 text-line-2 ">{{ note.content }}</p>
              </li>
            </ul>
          </div>

          <div class="content w-full">
            <div class="bg-white h-full p-4 md:p-8">
              <textarea rows="20" class="w-full px-8 py-4 border border-[#E5E7E7]" v-model="active.content"></textarea>

              <div class="flex gap-x-4 mt-2">
                <Button
                    @on-click="updateNote"
                    label="Save Changes"
                    size="medium"
                    version="yellow"
                />
                <Button
                    @on-click="resetData"
                    label="Discard Changes"
                    size="medium"
                    version="red"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <p class="flex text-center px-4 justify-center py-8 text-black-c text-3xl font-medium">
            No data found
          </p>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>

import {ref} from "vue";
import {catchErrors, convertDateTime} from "../../utils/index.js";
import Loader from "../../components/Loader/Loader.vue";
import {useNotesStore} from "../../store/notes.js";
import Button from "../../components/Button/Button.vue";
import TrashIcon from "../../components/Svg/TrashIcon.vue";
import {useToast} from "vue-toastification";

//Store
const toast = useToast()
const notesStore = useNotesStore()


//State
const active = ref(null)
const loading = ref(true);
const showSidebar = ref(false);
const notes = ref([])


//Methods
const selectNote = (note) => {
  active.value = JSON.parse(JSON.stringify(note))
}
const resetData = () => {
  const findItem = notes.value.find((item) => item.id === active.value.id)
  if (findItem) active.value = JSON.parse(JSON.stringify(findItem))
}

const addNote = async () => {
  try {
    await notesStore.createAuthNote({content: '.'})
    await fetchNotes(true)
    toast.success("Successfully note added");
  } catch (e) {
    catchErrors(e)
  }
}

const deleteNote = async (note) => {
  try {
    await notesStore.deleteAuthNote(note)
    await fetchNotes(true)
    toast.success("Successfully note deleted");
  } catch (e) {
    catchErrors(e)
  }
}

const updateNote = async () => {
  try {
    const resp =  await notesStore.updateAuthNote(active.value)
    await fetchNotes()
    active.value = resp.data
    toast.success("Successfully note updated");
  } catch (e) {
    catchErrors(e)
  }
}

const fetchNotes = async (needUpdate) => {
  try {
    const resp = await notesStore.fetchAuthNotes()
    notes.value = resp.data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (resp.data.results.length && needUpdate) active.value = JSON.parse(JSON.stringify(resp.data.results[0]))
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

// Run functions
fetchNotes(true)
</script>

<style scoped>

</style>
