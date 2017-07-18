import BaseAPI from '../../../../Base';
import { getCourseId, getAssessmentId, getScribingId } from 'lib/helpers/url-helpers';

export default class ScribingsAPI extends BaseAPI {
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
   * Fetches a Scribing question with initial attributes
   *
   * @return {Promise}
   * success response: scribing_question
   */
  new() {
    return this.getClient().get(`${this._getUrlPrefix()}/new`);
  }

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
  static generateFormData(question) {
    const formData = new FormData();

    Object.keys(question).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(question, key)) {
        const value = question[key];
        if (Array.isArray(value)) {
          value.forEach((val) => {
            formData.append(`question_scribing[${key}][]`, val);
          });
        } else {
          formData.append(`question_scribing[${key}]`, value);
        }
      }
    });

    return formData;
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
    const formData = ScribingsAPI.generateFormData(scribingFields.question_scribing);

    return this.getClient().post(this._getUrlPrefix(), formData, config);
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
    const formData = ScribingsAPI.generateFormData(scribingFields.question_scribing);

    return this.getClient().patch(`${this._getUrlPrefix()}/${scribingId}`, formData, config);
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
    return `/courses/${getCourseId()}/assessments/${getAssessmentId()}/question/scribing`;
  }
}
