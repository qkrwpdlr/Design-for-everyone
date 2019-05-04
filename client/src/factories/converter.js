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
  }
};
