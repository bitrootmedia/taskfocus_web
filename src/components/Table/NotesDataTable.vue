<template>
  <div class="content mt-4">
    <h2 class="font-bold text-xl block text-blueGray-700 mb-4">My Notes</h2>

    <form v-if="!hideCreate" @submit="sendNote">

      <input
          v-if="!writeNote"
          @click="writeNote = true"
          class="text-white w-full sm:w-1/2 hover:bg-gray-100 text-sm px-6 py-3 rounded cursor-pointer shadow outline-none focus:outline-none ease-linear transition-all duration-150"
          placeholder="Write a note..."
      />


      <div class="w-full items-center gap-x-6" v-else>
        <div class="w-full sm:w-1/2">
          <v-md-editor
              autofocus
              :right-toolbar="'toc sync-scroll fullscreen'"
              v-model="message"
              :disabled-menus="[]"
              @upload-image="handleUploadImage">
            <h1>Hello</h1>
          </v-md-editor>
        </div>


        <div class="mt-3 flex gap-x-2">
          <button
              @click="sendNote"
              :disabled="btnLoad"
              class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              type="submit"
          >
            Send
          </button>
          <button
              @click="resetNote"
              class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              type="submit"
          >
            Close
          </button>
        </div>
      </div>
    </form>
    <span class="text-xs font-medium text-red-600" v-if="v$.message.$error"> {{
        v$.message.$errors[0].$message
      }} </span>

    <div class="comments mt-3">
      <Loader v-if="loading"/>

      <ul v-else>
        <li v-for="note in notes" :key="note.id" class="mb-4">
          <div class="flex gap-x-2 items-start">
            <div class="w-full lg:w-1/2 rounded-[8px] px-4 py-4 bg-blueGray-600 border border-blueGray-700">
              <div class="mb-2">
                <div class="flex items-center mb-1">
                  <span class="text-sm ml-2 text-white font-semibold">{{ convertDateTime(note.updated_at) }}</span>
                </div>
              </div>

              <div class="bg-white rounded-[8px] shadow-lg">
                <v-md-editor v-if="editNotesIds.includes(note.id)" v-model="note.note"
                             height="300px">
                </v-md-editor>

                <v-md-preview v-else :text="note.note"></v-md-preview>
              </div>

              <div class="flex gap-x-3 items-center mt-2">
                  <div v-if="editNotesIds.includes(note.id)" class="flex gap-x-3">
                    <button
                        @click="updateNotes(note)"
                        :disabled="btnLoad"
                        class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                      Update
                    </button>
                    <button
                        @click="resetEditNote(note)"
                        class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                      Reset
                    </button>
                  </div>
                  <div v-else class="flex items-center gap-x-2">
                    <span class="underline text-white text-sm cursor-pointer"
                          @click="editNote(note)">Edit</span>
                    <span class="underline text-white text-sm cursor-pointer"
                          @click="deleteNote(note)">Delete</span>
                  </div>
              </div>

            </div>
          </div>
        </li>
      </ul>
    </div>

    <Pagination
        v-if="paginate.pagination.value.total > 1 && !loading"
        :position="'right'"
        :pagination="paginate.pagination.value"
        v-model:query="paginate.query.value"
    />
  </div>
</template>

<script setup>
import Pagination from './../Pagination/Pagination.vue'
import {onMounted, ref} from "vue";
import {catchErrors} from "../../utils";
import {convertDateTime} from "../../utils";
import {useRoute, useRouter} from "vue-router";
import {usePaginate} from "../../composables/usePaginate";
import {useFilter} from "../../composables/useFilter";
import {useToast} from "vue-toastification";
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import VMdEditor from '@kangc/v-md-editor';
import {useCookies} from "vue3-cookies";
import config from '../../config'
import {useAttachmentsStore} from "../../store/attachments";
import Loader from './../Loader/Loader.vue'
import {useNotesStore} from "../../store/notes";

const props = defineProps({
  projectId: {
    type: String,
    default: ''
  },
  projectName: {
    type: String,
    default: ''
  },
  taskId: {
    type: String,
    default: ''
  },
  taskName: {
    type: String,
    default: ''
  },
  hideCreate: {
    type: Boolean,
    default: false
  },
  isTask: {
    type: Boolean,
    default: false
  },
})

// ValidationRules
const rules = {
  message: {required},
}

const notesStore = useNotesStore()
const attachmentsStore = useAttachmentsStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const {cookies} = useCookies();

const btnLoad = ref(false)
const loading = ref(false)
let writeNote = ref(false)
const domain = ref(null)
const message = ref('')
const notes = ref([])
const editNotesIds = ref([])
let timer = null

const v$ = useVuelidate(rules, {message})


// Methods
const editNote = (comment) => {
  editNotesIds.value = [...editNotesIds.value, comment.id]
}

const handleUploadImage = async (event, insertImage, files) => {
  try {
    const file = files[0]
    const formData = new FormData();
    formData.append(file.name, file);

    if (props.projectId) {
      formData.append('project_id', props.projectId);
    }
    if (props.taskId) {
      formData.append('task_id', props.taskId);
    }

    const resp = await attachmentsStore.uploadAttachments(formData)
    if (resp.data.attachments[0].file_path) {
      insertImage({
        url: resp.data.attachments[0].file_path,
      });
    }
  } catch (e) {
    catchErrors(e)
  }
}

const resetEditNote = (note) => {
  fetchNotes()
  editNotesIds.value = editNotesIds.value.filter((item) => item !== note.id)
}

const updateNotes = async (note) => {
  try {
    btnLoad.value = true
    const data = {
      id: note.id,
      note: note.note,
    }
    await notesStore.updateNote(data)
    await toast.success("Note updated");
    await fetchNotes()
  } catch (e) {
    catchErrors(e)
  } finally {
    resetEditNote(note)
  }
}

const deleteNote = async (note) => {
  try {
    const data = {
      id: note.id,
    }
    await notesStore.deleteNote(data)
    await toast.success("Note deleted");
    await fetchNotes()
  } catch (e) {
    catchErrors(e)
  }
}

const fetchNotes = async (label = null) => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      search: filter.search.value,
      id: props.taskId,
      sorting: label
    }

    const resp = await notesStore.fetchNotes(options)
    notes.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
    btnLoad.value = false
  }
}

const resetNote = () => {
  writeNote.value = false
  message.value = ''
  v$.value.$reset()
}

const toLink = (type) => {
  if (type === 'task') return router.push(`/dashboard/task/${props.taskId}`)
  else return router.push(`/dashboard/project/${props.projectId}`)
}

const sendNote = async (e) => {
  e.preventDefault()

  try {
    const isValid = await v$.value.$validate();
    if (isValid) {
      btnLoad.value = true
      const data = {
        note: message.value,
        task: props.taskId,
      }

      await notesStore.createNote(data)
      await toast.success("Note created");
      message.value = ''
      v$.value.$reset()
      await fetchNotes()
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    writeNote.value = false
    btnLoad.value = false
  }
}

const sorting = (label) => {
  fetchNotes(label)
}

onMounted(() => {
  const host = window.location.host
  domain.value = host.replace('www.', '')
})

// Composables
const options = {
  pageSize: config.NOTES
}
const paginate = usePaginate(fetchNotes, options)
const filter = useFilter(notes, fetchNotes)

// Run Functions
fetchNotes()

</script>
