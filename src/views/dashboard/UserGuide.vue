<template>
  <div class="main-container">
    <p>This project/task manager is highly opinionated.</p>

    <p>General rules:</p>


    <ul>
      <li>Everybody can create a project. Whoever creates a project becomes project owner</li>
      <li>Everybody can create a task. Whoever creates a task becomes task owner</li>
      <li>Only task owner can close the task and set access</li>
      <li>Project users have access to all task in that project</li>
      <li>Task can be created without a project</li>

      <li>Task responsible field is used to determine who should be working on it at the moment</li>
    </ul>
  </div>

</template>

<script>
export default {
  name: "UserGuide"
}
</script>

<style scoped>

</style>