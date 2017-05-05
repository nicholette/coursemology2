import mirrorCreator from 'mirror-creator';

const actionTypes = mirrorCreator([
  'FETCH_SCRIBING_QUESTION_REQUEST',
  'FETCH_SCRIBING_QUESTION_SUCCESS',
  'FETCH_SCRIBING_QUESTION_FAILURE',
]);

export default actionTypes;
