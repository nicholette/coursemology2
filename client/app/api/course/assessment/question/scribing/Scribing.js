import BaseScribingAPI from './Base';

export default class ScribingsAPI extends BaseScribingAPI {
  /**
   * survey_with_questions = {
  *   id: number, title: string, description: string, start_at: datetime, ...etc
  *      - Survey attributes
  *   canCreateSection: bool,
  *      - true if user can create sections for this survey
  *   canViewResults: bool,
  *      - true if user can view results for this survey
  *   canUpdate: bool, canDelete: bool,
  *      - true if user can update and delete this survey respectively
  *   sections:
  *     Array.<{
  *       id: number, title: string, weight: number, ...etc
  *         - Section attributes
  *       questions: Array.<{ description: string, options: Array, question_type: string, ...etc }>,
  *          - Array of questions belonging to the survey
  *          - question_type is one of ['text', 'multiple_choice', 'multiple_response']
  *     }>
  * }
   */

  /**
   * Fetches a Scribing question
   *
   * @param {number} scribingId
   * @return {Promise}
   * success response: survey_with_questions
   */
  fetch(scribingId) {
    return this.getClient().get(`${this._getUrlPrefix()}/${scribingId}`);
  }

  /**
   * Creates a Scribing question
   *
   * @param {object} surveyFields - params in the format of { survey: { :title, :description, etc } }
   * @return {Promise}
   * success response: survey_with_questions
   * error response: { errors: [{ attribute: string }] }
   */
  create(scribingFields) {
    return this.getClient().post(this._getUrlPrefix(), scribingFields);
  }

  /**
   * Updates a Scribing question
   *
   * @param {number} surveyId
   * @param {object} surveyFields - params in the format of { survey: { :title, :description, etc } }
   * @return {Promise}
   * success response: survey_with_questions
   * error response: { errors: [{ attribute: string }] }
   */
  update(scribingId, scribingFields) {
    return this.getClient().patch(`${this._getUrlPrefix()}/${scribingId}`, scribingFields);
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
