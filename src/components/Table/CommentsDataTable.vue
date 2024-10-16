<template>
  <div class="content mt-4" v-if="comments.length || showBtnResult">
    <h2 class="font-semibold text-lg text-black-c block mb-3">Comments</h2>

    <ul class="flex flex-wrap gap-2" v-if="!showCreateBtn && showBtnResult">
      <li v-for="user in users" class="px-2 py-1 rounded-full bg-amber-300 flex items-center cursor-pointer"
          @click="selectUser(user.user)">
        <span class="text-xs">{{ user.user.username }}</span>
      </li>
    </ul>

    <form v-if="!hideCreate" @submit="sendComment($event)">
      <template v-if="showCreateBtn">
        <div v-if="!writeComment"
             class="flex items-center gap-x-2 px-3 py-[6px] bg-white rounded-[8px] cursor-pointer w-[250px]"
             @click="writeComment = true">

          <PlusIcon :size="20"/>
          <span class="text-sm text-black">Add comment</span>
        </div>

        <div class="w-full items-center gap-x-6" v-else>
          <ul class="flex flex-wrap gap-2 mb-1.5" >
            <li v-for="user in users" class="px-2 py-1 rounded-full bg-amber-300 flex items-center cursor-pointer"
                @click="selectUser(user.user)">
              <span class="text-xs">{{ user.user.username }}</span>
            </li>
          </ul>

          <div class="w-full">
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
            <Button
                @on-click="sendComment"
                :disabled="btnLoad"
                type="submit"
                label="Create"
                size="medium"
                version="yellow"
            />
            <Button
                @on-click="resetComment"
                type="submit"
                label="Close"
                size="medium"
                version="green"
            />
          </div>
        </div>
      </template>

      <template v-if="!showCreateBtn && showBtnResult">
        <div class="w-full items-center gap-x-6 mt-1.5">
          <div class="w-full">
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
            <Button
                @on-click="sendComment"
                :disabled="btnLoad"
                type="submit"
                label="Create"
                size="medium"
                version="yellow"
            />
            <Button
                @on-click="resetComment"
                type="submit"
                label="Close"
                size="medium"
                version="green"
            />
          </div>
        </div>
      </template>
    </form>
    <span class="text-xs font-medium text-red-600" v-if="v$.message.$error"> {{
        v$.message.$errors[0].$message
      }} </span>

    <div v-if="showSearch"
         class="header flex flex-col md:flex-row items-baseline md:items-center justify-between mt-4 mb-4 gap-y-3">
      <div class="relative w-full sm:w-[500px]">
        <Input placeholder="Search" v-model:value="filter.search.value" leftIcon/>
      </div>
    </div>

    <div class="comments mt-1.5">
      <ul>
        <li v-for="comment in comments" :key="comment.id" class="mb-5">
          <div class="">
            <div class="flex mb-2">
               <span class="bg-white mr-2 flex items-center px-[7px] py-[7px] rounded-full">
                  <UserIcon/>
               </span>

              <div class="flex items-center">
                <div class="flex items-center gap-x-1">
                   <span v-if="comment.author?.first_name || comment.author?.last_name"
                         class="text-black-c text-sm font-semibold">{{
                       comment.author?.first_name
                     }} {{ comment.author?.last_name }}
                   </span>
                  <span class="text-black-c text-sm font-semibold cursor-pointer"
                        @click="isAuthOwner(comment) ? null : reply(comment)">(@{{ comment.author?.username }})</span>
                </div>

                <span class="text-[11px] ml-2 text-light-c font-semibold">{{
                    convertDateTime(comment.created_at)
                  }}</span>
              </div>
            </div>

            <ul class="flex flex-wrap gap-2" v-if="editCommentsIds.includes(comment.id)">
              <li v-for="user in users" class="px-2 py-1 rounded-full bg-amber-300 flex items-center cursor-pointer"
                  @click="selectUser(user.user, comment)">
                <span class="text-xs">{{ user.user.username }}</span>
              </li>
            </ul>

            <div class="mb-2">
              <p class="text-[11px] text-black-c">
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

                <span v-if="comment.task?.project?.id && !['Project Detail','Task Detail'].includes(route.name)"
                      class="block">Project link: <router-link
                    class="underline"
                    :to="`/dashboard/project/${comment.task?.project?.id}`">{{
                    comment.task.project.title
                  }}</router-link></span>


                <span v-if="props.projectId && route.name !== 'Project Detail'" class="block">Project link: <router-link
                    class="underline"
                    :to="`/dashboard/project/${props.projectId}`">{{
                    projectName
                  }}</router-link></span>

                <span v-else-if="comment.project?.id && !['Project Detail','Comments'].includes(route.name)"
                      class="block">Project link: <router-link
                    class="underline"
                    :to="`/dashboard/project/${comment.project?.id}`">{{
                    comment.project.title
                  }}</router-link></span>
              </p>
            </div>

            <div :class="{'w-full': editCommentsIds.includes(comment.id)}">
              <div class="bg-white rounded-[10px]">
                <v-md-editor v-if="editCommentsIds.includes(comment.id)" v-model="comment.content"
                             height="300px">
                </v-md-editor>

                <v-md-preview v-else :text="comment.content"></v-md-preview>
              </div>

              <div class="flex gap-x-3 items-center mt-1">
                  <div v-if="editCommentsIds.includes(comment.id)" class="flex gap-x-3">
                    <Button
                        @on-click="updateComment(comment)"
                        :disabled="btnLoad"
                        label="Update"
                        size="medium"
                        version="yellow"
                    />
                    <Button
                        @on-click="resetEditComment(comment)"
                        :disabled="btnLoad"
                        label="Reset"
                        size="medium"
                        version="green"
                    />
                  </div>
                  <div v-else class="flex items-center gap-x-2">
                    <span v-if="isAuthOwner(comment)" class="underline text-black-c text-xs cursor-pointer"
                          @click="editComment(comment)">Edit</span>
                    <span v-if="!isAuthOwner(comment)" class="underline text-black-c text-xs cursor-pointer"
                          @click="reply(comment)">Reply</span>
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
import {onMounted, onUnmounted, ref} from "vue";
import {catchErrors, pusherEventNames} from "../../utils";
import {convertDateTime} from "../../utils";
import {useRoute, useRouter} from "vue-router";
import {usePaginate} from "../../composables/usePaginate";
import {useFilter} from "../../composables/useFilter";
import {useCommentsStore} from "../../store/comments";
import {useToast} from "vue-toastification";
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import VMdEditor from '@kangc/v-md-editor';
import {useCookies} from "vue3-cookies";
import config from '../../config'
import {watch} from "vue";
import {useAttachmentsStore} from "../../store/attachments";
import PlusIcon from "../Svg/PlusIcon.vue";
import Button from "../Button/Button.vue"
import UserIcon from "../Svg/UserIcon.vue";
import Input from '../Input/Input.vue'
import {usePusher} from "../../composables/usePusher";

const emit = defineEmits()
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
  showCreateBtn: {
    type: Boolean,
    default: true
  },
  showBtnResult: {
    type: Boolean,
    default: false
  },
  users: {
    type: Array,
    default: () => []
  }
})

// ValidationRules
const rules = {
  message: {required},
}

const {bindEvent, setPusherChannel} = usePusher()
const commentsStore = useCommentsStore()
const attachmentsStore = useAttachmentsStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const {cookies} = useCookies();

const btnLoad = ref(false)
const loading = ref(false)
let writeComment = ref(false)
const domain = ref(null)
const message = ref('')
const comments = ref([])
const editCommentsIds = ref([])
let timer = null

const v$ = useVuelidate(rules, {message})

// Methods
const reply = (comment) => {
  emit('update:showCreateBtn', true)
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
    if (resp.data.attachments[0].file_path) {
      insertImage({
        url: resp.data.attachments[0].file_path,
      });
    }
  } catch (e) {
    catchErrors(e)
  }
}

const resetEditComment = (comment) => {
  fetchComments()
  editCommentsIds.value = editCommentsIds.value.filter((item) => item !== comment.id)
}

const updateComment = async (comment) => {
  try {
    btnLoad.value = true
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
    btnLoad.value = false
  }
}

const selectUser = (user, comment) => {
  if (comment) {
    const symbol = comment.content.length ? ' @' : '@'
    const text = symbol + user.username + ' '
    comment.content = comment.content + text
    return
  }

  const symbol = message.value.length ? ' @' : '@'
  const text = symbol + user.username + ' '
  message.value = message.value + text
  const textarea = document.getElementsByTagName('textarea')
  if (textarea) textarea[0].focus()
}

const resetComment = () => {
  emit('update:showCreateBtn', false)
  writeComment.value = false
  message.value = ''
  v$.value.$reset()
  if (!props.showCreateBtn) emit('update:showBtnResult', false)
}

const toLink = (type) => {
  if (type === 'task') return router.push(`/dashboard/task/${props.taskId}`)
  else return router.push(`/dashboard/project/${props.projectId}`)
}

const sendComment = async (e) => {
  if (e) e.preventDefault()

  try {
    const isValid = await v$.value.$validate();
    if (isValid) {
      btnLoad.value = true
      const data = {
        content: message.value,
        project: props.projectId,
        task: props.taskId,
      }

      await commentsStore.createComments(data)
      await toast.success("Comment created");
      message.value = ''
      v$.value.$reset()
      if (!props.showCreateBtn) emit('update:showBtnResult', false)
      fetchComments()
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    writeComment.value = false
    btnLoad.value = false
  }
}

const sorting = (label) => {
  fetchComments(label)
}

onMounted(() => {
  const host = window.location.host
  domain.value = host.replace('www.', '')
})


// Config Pusher
setPusherChannel(route.params.id)
bindEvent(pusherEventNames.comment_created, fetchComments)

// Composables
const options = {
  pageSize: config.COMMENTS_PAGE_SIZE
}
const paginate = usePaginate(fetchComments, options)
const filter = useFilter(comments, fetchComments)

// Run Functions
fetchComments()

</script>
