import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import scribingAnswerReducer, { initialState as scribingAnswerState } from './scribingAnswerReducer';

export const initialStates = {
  scribingAnswer: scribingAnswerState,
};

export default combineReducers({
  scribingAnswer: scribingAnswerReducer,
});
