import { combineReducers } from 'redux';
import scribingAnswerReducer, { initialState as scribingAnswerState } from './scribingAnswerReducer';

export const initialStates = {
  scribingAnswer: scribingAnswerState,
};

export default combineReducers({
  scribingAnswer: scribingAnswerReducer,
});
