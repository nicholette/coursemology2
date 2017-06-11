import mirrorCreator from 'mirror-creator';

export const formNames = mirrorCreator([
  'QUESTION_SCRIBING',
]);

export const questionNamePrefix = 'question_scribing.';
export const questionIdPrefix = 'question_scribing_';

const actionTypes = mirrorCreator([
  'SCRIBING_QUESTION_UPDATE',
  'SKILLS_UPDATE',
  'EDITOR_MODE_UPDATE',
  'HAS_ERROR_CLEAR',
  'SUBMISSION_MESSAGE_SET',
  'SUBMISSION_MESSAGE_CLEAR',
  'SUBMIT_FORM_LOADING',
  'SUBMIT_FORM_SUCCESS',
  'SUBMIT_FORM_FAILURE',
  'VALIDATION_ERRORS_SET',
  'CREATE_RESPONSE_REQUEST',
  'CREATE_RESPONSE_FAILURE',
  'LOAD_RESPONSE_REQUEST',
  'UPDATE_RESPONSE_REQUEST',
  'UPDATE_RESPONSE_FAILURE',
  'NEW_SCRIBING_QUESTION_REQUEST',
  'NEW_SCRIBING_QUESTION_SUCCESS',
  'NEW_SCRIBING_QUESTION_FAILURE',
  'FETCH_SCRIBING_QUESTION_REQUEST',
  'FETCH_SCRIBING_QUESTION_SUCCESS',
  'FETCH_SCRIBING_QUESTION_FAILURE',
  'CREATE_SCRIBING_QUESTION_REQUEST',
  'CREATE_SCRIBING_QUESTION_SUCCESS',
  'CREATE_SCRIBING_QUESTION_FAILURE',
  'UPDATE_SCRIBING_QUESTION_REQUEST',
  'UPDATE_SCRIBING_QUESTION_SUCCESS',
  'UPDATE_SCRIBING_QUESTION_FAILURE',
  'DELETE_SCRIBING_QUESTION_REQUEST',
  'DELETE_SCRIBING_QUESTION_FAILURE',
  'CLEAR_SUBMIT_ERROR',
]);

export default actionTypes;
