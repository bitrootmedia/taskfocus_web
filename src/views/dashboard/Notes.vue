<template>
  <div class="main-container">
    <div class="content mt-6 mb-6">
      <Loader v-if="loading"/>

      <div v-else>
        <div class="header flex md:hidden justify-between md:justify-end mb-4">
          <Button
              class="max-w-[200px] justify-center"
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

        <span class="w-full h-[1px] bg-[#E5E7E7] block md:hidden mb-4"></span>

        <div v-if="notes.length" class="flex">

          <div
              v-if="showSidebar"
              id="scrollSection"
              @scroll="scrollHandler"
              class="mobile-version fixed left-0 bg-white sidebar notifications-wrapper min-w-[220px] max-w-[220px] overflow-y-auto border-r border-[#E5E7E7] h-[calc(100vh-165px)]">
            <ul class="">
              <li v-for="note in notes" :key="note.id"
                  @click="selectNote(note, true)"
                  :class="{'bg-light-bg-c': active.id === note.id}"
                  class="px-4 py-4 border-b border-[#E5E7E7] cursor-pointer hover:bg-gray-200 transition">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-sm text-gray-400 block">{{ convertDateTime(note.created_at) }}</span>
                  <TrashIcon class="cursor-pointer text-red bg-red" @click.stop="openModal(note)"></TrashIcon>
                </div>

                <h5 class="font-bold text-2xl line-clamp-1 truncate mb-1">{{ note.title }}</h5>
                <p class="text-sm text-gray-400 text-line-2 ">{{ note.content }}</p>
              </li>
            </ul>
          </div>


          <div>
            <Button
                class="hidden md:flex max-w-[200px] justify-center mb-2"
                label="Add New Note"
                size="big"
                version="green"
                @on-click="addNote"
            />

            <div
                id="scrollSection"
                @scroll="scrollHandler"
                class="hidden md:block sidebar notifications-wrapper min-w-[300px] max-w-[300px] overflow-y-auto border-r border-[#E5E7E7] h-[calc(100vh-155px)]">
              <ul class="">
                <li v-for="note in notes" :key="note.id"
                    @click="selectNote(note)"
                    :class="{'bg-light-bg-c': active.id === note.id}"
                    class="px-4 py-4 border-b border-[#E5E7E7] cursor-pointer hover:bg-gray-200 transition">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-sm text-gray-400 block">{{ convertDateTime(note.updated_at) }}</span>
                    <TrashIcon class="cursor-pointer text-red bg-red" @click.stop="openModal(note)"></TrashIcon>
                  </div>

                  <h5 class="font-bold text-2xl line-clamp-1 truncate mb-1">{{ note.title }}</h5>
                  <p class="text-sm text-gray-400 text-line-2 ">{{ note.content }}</p>
                </li>
              </ul>

              <Loader v-if="infiniteLoading"/>
            </div>
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
          <p class="flex text-center px-4 justify-center pt-8 pb-4 text-black-c text-3xl font-medium">
            No data found
          </p>
          <div class="text-center">
            <Button
                class="max-w-[200px] justify-center"
                label="Add New Note"
                size="big"
                version="green"
                @on-click="addNote"
            />
          </div>
        </div>
      </div>
    </div>

    <NoteConfirmModal
        :show-modal="showModal"
        @close="showModal = false"
        @update="deleteNote"
    />

  </div>

</template>

<script setup>
import {ref} from "vue";
import {catchErrors, convertDateTime} from "../../utils/index.js";
import Loader from "../../components/Loader/Loader.vue";
import NoteConfirmModal from "../../components/Modals/NoteConfirmModal.vue";
import {useNotesStore} from "../../store/notes.js";
import Button from "../../components/Button/Button.vue";
import TrashIcon from "../../components/Svg/TrashIcon.vue";
import {useToast} from "vue-toastification";

//Store
const toast = useToast()
const notesStore = useNotesStore()


//State
const currentDelete = ref(null)
const showModal = ref(false)
const active = ref(null)
const loading = ref(true);
const infiniteLoading = ref(false);
const total = ref(0);
const showSidebar = ref(false);
const query = ref('page=1&page_size=8');
const notes = ref([])


//Methods
const selectNote = (note, isMobile) => {
  active.value = JSON.parse(JSON.stringify(note))
  if (isMobile) showSidebar.value = false
}
const resetData = () => {
  const findItem = notes.value.find((item) => item.id === active.value.id)
  if (findItem) active.value = JSON.parse(JSON.stringify(findItem))
}

const addNote = async () => {
  try {
    await notesStore.createAuthNote({content: 'Unnamed'})
    await fetchNotes(true)
    toast.success("Successfully note added");
  } catch (e) {
    catchErrors(e)
  }
}

const openModal = (note) => {
  showModal.value = true
  currentDelete.value = note
}

const deleteNote = async () => {
  try {
    await notesStore.deleteAuthNote(currentDelete.value)
    await fetchNotes(true)
    currentDelete.value = null
    showModal.value = false
    toast.success("Successfully note deleted");
  } catch (e) {
    catchErrors(e)
  }
}

const updateNote = async () => {
  try {
    const resp = await notesStore.updateAuthNote(active.value)
    await fetchNotes(true)
    active.value = resp.data
    toast.success("Successfully note updated");

    const scrollSection = document.getElementById('scrollSection')
    scrollSection.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    catchErrors(e)
  }
}

const scrollHandler = () => {
  if (infiniteLoading.value || notes.value.length === total.value) return

  const scrollSection = document.getElementById('scrollSection')
  const offset = 40

  let bottomOfWindow = scrollSection.offsetHeight + scrollSection.scrollTop + offset > scrollSection.scrollHeight;
  if (bottomOfWindow) {
    infiniteLoading.value = true
    fetchNotes()
  }
}

const fetchNotes = async (needUpdate) => {
  try {
    const options = {
      query: needUpdate ? 'page=1&page_size=8' : query.value,
    }
    const resp = await notesStore.fetchAuthNotes(options)
    const sortedItems = resp.data.results.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    total.value = resp.data.count

    if (resp.data.next) {
      const splitItem = resp.data.next.split('?')
      query.value = splitItem[1]
    }

    notes.value = needUpdate ? sortedItems : [...notes.value, ...sortedItems]
    if (notes.value.length && needUpdate) active.value = JSON.parse(JSON.stringify(notes.value[0]))
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
    infiniteLoading.value = false
  }
}

// Run functions
fetchNotes(true)
</script>

<style scoped>

</style>
