import BaseScribingAPI from './Base';

export default class ScribingsAPI extends BaseScribingAPI {
  /**
   * scribing_question = {
  *   id: number,
  *   title: string,
  *   description: string,
  *   staff_only_comments: string,
  *   maximum_grade: string,
  *   weight: number,
  *   skill_ids [],
  *   skills: [],
  *   published_assessment: boolean,
  *   attempt_limit: number,
  * }
   */

  /**
   * Fetches a Scribing question
   *
   * @param {number} scribingId
   * @return {Promise}
   * success response: scribing_question
   */
  fetch(scribingId) {
    return this.getClient().get(`${this._getUrlPrefix()}/${scribingId}`);
  }

  /**
   * Helper method to generate FormData
   *
   * @param {object} question object to be converted
   * @return {FormData}
   */
  static generateInnerFormData(question) {
    const innerFormData = new FormData();

    Object.keys(question).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(question, key)) {
        const value = question[key];
        if (Array.isArray(value)) {
          value.forEach((val) => {
            innerFormData.append(`question_scribing[${key}][]`, val);
          });
        } else {
          innerFormData.append(`question_scribing[${key}]`, value);
        }
      }
    });

    return innerFormData;
  }

  /**
   * Creates a Scribing question
   *
   * @param {object} scribingFields - params in the format of
   *                                { question_scribing: { :title, :description, etc } }
   * @return {Promise}
   * success response: scribing_question
   * error response: { errors: [{ attribute: string }] }
   */
  create(scribingFields) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'file_types',
      },
    };
    const innerFormData = ScribingsAPI.generateInnerFormData(scribingFields.question_scribing);

    return this.getClient().post(this._getUrlPrefix(), innerFormData, config);
  }

  /**
   * Updates a Scribing question
   *
   * @param {number} scribingId
   * @param {object} scribingFields - params in the format of
   *                                { survey: { :title, :description, etc } }
   * @return {Promise}
   * success response: scribing_question
   * error response: { errors: [{ attribute: string }] }
   */
  update(scribingId, scribingFields) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'file_types',
      },
    };
    const innerFormData = ScribingsAPI.generateInnerFormData(scribingFields.question_scribing);

    return this.getClient().patch(`${this._getUrlPrefix()}/${scribingId}`, innerFormData, config);
  }

  /**
   * Deletes a Scribing question
   *
   * @param {number} scribingId
   * @return {Promise}
   * success response: {}
   * error response: {}
   */
  delete(scribingId) {
    return this.getClient().delete(`${this._getUrlPrefix()}/${scribingId}`);
  }

  _getUrlPrefix() {
    return `/courses/${this.getCourseId()}/assessments/${this.getAssessmentId()}/question/scribing`;
  }
}
