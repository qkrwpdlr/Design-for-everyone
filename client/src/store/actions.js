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
   * @param {Object} payload.url
   * @param {String} payload.randomName
   */
  s3Upload: async ({ state }, payload) => {
    const dataURItoBlob = dataURI => {
      var binary = atob(dataURI.split(",")[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: "image/png" });
    };
    let data = await dataURItoBlob(payload.url);
    console.log(state.s3.upload);
    state.s3.upload(
      {
        ACL: "public-read",
        Key: `origin/${payload.randomName}.jpg`,
        Body: data,
        ContentType: payload.url.type
      },
      function(err) {
        if (err) {
          alert(err);
        } else {
          alert("good");
        }
      }
    );
  }
};
