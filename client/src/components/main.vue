<template>
  <div id="mainDom">
    <canvas id="c"></canvas>
  </div>
</template>

<script>
import { fabric } from "fabric";
import jsonData from "./../assets/test.json";
import { mapActions, mapMutations } from "vuex";
import { customUpload, eventBusMixin } from "@/factories/dragAndDrop";
import convert from "@/factories/blobToUrl";
import Vue from "vue";
import converter from "@/factories/converter";

export default {
  mixins: [eventBusMixin],
  mounted() {
    customUpload();
    this.s3Init();
    this.canvas = new fabric.Canvas("c", {
      preserveObjectStacking: true,
      backgroundColor: "black"
    });
  },
  data: function() {
    return {
      canvas: Object
    };
  },
  methods: {},
  computed: {}
};
</script>

<style>
#mainDom {
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: aqua;
}
</style>
