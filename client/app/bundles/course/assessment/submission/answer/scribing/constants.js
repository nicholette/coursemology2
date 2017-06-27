import mirrorCreator from 'mirror-creator';

export const actionTypes = mirrorCreator([
  'SET_CANVAS_LOADED',
  'FETCH_SCRIBING_QUESTION_REQUEST',
  'FETCH_SCRIBING_QUESTION_SUCCESS',
  'FETCH_SCRIBING_QUESTION_FAILURE',
  'FETCH_SCRIBING_ANSWER_REQUEST',
  'FETCH_SCRIBING_ANSWER_SUCCESS',
  'FETCH_SCRIBING_ANSWER_FAILURE',
  'UPDATE_SCRIBING_ANSWER_REQUEST',
  'UPDATE_SCRIBING_ANSWER_SUCCESS',
  'UPDATE_SCRIBING_ANSWER_FAILURE',
  'CLEAR_SAVING_STATUS',
]);

export const tools = mirrorCreator([
  'DRAW',
  'SELECT',
  'DELETE',
]);
