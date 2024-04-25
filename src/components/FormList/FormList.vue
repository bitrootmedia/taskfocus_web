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
                <DragIcon />
              </button>

              <template v-if="element.type === 'markdown'">
                <div class="form-group bg-white rounded-[10px] w-full">
                  <div class="content p-[14px] flex justify-between items-start gap-x-4">
                    <div class="w-full">
                      <v-md-editor v-if="editLists[index]" v-model="element.content" height="270px"
                                   :disabled-menus="[]"/>

                      <v-md-preview v-else :text="element.content"></v-md-preview>
                    </div>

                    <div class="actions flex gap-x-1 items-center">
                      <EditIcon class="cursor-pointer" @click="editItem(index)"/>
                      <TrashIcon class="cursor-pointer" @click="removeFormItem(index)"></TrashIcon>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="element.type === 'image'">
                <div class="form-group bg-white rounded-[10px] w-full">
                  <div class="content p-[14px] flex justify-between items-start gap-x-4">
                    <div>
                      <div v-if="editLists[index]" class="cursor-pointer w-full md:w-[500px] mb-4">
                        <input
                            v-model="element.path"
                            disabled
                            type="text"
                            class="mt-2 border-0 px-3 py-3 placeholder-blueGray-300 cursor-not-allowed text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Image Path"
                        />
                      </div>
                      <img v-else :src="element.path" alt="upload-img" class="w-[120px] h-[120px] object-cover">
                    </div>

                    <div class="actions flex gap-x-1 items-center">
                      <EditIcon class="cursor-pointer" @click="editItem(index)"/>
                      <TrashIcon class="cursor-pointer" @click="removeFormItem(index)"></TrashIcon>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="element.type === 'checklist'">
                <div class="form-group bg-white rounded-[10px] w-full">
                  <div class="content p-[14px] flex justify-between items-start gap-x-4">
                    <div>
                      <div v-if="editLists[index]" class="content px-3 pb-3 pt-2">
                        <form class="form-group" @keypress="pressEnter($event,index)" :id="`check-${index}`">
                          <div class="flex gap-x-2 items-start">
                            <input
                                :id="`title-input-${index}`"
                                v-model="element.title"
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

                          <div class="flex items-center mt-4" v-for="(el,i) in element.elements" :key="`${index}-${i}`">
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
                        <span class="text-black-c font-medium text-md mb-2 block">{{ element.title }}</span>
                        <div class="flex items-center mb-3 gap-x-2" v-for="(el,i) in element.elements" :key="`${index}-${i}`">
                          <input
                              :id="`${el.label}-${i}`"
                              v-model="el.checked"
                              @change="editItem(index)"
                              type="checkbox"
                              class="accent-green-c w-3 h-3 border-0 flex pl-8 pr-3 py-3 rounded-[6px] text-sm ease-linear transition-all duration-150 cursor-pointer"
                          />

                          <label :for="`${el.label}-${i}`" class="text-xs text-black-c cursor-pointer whitespace-nowrap">
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
</template>


<script setup>
import {onMounted, ref, watch} from "vue";
import VMdEditor from '@kangc/v-md-editor';
import Dropzone from 'dropzone-vue';
import 'dropzone-vue/dist/dropzone-vue.common.css';
import {catchErrors} from "../../utils";
import {useAttachmentsStore} from "../../store/attachments";
import draggable from 'vuedraggable'
import DragIcon from "../Svg/DragIcon.vue";
import ChecklistIcon from "../Svg/ChecklistIcon.vue";
import EditIcon from "../Svg/EditIcon.vue";
import TrashIcon from "../Svg/TrashIcon.vue";
import MarkdownIcon from "../Svg/MarkdownIcon.vue";
import ImageIcon from "../Svg/ImageIcon.vue";
import PaperClipIcon from "../Svg/PaperClipIcon.vue";
import Button from '../Button/Button.vue'

const emit = defineEmits(['update:modelValue', 'edit'])
const props = defineProps({
  modelValue: {
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
})

//Store
const attachmentsStore = useAttachmentsStore()


//State
const editLists = ref([])
const formList = ref([])
const dragging = ref(false)


//Watch
watch(()=>props.blockName,(val)=>{
  if (val) addNewForm(val)
})
watch(formList, (val) => {
  emit('update:modelValue', formList.value)
},
    { deep: true }
)


//Methods
const pressEnter = (e,index)=>{
  if (e.keyCode === 13){
    addNewCheckboxItem(index)
  }

}

const changeDrag = () => {
  emit('edit')
}

const addNewCheckboxItem = (index) => {
  formList.value[index].elements.push({
    label: "",
    checked: false,
  })

  setTimeout(()=>{
    const form = document.getElementById(`check-${index}`)
    const inputs = form.querySelectorAll('input')
    const lastItem = inputs[inputs.length - 1]
    lastItem.focus()
  },100)
}

const editItem = (index) => {
  editLists.value[index] = !editLists.value[index]
  emit('edit')

  setTimeout(()=>{
    const form = document.getElementById(`check-${index}`)
    const inputs = form.querySelectorAll('input')
    const lastItem = inputs[inputs.length - 1]
    lastItem.focus()
  },100)
}

const removeCheckboxItem = (checklistIndex, elementIndex) => {
  formList.value[checklistIndex].elements = formList.value[checklistIndex].elements.filter((item, i) => i !== elementIndex)
}

const removeFormItem = (index) => {
  formList.value = formList.value.filter((item, i) => i !== index)
  editLists.value = editLists.value.filter((item, i) => i !== index)
  emit('edit')
}

const addNewForm = (version) => {
  let obj = {
    markdown: {
      type: version,
      content: "",
    },
    image: {
      type: version,
      path: "",
    },
    checklist: {
      type: version,
      title: "",
      elements: [
        {
          label: "",
          checked: false,
        },
      ],
    }
  }

  editLists.value = [...editLists.value, true]

  if (!formList.value.length) formList.value = [obj[version]]
  else formList.value.push(obj[version])
  emit('edit')

  setTimeout(()=>{
    if (version === 'checklist'){
      setTimeout(()=>{
        const form = document.getElementById(`check-${formList.value.length - 1}`)
        const inputs = form.querySelectorAll('input')
        const lastItem = inputs[inputs.length - 1]
        lastItem.focus()
      },100)
    }

  },100)
}

const saveFiles = async (e, index) => {
  try {
    const formData = new FormData();
    for (var i = 0; i < e.length; i++) {
      formData.append(e[i].name, e[i]);
    }

    if (props.taskId) {
      formData.append('task_id', props.taskId);
    }

    const resp = await attachmentsStore.uploadAttachments(formData)
    formList.value[index].path = resp.data.attachments[0].file_path
  } catch (e) {
    catchErrors(e)
  }
}

onMounted(() => {
  formList.value = JSON.parse(JSON.stringify(props.modelValue))
  editLists.value = Array.from({length: props.modelValue.length}, i => i = false);
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