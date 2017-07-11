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
  'UPDATE_SCRIBING_ANSWER_IN_LOCAL',
  'CLEAR_SAVING_STATUS',
]);

export const popoverTypes = mirrorCreator([
  'TYPE',
  'DRAW',
  'LINE',
  'SHAPE',
  'LAYER',
]);

export const toolColor = mirrorCreator([
  'TYPE',
  'DRAW',
  'LINE',
  'SHAPE_BORDER',
  'SHAPE_FILL',
]);

export const toolThickness = mirrorCreator([
  'DRAW',
  'LINE',
  'SHAPE_BORDER',
])

export const toolLineStyle = mirrorCreator([
  'LINE',
  'SHAPE_BORDER',
]);

export const tools = mirrorCreator([
  'TYPE',
  'DRAW',
  'LINE',
  'SHAPE',
  'SELECT',
  'PAN',
  'ZOOM_IN',
  'ZOOM_OUT',
  'DELETE',
]);

export const shapes = mirrorCreator([
  'RECT',
  'ELLIPSE',
]);
