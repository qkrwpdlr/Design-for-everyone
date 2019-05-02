import state from "@/store";
const baseUrl = "https://s3.ap-northeast-2.amazonaws.com/makery-test/origin/";
/**
 * @param {object} payload fabric json object
 */
const convert = payload => {
  for (let i in payload.objects) {
    if (payload.objects[i].type == "group") {
      for (let j in payload.objects[i].objects) {
        if (payload.objects[i].objects[j].type == "image") {
          _convert(payload.objects[i].objects[j]);
        }
      }
    }
    if (payload.objects[i].type == "image") {
      _convert(payload.objects[i]);
    }
  }
  let result = JSON.stringify(payload);
  localStorage.setItem("tempSave", result);
  return;
};
/**
 * @param {Object} payload
 */
const _convert = payload => {
  const randomName = makeid();
  state.dispatch("s3Upload", { url: payload.src, randomName });
  let newUrl = `${baseUrl}${randomName}.jpg`;
  payload.src = newUrl;
};

function makeid() {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 7; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
export default convert;
