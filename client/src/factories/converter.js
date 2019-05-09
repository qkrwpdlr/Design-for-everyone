import { fabric } from "fabric";

const RATE = 0.2;

export default {
  setBackground: canvas => {
    canvas.getActiveObject().set({
      id: "background"
    });
  },
  /**
   * @param {Object} payload
   * @param {Number} payload.height
   * @param {Number} payload.width
   */
  applySize: (canvas, payload) => {
    let isWidth = true;
    let small_rate = payload.height / canvas.get("height");
    let big_rate = payload.width / canvas.get("width");
    if (small_rate > big_rate) {
      isWidth = false;
      let tmp = small_rate;
      small_rate = big_rate;
      big_rate = tmp;
    }
    canvas.setWidth(payload.width);
    canvas.setHeight(payload.height);
    canvas.setZoom(canvas.getZoom() * small_rate);
    for (let i in canvas._objects) {
      if (canvas._objects[i].id == "background") {
        canvas._objects[i]
          .set({
            scaleX: big_rate / small_rate,
            scaleY: big_rate / small_rate
          })
          .setCoords();
      } else {
        if (isWidth == true) {
          console.log(big_rate / small_rate);
          let temp = canvas._objects[i].get("left");
          temp +=
            (canvas._objects[i].get("scaleX") *
              canvas._objects[i].get("width")) /
            2;
          temp *= big_rate / small_rate;
          temp -=
            (canvas._objects[i].get("scaleX") *
              canvas._objects[i].get("width")) /
            2;
          canvas._objects[i]
            .set({
              left: temp
            })
            .setCoords();
        } else {
          canvas._objects[i];
          let temp = canvas._objects[i].get("top");
          temp +=
            (canvas._objects[i].get("scaleY") * canvas._objects[i].get("top")) /
            2;
          temp *= big_rate / small_rate;
          temp -=
            (canvas._objects[i].get("scaleY") * canvas._objects[i].get("top")) /
            2;
          canvas._objects[i]
            .set({
              top: temp
            })
            .setCoords();
        }
      }
    }
    canvas.renderAll();
  },
  /**
   * @param {Object} payload svgdata
   */

  loadSvg: (canvas, payload) => {
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
              positionX += parseInt(svgTag[i].childNodes[j].getAttribute("x"));
            }
            if (tempText != "") {
              let cssJson = _CssToJson(
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
        canvas.originWidth = options.width;
        canvas.originHeight = options.height;
        let dic = {};
        let textData = [];
        for (let i in svgTag) {
          let tempGroup = _findGroup(svgTag[i]);
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
          canvas.add(textData[i]);
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
          canvas.add(newGroup);
          canvas.moveTo(newGroup, minIndex - groupCount);
          groupCount = group.length;
        }
        canvas.renderAll();
        canvas.setHeight(options.height * RATE);
        canvas.setWidth(options.width * RATE);
        canvas.setZoom(RATE);
        canvas.renderAll();
      }
    );
  }
};

/**
 * @param {Object} svgTag
 * @param {null} groupList 재귀함수를 위한 값으로 null, 즉 값이 없는것이 좋다
 */
var index = 0;
const GROUPINDEX = 2;
function _findGroup(svgTag, groupList) {
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
    return _findGroup(svgTag.parentElement, groupList);
  } else {
    return _findGroup(svgTag.parentElement, groupList);
  }
}
/**
 * @param {Object:CSSStyleDeclaration} cssData
 * @param {Obejct} fabricObj fabricjs object for position
 * @param {Number} positionX gap of x position
 */
function _CssToJson(cssData, fabricObj, positionX) {
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
