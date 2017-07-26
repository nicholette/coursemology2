/* eslint class-methods-use-this: "off" */
import { getCourseId, getAssessmentId, getSubmissionId } from 'lib/helpers/url-helpers';
import BaseAPI from '../../../../../Base';

export default class ScribingsAPI extends BaseAPI {
  /**
   * Updates a Scribble
   */
  update(answerId, data) {
    return this.getClient().post(`${this._getUrlPrefix()}/${answerId}/scribing/scribbles`, data);
  }

  _getUrlPrefix() {
    return `/courses/${getCourseId()}/assessments/${getAssessmentId()}
            /submissions/${getSubmissionId()}/answers`;
  }
}
