import AWS from "aws-sdk";
import { fabric } from "fabric";

export default {
  s3Init: function({ commit }) {
    const bucketName = "makery-test";
    const region = "ap-northeast-2"; // 리전
    const identityPoolId =
      "ap-northeast-2:e6fd0b22-b13a-47a9-95d1-d2dcd78afaf2";
    AWS.config.update({
      region: region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId
      })
    });
    AWS.config.credentials.refresh(() => {
      commit(
        "_setS3",
        new AWS.S3({
          apiVersion: "2006-03-01",
          params: {
            Bucket: bucketName
          }
        })
      );
    });
  },
  /**
   * @param {Object} payload
   */
  s3Upload: ({ state }, payload) => {
    const dataURItoBlob = dataURI => {
      var binary = atob(dataURI.split(",")[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: "image/png" });
    };

    function makeid() {
      let text = "";
      let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }
    const randomName = makeid();

    var file = payload;

    let preview = new Image();
    var _URL = window.URL || window.webkitURL;
    preview.src = _URL.createObjectURL(file);
    preview.onload = async () => {
      var img = new fabric.Image(preview);
      let canvas = new fabric.Canvas();
      canvas.setHeight(preview.height);
      canvas.setWidth(preview.width);
      canvas.add(img);
      canvas.renderAll();
      let previewData = canvas.toDataURL({
        format: `${payload.name.split(".")[1]}`,
        multiplier: 0.1,
        left: 0,
        right: 0,
        width: preview.width,
        height: preview.height
      });
      var previewblobData = await dataURItoBlob(previewData);
      state.s3.upload(
        {
          Key: `preview/${randomName}.${payload.name.split(".")[1]}`,
          Body: previewblobData,
          ContentType: payload.type
        },
        function(err) {
          if (err) {
            alert(err);
          } else {
            alert("good");
          }
        }
      );
      state.s3.upload(
        {
          Key: `origin/${randomName}.${payload.name.split(".")[1]}`,
          Body: payload,
          ContentType: payload.type
        },
        function(err) {
          if (err) {
            alert(err);
          } else {
            alert("good");
          }
        }
      );
    };
  }
};
