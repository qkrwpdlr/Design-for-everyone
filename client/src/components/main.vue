<template>
  <div id="mainDom">
    <div>
      <label>width<input type="number" v-model="widthData"></label>
      <br>
      <label>height<input type="number" v-model="heightData"></label>
      <br>
      <button @click="applySize">적용</button>
    </div>
    <p @click="loadSvg">loadSvg</p>
    <p @click="loadJson">jsonLoad</p>
    <p @click="checkMod">checkMod</p>
    <p @click="checkModEnd">checkMod End</p>
    <p @click="reloadCheck">reloadCheck</p>
    <p @click="facebookBox">facebookBox</p>
    <p @click="test">test</p>
    <p @click="saveAsJson">save as json</p>
    <p @click="loadFromJSON">loadFromJSON</p>
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

export default {
  mixins: [eventBusMixin],
  mounted() {
    customUpload();
    this.s3Init();
    this.canvas = new fabric.Canvas("c", { preserveObjectStacking: true });
  },
  data: function() {
    return {
      canvas: Object,
      heightData: Number,
      widthData: Number,
      facebookSize: {
        width: 820,
        height: 312
      },
      originSize: {
        width: 1199,
        height: 1692
      },
      jsonData,
      saveData: [],
      originColor: null
    };
  },
  methods: {
    ...mapMutations({
      setUploading: "setUploading"
    }),
    ...mapActions({
      s3Init: "s3Init"
    }),
    applySize: function() {
      this.widthData;
      this.heightData;
    },
    saveAsJson: function() {
      let result = this.canvas.toJSON(["originWidth", "originHeight"]);
      convert(result);
      // result = JSON.stringify(result);
      // localStorage.setItem("tempSave", result);
    },
    loadFromJSON: function() {
      this.canvas.loadFromJSON(localStorage.getItem("tempSave"), () => {
        console.log(this.canvas);
        const rate = 0.3;
        this.canvas.setHeight(this.canvas.originHeight * rate);
        this.canvas.setWidth(this.canvas.originWidth * rate);
        this.canvas.setZoom(rate);
      });
    },
    facebookBox: function() {
      this.canvas.add(
        new fabric.Rect({
          width: this.facebookSize.width,
          height: this.facebookSize.height,
          fill: "rgba(0,0,0,0.4)"
        })
      );
    },
    reloadCheck: function() {
      while (this.saveData.length != 0) {
        this.canvas.add(this.saveData.pop());
      }
    },
    checkMod: function() {
      this.canvas.on("selection:created", e => {
        e.target.set({ fill: this.originColor });
        this.saveData.push(e.target);
        this.canvas.remove(e.target);
      });
      this.canvas.on("mouse:over", e => {
        this.originColor = e.target.get("fill");
        e.target.set({ fill: "red" });
        this.canvas.renderAll();
      });
      this.canvas.on("mouse:out", e => {
        e.target.set({ fill: this.originColor });
        this.canvas.renderAll();
      });
    },
    checkModEnd: function() {
      this.canvas.off("selection:created");
      this.canvas.off("mouse:over");
      this.canvas.off("mouse:out");
    },
    loadJson: function() {
      this.canvas.loadFromJSON(this.jsonData, () => {
        const rate = 0.5;
        this.canvas.setHeight(this.originSize.height * rate);
        this.canvas.setWidth(this.originSize.height * rate);
        this.canvas.setZoom(rate);
      });
    },
    test: function() {
      for (let i in this.canvas._objects) {
        const rate = 0.1;
        this.canvas._objects[i].set({
          scaleX: this.canvas._objects[i].get("scaleX") * rate,
          scaleY: this.canvas._objects[i].get("scaleY") * rate,
          left: this.canvas._objects[i].get("left") * rate,
          top: this.canvas._objects[i].get("top") * rate
        });
      }
      this.canvas.renderAll();
    },
    loadSvgOrigin: function() {
      let rate = 0.3;
      this.canvas.setZoom(rate);
      this.canvas.setHeight(options.height * rate);
      this.canvas.setWidth(options.width * rate);
      for (let i in temp) {
        this.canvas.add(temp[i]);
      }
      this.canvas.renderAll();
    },
    /**
     * @param {Object} payload svgdata
     */
    loadSvg: function(payload) {
      fabric.loadSVGFromURL(
        URL.createObjectURL(payload),
        (temp, options, svgTag) => {
          console.log(options);
          let tempText = "";
          let positionX = 0;
          for (let i in temp) {
            if (temp[i].type == "text") {
              for (let j in svgTag[i].childNodes) {
                if (svgTag[i].childNodes[j].tagName != "tspan") break;
                tempText += svgTag[i].childNodes[j].innerHTML + "\n";
                positionX += parseInt(
                  svgTag[i].childNodes[j].getAttribute("x")
                );
              }
              if (tempText != "") {
                let cssJson = CssToJson(
                  svgTag[i].childNodes[0].style,
                  temp[i],
                  positionX
                );
                temp[i].set(cssJson);
                temp[i].set({
                  text: tempText
                });
                tempText = "";
                positionX = 0;
              }
            }
          }
          this.canvas.originWidth = options.width;
          this.canvas.originHeight = options.height;
          this.originSize.width = options.width;
          this.originSize.height = options.height;
          let dic = {};
          let textData = [];
          for (let i in svgTag) {
            let tempGroup = findGroup(svgTag[i]);
            if (svgTag[i].tagName == "text") {
              tempGroup = false;
            }
            if (tempGroup == false) {
              textData.push(temp[i]);
            } else if (dic.hasOwnProperty(tempGroup)) {
              dic[tempGroup].push(i);
            } else {
              dic[tempGroup] = [i];
            }
          }
          for (let i in textData) {
            this.canvas.add(textData[i]);
          }
          let groupCount = 0;
          for (let index in dic) {
            let group = [];
            let minIndex = temp.length;
            for (let i in dic[index]) {
              if (dic[index][i] < minIndex) {
                minIndex = dic[index][i];
              }
              group.push(temp[dic[index][i]]);
            }
            let newGroup = new fabric.Group(group);
            this.canvas.add(newGroup);
            this.canvas.moveTo(newGroup, minIndex - groupCount);
            groupCount = group.length;
          }
          this.canvas.renderAll();
          const rate = 0.3;
          let temp_str = "";
          this.canvas.setHeight(options.height * rate);
          this.canvas.setWidth(options.width * rate);
          this.canvas.setZoom(rate);
          this.canvas.renderAll();
        }
      );
    }
  },
  computed: {}
};

/**
 * @param {Object} svgTag
 * @param {null} groupList 재귀함수를 위한 값으로 null, 즉 값이 없는것이 좋다
 */
var index = 0;
const GROUPINDEX = 2;
function findGroup(svgTag, groupList) {
  if (groupList == undefined) {
    groupList = [];
  }
  if (svgTag.tagName == "svg") {
    if (groupList == undefined || groupList == []) return false;
    if (groupList[groupList.length - GROUPINDEX] == undefined) return false;
    return groupList[groupList.length - GROUPINDEX];
  } else if (svgTag.tagName == "g") {
    if (svgTag.id == "") {
      svgTag.id = "gg" + index;
      index = index + 1;
    }
    groupList.push(svgTag.id);
    return findGroup(svgTag.parentElement, groupList);
  } else {
    return findGroup(svgTag.parentElement, groupList);
  }
}
/**
 * @param {Object:CSSStyleDeclaration} cssData
 * @param {Obejct} fabricObj fabricjs object for position
 * @param {Number} positionX gap of x position
 */
function CssToJson(cssData, fabricObj, positionX) {
  let textAlign = positionX != 0 ? "center" : "left";
  if (positionX > 0) positionX = 0;
  return {
    fontSize: parseInt(cssData.fontSize, 10),
    fontFamily: cssData.fontFamily,
    letterSpace: parseInt(cssData.letterSpacing, 10),
    fill: cssData.fill || "#000000",
    top:
      fabricObj.top -
      parseInt(cssData.fontSize, 10) +
      fabricObj.get("fontSize"),
    left: fabricObj.left + positionX,
    textAlign
  };
}
</script>

<style>
#mainDom {
  display: inline-block;
  width: 100%;
  height: 100%;
}
</style>
