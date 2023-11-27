<template>
  <div class="flex gap-x-4 mb-8">
    <button type="button" class="text-white mr-6 cursor-pointer hover-text" @click="addNewForm('markdown')">
      <i class="fas fa-microchip text-md text-blueGray-800"></i>
      <span class="tooltip-text">Create markdown!</span>
    </button>
    <button type="button" class="text-white mr-6 cursor-pointer hover-text" @click="addNewForm('image')">
      <i class="fas fa-file text-md text-blueGray-800"></i>
      <span class="tooltip-text">Create image!</span>
    </button>
    <button type="button" class="text-white mr-6 cursor-pointer hover-text" @click="addNewForm('checklist')">
      <i class="fas fa-sitemap text-md text-blueGray-800"></i>
      <span class="tooltip-text">Create checklist!</span>
    </button>
  </div>

  <div class="form">
    <div class="">
      <div class="form-version mb-8">
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
                <i class="fas fa-grip-vertical text-xl text-blueGray-400"></i>
              </button>

              <template v-if="element.type === 'markdown'">
                <v-md-editor v-if="editLists[index]" v-model="element.content" height="230px"
                             :disabled-menus="[]"/>

                <v-md-preview v-else :text="element.content" class="cursor-pointer"></v-md-preview>
              </template>

              <template v-else-if="element.type === 'image'">
                <div v-if="editLists[index]" class="cursor-pointer w-full md:w-[500px] mb-4">
                  <Dropzone
                      :maxFiles="Number(1)"
                      :maxFileSize="200000000"
                      ref="dropZoneRef"
                      :uploadOnDrop="true"
                      :multipleUpload="false"
                      :multiple="1"
                      @sending="saveFiles($event,index)"
                      :parallelUpload="1"
                  />
                  <input
                      v-model="element.path"
                      disabled
                      type="text"
                      class="mt-2 border-0 px-3 py-3 placeholder-blueGray-300 cursor-not-allowed text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Image Path"
                  />
                </div>

                <img v-else :src="element.path" alt="upload-img" class="w-[250px] h-[150px] object-cover">
              </template>


              <template v-else-if="element.type === 'checklist'">
                <div v-if="editLists[index]" class="form-group mb-4">
                  <div class="flex gap-x-2 items-start">
                    <input
                        v-model="element.title"
                        type="text"
                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Checklist Title"
                    />
                  </div>

                  <button type="button"
                          class="bg-blueGray-800 mt-1 text-white active:bg-blueGray-600 text-xs font-bold px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                          @click="addNewCheckboxItem(index)">
                    Add New
                  </button>

                  <div class="flex items-center mt-4" v-for="(el,i) in element.elements" :key="`${index}-${i}`">
                    <input
                        id="hideClosed"
                        v-model="el.checked"
                        type="checkbox"
                        class="border-0 flex pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm ease-linear transition-all duration-150 cursor-pointer"
                    />
                    <label for="hideClosed"
                           class="text-md text-blueGray-500 font-medium cursor-pointer ml-2 whitespace-nowrap">
                      <input
                          v-model="el.label"
                          type="text"
                          class="border-0 px-3 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Checkbox Title"
                      />
                    </label>
                    <button type="button" class="text-white ml-2 cursor-pointer" @click="removeCheckboxItem(index,i)">
                      <i class="fas fa-window-close text-md text-red-500"></i>
                    </button>
                  </div>
                </div>

                <div v-else class="form-group mb-4">
                  <div class="flex gap-x-2 items-start">
                    <span class="text-blueGray-500 font-medium text-lg">{{ element.title }}</span>
                  </div>

                  <div class="flex items-center" v-for="(el,i) in element.elements" :key="`${index}-${i}`">
                    <svg v-if="el.checked" width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                         xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink" fill="#c8e6c9" stroke="#c8e6c9">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g id="ic_fluent_checkbox_checked_24_regular" fill="#c8e6c9" fill-rule="nonzero">
                            <path
                                d="M18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 L18.25,3 Z M18.25,4.5 L5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 Z M10,14.4393398 L16.4696699,7.96966991 C16.7625631,7.6767767 17.2374369,7.6767767 17.5303301,7.96966991 C17.7965966,8.23593648 17.8208027,8.65260016 17.6029482,8.94621165 L17.5303301,9.03033009 L10.5303301,16.0303301 C10.2640635,16.2965966 9.84739984,16.3208027 9.55378835,16.1029482 L9.46966991,16.0303301 L6.46966991,13.0303301 C6.1767767,12.7374369 6.1767767,12.2625631 6.46966991,11.9696699 C6.73593648,11.7034034 7.15260016,11.6791973 7.44621165,11.8970518 L7.53033009,11.9696699 L10,14.4393398 L16.4696699,7.96966991 L10,14.4393398 Z"
                                id="🎨Color"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <svg v-else width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ababab" stroke="#ababab">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g id="ic_fluent_checkbox_unchecked_24_regular" fill="#ababab" fill-rule="nonzero">
                            <path
                                d="M5.75,3 L18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 Z M5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 L5.75,4.5 Z"
                                id="🎨Color"></path>
                          </g>
                        </g>
                      </g>
                    </svg>

                    <span class="text-md text-blueGray-500 font-medium ml-2 whitespace-nowrap">
                      {{ el.label }}
                    </span>
                  </div>
                </div>
              </template>

              <div class="actions mr-6 flex gap-x-2">
                <button type="button" class="text-white cursor-pointer" @click="editItem(index)">
                  <i class="fas fa-pen-square text-xl text-blueGray-500"></i>
                </button>
                <button type="button" class="text-white cursor-pointer" @click="removeFormItem(index)">
                  <i class="fas fa-window-close text-xl text-red-500"></i>
                </button>
              </div>
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
})

//Store
const attachmentsStore = useAttachmentsStore()


//State
const editLists = ref([])
const formList = ref([])
const dragging = ref(false)


//Watch
watch(formList, (val) => {
  emit('update:modelValue', formList.value)
},
    { deep: true }
)


//Methods
const changeDrag = () => {
  emit('edit')
}

const addNewCheckboxItem = (index) => {
  formList.value[index].elements.push({
    label: "",
    checked: false,
  })
}

const editItem = (index) => {
  editLists.value[index] = !editLists.value[index]
  emit('edit')
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
  formList.value.push(obj[version])
  emit('edit')
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
  opacity: 0.5;
  background: #c8ebfb;
}

.handle {
  cursor: move;
}

</style>