<template>
  <div id="app">
      <upload-component v-if="this.isUploading === true" />
      <router-view/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import uploadComponent from "./components/uploadComponent";
export default {
  name: "App",
  components: {
    uploadComponent
  },
  computed: {
    ...mapState({ isUploading: "isUploading" })
  }
};
</script>

<style>
html,
body {
  height: 100%;
}
#app {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>
