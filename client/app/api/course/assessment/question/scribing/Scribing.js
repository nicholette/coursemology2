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


json.question do
  json.(@scribing_question, :id, :title, :description, :staff_only_comments, :maximum_grade,
    :weight)
  json.skill_ids @scribing_question.skills.order('LOWER(title) ASC').as_json(only: [:id, :title])
  json.skills current_course.assessment_skills.order('LOWER(title) ASC') do |skill|
    json.(skill, :id, :title)
  end

  json.published_assessment @assessment.published?
  json.attempt_limit @scribing_question.attempt_limit
end


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
   * Creates a Scribing question
   *
   * @param {object} scribingFields - params in the format of { question_scribing: { :title, :description, etc } }
   * @return {Promise}
   * success response: scribing_question
   * error response: { errors: [{ attribute: string }] }
   */
  create(scribingFields) {
    return this.getClient().post(this._getUrlPrefix(), scribingFields);
  }

  /**
   * Updates a Scribing question
   *
   * @param {number} scribingId
   * @param {object} scribingFields - params in the format of { survey: { :title, :description, etc } }
   * @return {Promise}
   * success response: scribing_question
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
