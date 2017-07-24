import { getCourseId, getAssessmentId, getScribingId } from 'lib/helpers/url-helpers';
import BaseAPI from '../../../../../Base';

export default class ScribingsAPI extends BaseAPI {
  /**
   * Updates a Scribble
   */
  update(answerId, data) {
    return this.getClient().post(`${this._getUrlPrefix()}/${answerId}/scribing/scribbles`, data);
  }

  _getUrlPrefix() {
    return `/courses/${this.getCourseId()}/assessments/${this.getAssessmentId()}
            /submissions/${this.getSubmissionId()}/answers`;
  }
}
