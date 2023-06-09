<template>
  <div class="content mt-4">
    <h2 class="font-bold text-xl block text-blueGray-700 mb-4">Comments</h2>

    <form v-if="!hideCreate" @submit="sendComment">

      <input
          v-if="!writeComment"
          @click="writeComment = true"
          class="text-white w-full sm:w-1/2 hover:bg-gray-100 text-sm px-6 py-3 rounded cursor-pointer shadow outline-none focus:outline-none ease-linear transition-all duration-150"
          placeholder="Write a comment..."
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
              @click="sendComment"
              class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              type="submit"
          >
            Send
          </button>
          <button
              @click="resetComment"
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

        <div v-if="showSearch" class="header flex flex-col md:flex-row items-baseline md:items-center justify-between mt-4 mb-4 gap-y-3">
          <div class="relative w-full md:w-2/4">
            <i class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-[12px] left-[8px]"/>
            <input
                v-model="filter.search.value"
                type="text"
                class="border-0 pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Search"
            />
          </div>
        </div>

    <div class="comments mt-3">
      <ul>
        <li v-for="comment in comments" :key="comment.id" class="mb-4">
          <div class="flex gap-x-2 items-start">
             <span class="font-medium mr-3 flex items-center gap-x-2">
              <i class="fas fa-user-circle text-blueGray-300 text-3xl"></i>
            </span>

            <div :class="{'w-full': editCommentsIds.includes(comment.id)}">
              <div class="mb-2">
                <div class="flex items-center mb-1">
                  <div class="flex items-center gap-x-1">
                    <b v-if="comment.author?.first_name || comment.author?.last_name" class="text-blueGray-600">{{
                        comment.author?.first_name
                      }} {{ comment.author?.last_name }}
                    </b>
                    <span class="text-sm text-blueGray-500 cursor-pointer underline" @click="reply(comment)">(@{{ comment.author?.username }})</span>
                  </div>

                  <span class="text-sm ml-2 text-blueGray-500">{{ convertDateTime(comment.created_at) }}</span>
                </div>

                <p class="text-sm text-blueGray-500">
                  <span v-if="props.taskId && route.name !== 'Task Detail'" class="block">Task link: <router-link
                      class="underline"
                      :to="`/dashboard/task/${props.taskId}`">{{
                      taskName
                    }}</router-link></span>
                  <span v-else-if="comment.task?.id && route.name !== 'Task Detail'" class="block">Task link: <router-link
                      class="underline"
                      :to="`/dashboard/task/${comment.task?.id}`">{{
                      comment.task.title
                    }}</router-link></span>

                  <span v-if="comment.task?.project?.id && !['Project Detail','Task Detail'].includes(route.name)" class="block">Project link: <router-link
                      class="underline"
                      :to="`/dashboard/project/${comment.task?.project?.id}`">{{
                      comment.task.project.title
                    }}</router-link></span>


                  <span v-if="props.projectId && route.name !== 'Project Detail'" class="block">Project link: <router-link
                      class="underline"
                      :to="`/dashboard/project/${props.projectId}`">{{
                      projectName
                    }}</router-link></span>

                  <span v-else-if="comment.project?.id && !['Project Detail','Comments'].includes(route.name)" class="block">Project link: <router-link
                      class="underline"
                      :to="`/dashboard/project/${comment.project?.id}`">{{
                      comment.project.title
                    }}222</router-link></span>
                </p>
              </div>

              <div class="bg-white rounded-[8px] shadow-lg">
                <v-md-editor v-if="editCommentsIds.includes(comment.id)" v-model="comment.content"
                             height="300px">
                </v-md-editor>

                <v-md-preview-html v-else
                                   :html="xss.process(VMdEditor.vMdParser.themeConfig.markdownParser.render(comment.content))"
                                   preview-class="vuepress-markdown-body"></v-md-preview-html>
              </div>

            <div class="flex gap-x-3 items-center mt-2">
              <template v-if="isAuthOwner(comment)">
                <div v-if="editCommentsIds.includes(comment.id)" class="flex gap-x-3">
                  <button
                      @click="updateComment(comment)"
                      class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="button"
                  >
                    Update
                  </button>
                  <button
                      @click="resetEditComment(comment)"
                      class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="button"
                  >
                    Reset
                  </button>
                </div>
                <span class="underline text-blueGray-500 text-sm cursor-pointer"
                      v-else
                      @click="editComment(comment)">Edit</span>
              </template>

              <span class="underline text-blueGray-500 text-sm cursor-pointer"
                    @click="reply(comment)">Reply</span>
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
import {onMounted, onUnmounted, ref} from "vue";
import {catchErrors} from "../../utils";
import {convertDateTime} from "../../utils";
import {useRoute, useRouter} from "vue-router";
import {usePaginate} from "../../composables/usePaginate";
import {useFilter} from "../../composables/useFilter";
import {useCommentsStore} from "../../store/comments";
import {useToast} from "vue-toastification";
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import VMdEditor, {xss} from '@kangc/v-md-editor';
import {useCookies} from "vue3-cookies";
import config from '../../config'
import {watch} from "vue";
import {useAttachmentsStore} from "../../store/attachments";


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
  showSearch: {
    type: Boolean,
    default: false
  },
})

// ValidationRules
const rules = {
  message: {required},
}

const commentsStore = useCommentsStore()
const attachmentsStore = useAttachmentsStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const {cookies} = useCookies();

const loading = ref(false)
let writeComment = ref(false)
const domain = ref(null)
const message = ref('')
const comments = ref([])
const editCommentsIds = ref([])
let timer = null

const v$ = useVuelidate(rules, {message})


watch(editCommentsIds, (val) => {
  if (val.length) stopTimer()
  else startTimer()
})

// Methods
const reply = (comment)=>{
  writeComment.value = true
  message.value = `@${comment.author.username} `

  const textarea = document.getElementsByTagName('textarea')
  if (textarea) textarea[0].focus()
}


const editComment = (comment) => {
  editCommentsIds.value = [...editCommentsIds.value, comment.id]
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
   if (resp.data.attachments[0].file_path){
     insertImage({
       url: resp.data.attachments[0].file_path,
     });
   }
 }catch (e) {
   catchErrors(e)
 }
}

const resetEditComment = (comment) => {
  fetchComments()
  editCommentsIds.value = editCommentsIds.value.filter((item) => item !== comment.id)
}

const updateComment = async (comment) => {
  try {
    const data = {
      id: comment.id,
      content: comment.content,
      project: props.projectId,
      task: props.taskId,
    }
    await commentsStore.updateComment(data)
    await toast.success("Comment updated");
  } catch (e) {
    catchErrors(e)
  } finally {
    resetEditComment(comment)
  }
}

const isAuthOwner = (comment) => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')
  const commentOwnerId = comment.author.id

  return user.pk === commentOwnerId
}

const fetchComments = async (label = null) => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      search: filter.search.value,
      id: props.projectId || props.taskId,
      type: props.isTask ? 'task' : 'project',
      sorting: label
    }

    const resp = await commentsStore.fetchComments(options)
    comments.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const resetComment = () => {
  writeComment.value = false
  message.value = ''
  v$.value.$reset()
}

const toLink = (type) => {
  if (type === 'task') return router.push(`/dashboard/task/${props.taskId}`)
  else return router.push(`/dashboard/project/${props.projectId}`)
}

const sendComment = async (e) => {
  e.preventDefault()

  try {
    const isValid = await v$.value.$validate();
    if (isValid) {
      const data = {
        content: message.value,
        project: props.projectId,
        task: props.taskId,
      }
      await commentsStore.createComments(data)
      await toast.success("Comment created");
      message.value = ''
      v$.value.$reset()
      await fetchComments()
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    writeComment.value = false
  }
}

const sorting = (label) => {
  fetchComments(label)
}

const startTimer = () => {
  timer = setInterval(() => {
    fetchComments()
  }, 15000)
}

const stopTimer = () => {
  clearInterval(timer)
  timer = null
}

onMounted(() => {
  if (route.name === 'Task Detail') startTimer()

  const host = window.location.host
  domain.value = host.replace('www.', '')
})

onUnmounted(() => {
  stopTimer()
});

// Composables
const options = {
  pageSize: config.COMMENTS_PAGE_SIZE
}
const paginate = usePaginate(fetchComments, options)
const filter = useFilter(comments, fetchComments)

// Run Functions
fetchComments()

</script>
