import { createApp } from 'vue'
import "@fortawesome/fontawesome-free/css/all.min.css";
import './assets/css/index.css'
import './assets/css/global.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import {router} from "./router";
import VueCookies from 'vue3-cookies'

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import '@kangc/v-md-editor/lib/style/preview-html.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import enUS from '@kangc/v-md-editor/lib/lang/en-US';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import hljs from 'highlight.js';


VMdEditor.use(vuepressTheme, { Prism });
VMdEditor.lang.use('en-US', enUS);

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});



const pinia = createPinia()
const cookieOptions = {
    expireTimes: "30d",
}

const toastOptions = {
    position: "bottom-left",
}


createApp(App).use(router).use(Toast,toastOptions).use(VueCookies,cookieOptions).use(pinia).use(VMdEditor).use(VMdPreview).use(VMdPreviewHtml).mount('#app')
