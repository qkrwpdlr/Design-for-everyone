export default {
  /**
   * @param {Object} payload AWS.s3 object
   */
  _setS3: function(state, payload) {
    state.s3 = payload;
  },
  /**
   * @param {bool} payload
   */
  setUploading: function(state, payload) {
    state.isUploading = payload
  }
};
