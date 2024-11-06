<template>
  <h4>aaaaaaaaa</h4>
  <vue3-mermaid
      :nodes="data"
      type="graph LR"
  ></vue3-mermaid>
  <h4>2222222222222</h4>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import Vue3Mermaid from "vue3-mermaid";



const data = ref([
  {
    id: "1",
    text: "A",
    link: "---",
    next: ["2"],
    group: "one"
  },
  { id: "2", text: "B", edgeType: "circle", next: ["3"], group: "one" },
  { id: "3", text: "C", next: ["4", "6"], group: "two" },
  {
    id: "4",
    text: "D",
    link: "-- This is the text ---",
    next: ["5"],
    group: "two"
  },
  { id: "5", text: "E", group: "three" },
  { id: "6", text: "F", group: "three", url: "http://www.github.com" }
]);
//
// onMounted(() => {
//   // Initialize Mermaid
//   mermaid.initialize({startOnLoad: false});
//
//   // Render the Mermaid diagram
//   mermaid.render('mermaidDiagram', diagram, (svgCode) => {
//     if (mermaidContainer.value) {
//       mermaidContainer.value.innerHTML = svgCode;
//     }
//   })
// })
</script>


<style scoped>
.mermaid {
  width: 200px;
  height: 200px;
  max-width: 100%;
  overflow: auto;
}
</style>
