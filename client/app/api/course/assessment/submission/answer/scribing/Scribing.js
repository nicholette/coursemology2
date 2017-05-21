import BaseSubmissionAPI from '../../Base';

export default class ScribingsAPI extends BaseSubmissionAPI {
  /**
   * scribing_answer = {
   *   scribbles: [string],
   * }
   */

  /**
   * Fetches a Scribing answer
   *
   * @param {number} scribingId
   * @return {Promise}
   * success response: scribing_answer
   */
  // TODO:
  fetch(answerId) {
    return this.getClient().get(`${this._getUrlPrefix()}/${answerId}/scribing/${answerId}`);
  }

  /**
   * Updates a Scribble
   */
  update(answerId, data) {
    return this.getClient().post(`${this._getUrlPrefix()}/${answerId}/scribing/scribbles`, data);
  }

  _getUrlPrefix() {
    return `/courses/${this.getCourseId()}/assessments/${this.getAssessmentId()}/submissions/${this.getSubmissionId()}/answers`;
  }
}
