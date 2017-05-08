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
   * Updates a Scribing answer
   *
   * @param {number} answerId
   * @param {object} data - params in the format of
   *                                { scribing_answer: { scribbles: [string] } }
   * @return {Promise}
   * success response: scribing_answer
   * error response: { errors: [{ attribute: string }] }
   */
  update(answerId, data) {
    return this.getClient().patch(`${this._getUrlPrefix()}/${answerId}/scribing/${answerId}`, data);
  }

  _getUrlPrefix() {
    return `/courses/${this.getCourseId()}/assessments/${this.getAssessmentId()}/submissions/${this.getSubmissionId()}/answers`;
  }
}
