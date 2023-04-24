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
import enUS from '@kangc/v-md-editor/lib/lang/en-US';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
VMdEditor.use(vuepressTheme, { Prism });
VMdEditor.lang.use('en-US', enUS);

import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import '@kangc/v-md-editor/lib/style/preview-html.css';


const pinia = createPinia()

createApp(App).use(router).use(Toast).use(VueCookies).use(pinia).use(VMdEditor).use(VMdPreviewHtml).mount('#app')
