/* eslint class-methods-use-this: "off" */
import BaseAssessmentAPI from '../Base';

/** Survey level Api helpers should be defined here */
export default class BaseSubmissionAPI extends BaseAssessmentAPI {
  getSubmissionId() {
    const match = window.location.pathname.match(/^\/courses\/\d+\/assessments\/\d+\/submissions\/(\d+)/);
    return match && match[1];
  }
}
