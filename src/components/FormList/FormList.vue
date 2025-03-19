<template>
  <div class="form">
    <div class="">
      <div class="form-version" v-if="formList.length">
        <draggable
            :list="formList"
            item-key="name"
            class="list-group"
            ghost-class="ghost"
            handle=".handle"
            @change="changeDrag"
        >
          <template #item="{ element, index }">
            <div class="list-group-item flex items-start gap-x-4 mb-6 description-panel">
              <button type="button" class="text-white cursor-pointer handle">
                <DragIcon/>
              </button>

              <template v-if="element.block_type === 'MARKDOWN'">
                <div class="form-group bg-white rounded-[10px] w-full">
                  <div class="content p-[14px] flex justify-between items-start gap-x-4">
                    <div class="w-full">
                      <v-md-editor v-if="editLists[index]"
                                   v-model="element.content.markdown"
                                   height="270px"
                                   :disabled-menus="[]"
                                   @upload-image="handleUploadImage"
                      />

                      <v-md-preview v-else :text="element.content.markdown"></v-md-preview>
                    </div>

                    <div class="actions flex gap-x-1 items-center">
                      <EditIcon class="cursor-pointer" @click="editItem(index)"/>
                      <TrashIcon class="cursor-pointer" @click="removeFormItem(index)"></TrashIcon>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="element.block_type === 'IMAGE'">
                <div class="form-group bg-white rounded-[10px] w-full">
                  <div class="content p-[14px] flex justify-between items-start gap-x-4">
                    <div>
                      <div v-if="editLists[index]" class="cursor-pointer w-full md:w-[500px] mb-4">
                        <input
                            v-model="element.content.path"
                            disabled
                            type="text"
                            class="mt-2 border-0 px-3 py-3 placeholder-blueGray-300 cursor-not-allowed text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Image Path"
                        />
                      </div>
                      <img v-else :src="element.content.path" alt="upload-img" class="w-[120px] h-[120px] object-cover"
                           @click="openModal(element)">
                    </div>

                    <div class="actions flex gap-x-1 items-center">
                      <EditIcon class="cursor-pointer" @click="editItem(index)"/>
                      <TrashIcon class="cursor-pointer" @click="removeFormItem(index)"></TrashIcon>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="element.block_type === 'CHECKLIST'">
                <div class="form-group bg-white rounded-[10px] w-full">
                  <div class="content p-[14px] flex justify-between items-start gap-x-4">
                    <div>
                      <div v-if="editLists[index]" class="content px-3 pb-3 pt-2">
                        <form class="form-group" @keypress="pressEnter($event,index)" :id="`check-${index}`">
                          <div class="flex gap-x-2 items-start">
                            <input
                                :id="`title-input-${index}`"
                                v-model="element.content.title"
                                type="text"
                                class="w-[250px] pl-3 pr-3 py-[5px] placeholder-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring ease-linear transition-all duration-150"
                                placeholder="Checklist Title"
                            />
                            <Button
                                @on-click="addNewCheckboxItem(index)"
                                :label="'Add New'"
                                version="yellow"
                                size="medium"
                            />
                          </div>

                          <div class="flex items-center mt-4" v-for="(el,i) in element.content.elements"
                               :key="`${index}-${i}`">
                            <input
                                :id="`${el.label}-${i}`"
                                v-model="el.checked"
                                type="checkbox"
                                class="accent-green-c w-4 h-4 border-0 flex pl-8 pr-3 py-3 rounded-[6px] text-sm ease-linear transition-all duration-150 cursor-pointer"
                            />
                            <label :for="`${el.label}-${i}`"
                                   class="text-md text-blueGray-500 font-medium cursor-pointer ml-2 whitespace-nowrap">
                              <input
                                  v-model="el.label"
                                  type="text"
                                  class="w-[200px] pl-3 pr-3 py-[5px] placeholder-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring ease-linear transition-all duration-150"
                                  placeholder="Checkbox Title"
                              />
                            </label>
                            <TrashIcon class="cursor-pointer ml-1" @click="removeCheckboxItem(index,i)"></TrashIcon>
                          </div>
                        </form>
                      </div>
                      <div v-else class="">
                        <span class="text-black-c font-medium text-md mb-2 block">{{ element.content.title }}</span>
                        <div class="flex items-center mb-3 gap-x-2" v-for="(el,i) in element.content.elements"
                             :key="`${index}-${i}`">
                          <input
                              :id="`${el.label}-${i}`"
                              v-model="el.checked"
                              @change="editItem(index)"
                              type="checkbox"
                              class="accent-green-c w-3 h-3 border-0 flex pl-8 pr-3 py-3 rounded-[6px] text-sm ease-linear transition-all duration-150 cursor-pointer"
                          />

                          <label :for="`${el.label}-${i}`"
                                 class="text-xs text-black-c cursor-pointer whitespace-nowrap">
                            {{ el.label }}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="actions flex gap-x-1 items-center">
                      <EditIcon class="cursor-pointer" @click="editItem(index)"/>
                      <TrashIcon class="cursor-pointer" @click="removeFormItem(index)"></TrashIcon>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>

  <AttachmentMediaModal
      :show-modal="popUp"
      :active="activeSrc"
      :owner-of-media="ownerOfMedia"
      @close="popUp = false"
  />
</template>


<script setup>
import {onMounted, ref, watch} from "vue";
import VMdEditor from '@kangc/v-md-editor';
import Dropzone from 'dropzone-vue';
import 'dropzone-vue/dist/dropzone-vue.common.css';
import {catchErrors} from "../../utils";
import draggable from 'vuedraggable'
import DragIcon from "../Svg/DragIcon.vue";
import EditIcon from "../Svg/EditIcon.vue";
import TrashIcon from "../Svg/TrashIcon.vue";
import Button from '../Button/Button.vue'
import AttachmentMediaModal from '../Modals/AttachmentMediaModal.vue'
import {useTasksStore} from "../../store/tasks.js";
import {useAttachmentsStore} from "../../store/attachments.js";
import config from "../../config/index.js";

const emit = defineEmits(['update:modelValue', 'updateDeleteList', 'edit', 'updateTask'])
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  deletedBlockList: {
    type: Array,
    default: () => []
  },
  blocks: {
    type: Array,
    default: () => []
  },
  taskId: {
    type: String,
    default: ''
  },
  blockName: {
    type: String,
    default: ''
  },
  firstOne: {
    type: Boolean,
    default: false
  },
})


//State
const attachmentsStore = useAttachmentsStore()
const taskStore = useTasksStore()
const editLists = ref([])
const formList = ref([])
const dragging = ref(false)
const popUp = ref(false)
const ownerOfMedia = ref({})
const activeSrc = ref({
  isAuth: false
})


//Watch
watch(() => props.blockName, (val) => {
  if (val) addNewForm(val)
})
watch(formList, (val) => {
  emit('update:modelValue', val)
}, {deep: true})


//Methods
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

      // const url = config.BASE_API_URL.substring(0, config.BASE_API_URL.length - 4)
      // insertImage({
      //   url: url + resp.data.attachments[0].file_path,
      // });
    }
  } catch (e) {
    catchErrors(e)
  }
}

const openModal = (element) => {
  popUp.value = true

  ownerOfMedia.value = {
    isAuth: false,
    attachmentId: element.id
  }

  activeSrc.value = {
    src: element.thumbnail_path,
    path: element.file_path,
  }
}

const pressEnter = (e, index) => {
  if (e.keyCode === 13) {
    addNewCheckboxItem(index)
  }
}

const changeDrag = async (e) => {
  try {
    const newIndex = e.moved.newIndex
    const blockId = e.moved.element.id
    await changeBlockPosition(newIndex, blockId)
  } catch (e) {
    catchErrors(e)
  }
}

const changeBlockPosition = async (position, blockId) => {
  try {
    const data = {
      task: props.taskId,
      block: blockId,
      position: position
    }
    await taskStore.taskBlockMove(data)
  } catch (e) {
    catchErrors(e)
  }
}

const saveMarkdown = () => {
  emit('updateTask')
}

const addNewCheckboxItem = (index) => {
  formList.value[index].content.elements.push({
    label: "",
    checked: false,
  })

  setTimeout(() => {
    const form = document.getElementById(`check-${index}`)
    const inputs = form.querySelectorAll('input')
    const lastItem = inputs[inputs.length - 1]
    lastItem.focus()
  }, 100)
}

const editItem = (index) => {
  editLists.value[index] = !editLists.value[index]
  formList.value[index].is_edit = true
  emit('edit')

  setTimeout(() => {
    const form = document.getElementById(`check-${index}`)
    const inputs = form.querySelectorAll('input')
    const lastItem = inputs[inputs.length - 1]
    lastItem.focus()
  }, 100)
}

const removeCheckboxItem = (checklistIndex, elementIndex) => {
  formList.value[checklistIndex].elements = formList.value[checklistIndex].elements.filter((item, i) => i !== elementIndex)
}

const removeFormItem = (index) => {
  const itemId = formList.value[index].id
  formList.value = formList.value.filter((item, i) => i !== index)
  editLists.value = editLists.value.filter((item, i) => i !== index)
  emit('updateDeleteList', itemId)
  emit('edit')
}

const addNewForm = (version) => {
  let obj = {
    MARKDOWN: {
      block_type: version,
      content: {
        markdown: ''
      },
      position: formList.value.length || 0
    },
    IMAGE: {
      block_type: version,
      content: {
        path: "",
      },
      position: formList.value.length || 0
    },
    CHECKLIST: {
      block_type: version,
      content: {
        title: "",
        elements: [
          {
            label: "",
            checked: false,
          },
        ],
      },
      position: formList.value.length || 0
    }
  }

  editLists.value = [...editLists.value, true]

  if (!formList.value.length) formList.value = [obj[version]]
  else formList.value.push(obj[version])
  emit('edit')

  setTimeout(() => {
    if (version === 'CHECKLIST') {
      setTimeout(() => {
        const form = document.getElementById(`check-${formList.value.length - 1}`)
        const inputs = form.querySelectorAll('input')
        const lastItem = inputs[inputs.length - 1]
        lastItem.focus()
      }, 100)
    }

  }, 100)
}

onMounted(() => {
  props.modelValue.map((item) => {
    item.is_edit = false
    return item
  })
  formList.value = JSON.parse(JSON.stringify(props.modelValue))
  if (props.firstOne) editLists.value = [true]
  else {
    editLists.value = Array.from({length: props.modelValue.length}, i => i = false);
  }
})

</script>

<style scoped>
.hover-text {
  position: relative;
}

.tooltip-text {
  visibility: hidden;
  position: absolute;
  z-index: 1;
  width: 116px;
  color: white;
  font-size: 12px;
  background-color: #192733;
  border-radius: 10px;
  padding: 5px 7px 5px 7px;
  top: -30px;
  left: -300%;
}

.hover-text:hover .tooltip-text {
  visibility: visible;
}

.ghost {
  opacity: 0.2;
  background: rgba(248, 212, 135, 0.5);
}

.handle {
  cursor: move;
}
</style>
