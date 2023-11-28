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
      <div class="form-version mb-8" v-if="formList.length">
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
                    <input
                        id="hideClosed1"
                        v-model="el.checked"
                        @change="editItem(index)"
                        type="checkbox"
                        class="border-0 flex pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm ease-linear transition-all duration-150"
                    />

                    <label class="text-md text-blueGray-500 font-medium ml-2 whitespace-nowrap">
                      {{ el.label }}
                    </label>
                  </div>
                </div>
              </template>

              <div class="actions mr-6 flex gap-x-2">
                <button type="button" class="text-white cursor-pointer" @click="editItem(index)">
                  <i class="fas fa-pen-square text-xl text-blueGray-500"></i>
                </button>
                <button v-if="editLists[index]" type="button" class="text-white cursor-pointer" @click="removeFormItem(index)">
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
  console.log(formList.value,'formList.value')
  if (!formList.value.length) formList.value = [obj[version]]
  else formList.value.push(obj[version])
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