import store from "@/store";
import Vue from "vue";

var EventBus = new Vue();
export let eventBusMixin = {
  created() {
    EventBus.$on("svgFileLoad", payload => {
      this.loadSvg(payload);
    });
  },
  methods : {
    loadSvg : function(){
      console.log("loadSvg가 선언되지 않았따드!")
    }
  },
};
export { EventBus };
export const customUpload = () => {
  window.addEventListener("dragover", dragover, true);
  window.addEventListener("dragleave", dragleave, true);
  window.addEventListener("drop", drop);
};
// export const customUploadReload;
let dragover = function(e) {
  /**
   * @type {boolean} file 인지 아닌지 확인해서 외부에서 업로드 하는것인지 확인
   */
  let eventKind = true;
  e.dataTransfer.types.forEach(eventCase => {
    if (eventCase != "Files") {
      eventKind = false;
    }
  });
  if (store.state.isUploading == false && eventKind) {
    store.commit("setUploading", true);
  }
};
let dragleave = function(e) {
  if (e.relatedTarget == null) {
    if (store.state.isUploading == true) {
      store.commit("setUploading", false);
    }
  }
};
let drop = function(e) {
  e.stopPropagation();
  e.preventDefault();
  store.commit("setUploading", false);
  if (e.dataTransfer.files.length !== 1) {
    alert("file을 한개씩 올려주세요");
  } else {
    EventBus.$emit("svgFileLoad", e.dataTransfer.files[0]);
  }
};
