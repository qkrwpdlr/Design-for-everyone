<template>
    <div class="back-dark" @dragover.prevent>
      <div class="dark-content">
        <h1>업로드</h1>
      </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  methods: {
    ...mapMutations({ setUploading: "setUploading" })
  }
};
</script>

<style>
.back-dark {
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.87);
  border-spacing: 100px;
  border: 10px white dotted;
}
.dark-content {
  color: white;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 0 47px;
  margin-top: 20%;
  width: 100%;
}
</style>
