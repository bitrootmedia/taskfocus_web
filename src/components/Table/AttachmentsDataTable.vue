<template>
  <div class="content mt-4" v-if="attachments.length">

    <div class="header flex items-center gap-x-6 mb-3">
      <h2 class="font-semibold text-lg text-black-c block">Attachments</h2>
    </div>

      <div class="cursor-pointer w-full md:w-[250px] mb-4 relative" v-if="showCreateBtn && !hideCreate">
        <div class="flex items-center gap-x-2 px-3 py-[6px] bg-white rounded-[8px] cursor-pointer w-[250px]">
          <PaperClipIcon/>
          <span class="text-sm text-black">Add attachments</span>
        </div>

        <div class="absolute w-[250px] h-9 top-0">
          <Dropzone
              :key="key"
              :maxFiles="Number(10000000000)"
              :maxFileSize="200000000"
              ref="dropZoneRef"
              :uploadOnDrop="true"
              :multipleUpload="true"
              @sending="saveFiles"
              :parallelUpload="6"
          />
        </div>
      </div>

    <DataTable :headers="headers" @sorting="sorting" v-if="!loading && attachments.length">
      <template v-slot:tableBody>
        <tr v-if="loading">
          <td :colspan="headers.length">
            <div class="flex justify-center py-1 text-blueGray-500 font-medium">
              <Loader/>
            </div>
          </td>
        </tr>

        <template v-else>
          <tr v-if="!attachments.length">
            <td :colspan="headers.length">
              <p class="flex text-center px-4 justify-center py-8 text-black-c font-medium">
                No data found
              </p>
            </td>
          </tr>

          <draggable
              v-else
              :disabled="isDragDisabled"
              tag="tbody"
              v-model="attachments"
              item-key="id">
            <template #item="{element}">
              <tr :class="{'cursor-move': !isDragDisabled}">
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    width="15%">
                  <span>{{ convertDateTime(element.created_at) }}</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    width="15%">
                  <span v-if="element.owner?.first_name || element.owner?.last_name">{{
                      element.owner?.first_name
                    }} {{ element.owner?.last_name }}</span>
                  <span v-else>{{ element.owner?.username }}</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" width="15%"
                    v-if="hideCreate">
                   <span v-if="element.project?.title" class="cursor-pointer" @click="toLink(element.project,true)">{{
                       element.project.title
                     }}</span>
                  <span v-else>-</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    v-if="!isTask" width="15%">
                  <span v-if="element.task" class="cursor-pointer" @click="toLink(element.task)">{{
                      element.task.title
                    }}</span>
                  <span v-else>-</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    v-if="isTask" width="15%">
                  <span v-if="isTask && element.project" class="cursor-pointer"
                        @click="toLink(element.project,true)">{{ element.project.title }}</span>
                  <span v-else>-</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    width="15%">
                  <span class="truncate block w-[150px] md:w-[300px]">{{ element.title }}</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    width="20%">
                    <span class="truncate block w-[100px]">
                      <img v-if="element.thumbnail_path" :src="element.thumbnail_path" alt="thumbnail"
                           class="cursor-pointer"
                           @click="openModal(element)">
                      <template v-else>-</template>
                    </span>
                </td>
                <td class="border-t-0 px-3 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 "
                    width="15%">
                  <div class="flex gap-x-2 items-center">
                    <Button
                        @on-click="downloadTemplate(element.file_path)"
                        :label="'Download'"
                        version="white"
                        size="medium"
                    >
                      <template #left-icon>
                        <DownloadIcon />
                      </template>

                    </Button>
                    <Button
                        v-if="isMediaOwner(element)"
                        @on-click="openDeleteModal(element.id)"
                        :label="'Delete'"
                        version="white"
                        size="medium"
                    />
                  </div>
                </td>
              </tr>
            </template>
          </draggable>
        </template>

        <ConfirmDeleteModal
            :show-modal="confirmModal"
            :active-id="activeId"
            @close="confirmModal = false"
            @update="updateDeleteMedia"
        />


      </template>
    </DataTable>

    <Pagination
        v-if="paginate.pagination.value.total > 1 && !loading"
        :pagination="paginate.pagination.value"
        v-model:query="paginate.query.value"
    />

    <AttachmentMediaModal
        :show-modal="popUp"
        :active="activeSrc"
        :owner-of-media="ownerOfMedia"
        @close="popUp = false"
        @delete="deleteMedia"
    />
  </div>
</template>

<script setup>
import {useCookies} from "vue3-cookies";
import Loader from './../Loader/Loader.vue'
import DataTable from "./DataTable.vue"
import Pagination from './../Pagination/Pagination.vue'
import {computed, ref, watch} from "vue";
import {catchErrors, convertDateTime} from "../../utils";
import draggable from 'vuedraggable'
import {useRouter} from "vue-router";
import {usePaginate} from "../../composables/usePaginate";
import {useFilter} from "../../composables/useFilter";
import Dropzone from 'dropzone-vue';
import 'dropzone-vue/dist/dropzone-vue.common.css';
import {useToast} from "vue-toastification";
import {useAttachmentsStore} from "../../store/attachments";
import AttachmentMediaModal from "../Modals/AttachmentMediaModal.vue";
import ConfirmDeleteModal from './../Modals/ConfirmDeleteModal.vue'
import PaperClipIcon from "../Svg/PaperClipIcon.vue";
import DownloadIcon from "../Svg/DownloadIcon.vue";
import Button from '../Button/Button.vue'


const props = defineProps({
  projectId: {
    type: String,
    default: ''
  },
  taskId: {
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
  showCreateBtn: {
    type: Boolean,
    default: true
  },
})

const attachmentsStore = useAttachmentsStore()
const toast = useToast()
const router = useRouter()
const {cookies} = useCookies();

const isDragDisabled = true
const loading = ref(false)
const confirmModal = ref(false)
const activeId = ref(null)
const popUp = ref(false)
const activeSrc = ref({
  isAuth: false
})
const ownerOfMedia = ref({})
const key = ref(0)
const attachments = ref([])
const files = ref([])

// Computed
const headers = computed(() => {
  let list = [
    {id: 1, label: 'Created at', sorting: true, sortLabel: 'created_at'},
    {id: 2, label: 'User', sorting: true, sortLabel: 'owner'},
    {id: 3, label: 'Task', sorting: true, sortLabel: 'task'},
    {id: 4, label: 'Title', sorting: true, sortLabel: 'title'},
    {id: 5, label: 'Thumbnail', sorting: false},
    {id: 6, label: 'Action', sorting: false},
  ]

  const projectObj = {id: 7, label: 'Project', sorting: true, sortLabel: 'project'}

  if (props.isTask) list.splice(2, 1, projectObj)
  else if (props.hideCreate) list.splice(2, 0, projectObj)

  return list
})

watch(popUp, (val) => {
  const body = document.getElementsByTagName('body')[0]
  if (val) body.style.overflow = 'hidden'

  else body.style.overflow = 'auto'
})


// Methods
const openDeleteModal = (id) => {
  confirmModal.value = true
  activeId.value = id
}

const downloadTemplate = async (url, title) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.download = title;
  link.click();
}

const isMediaOwner = (media)=>{
  const user = cookies.get('task_focus_user')
  return user.pk === media?.owner?.id
}

const updateDeleteMedia = async(id)=>{
  try{
    await deleteMedia(id)
  }catch (e) {}
  finally {
    activeId.value = null
    confirmModal.value = false
  }
}

const openModal = (element) => {
  popUp.value = true

  const user = cookies.get('task_focus_user')
  if (user.pk === element.owner.id) {
    ownerOfMedia.value = {
      isAuth: true,
      attachmentId: element.id
    }
  }

  activeSrc.value = {
    src: element.thumbnail_path,
    path: element.file_path,
  }
}

const deleteMedia = async (id) => {
  try {
    await attachmentsStore.deleteAttachments({id})
    popUp.value = false
    toast.success("Attachment deleted");
    fetchAttachments()
  } catch (e) {
    catchErrors()
  }
}

async function toDataURL(url) {
  const blob = await fetch(url).then(res => res.blob());
  return URL.createObjectURL(blob);
}

const saveFiles = async (e) => {
  try {
    const formData = new FormData();
    for (var i = 0; i < e.length; i++) {
      formData.append(e[i].name, e[i]);
    }

    if (props.projectId) {
      formData.append('project_id', props.projectId);
    }
    if (props.taskId) {
      formData.append('task_id', props.taskId);
    }

    const resp = await attachmentsStore.uploadAttachments(formData)
    if (resp.data.attachments.length) {
      key.value += 1
      toast.success("Attachment uploaded");
      fetchAttachments()
    }

  } catch (e) {
    catchErrors(e)
  }
}

const fetchAttachments = async (label = null) => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      id: props.projectId || props.taskId,
      type: props.isTask ? 'task' : 'project',
      sorting: label
    }
    const resp = await attachmentsStore.fetchAttachments(options)
    attachments.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const sorting = (label) => {
  fetchAttachments(label)
}

const toLink = (item, isProject = false) => {
  const type = isProject ? 'project' : 'task'
  router.push(`/dashboard/${type}/${item.id}`)
}

// Composables
const paginate = usePaginate(fetchAttachments, null)
const filter = useFilter(attachments, fetchAttachments)

// Run Functions
fetchAttachments()

</script>
