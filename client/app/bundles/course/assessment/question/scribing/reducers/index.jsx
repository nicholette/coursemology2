import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import scribingQuestionReducer from './scribingQuestionReducer';

export default combineReducers({
  scribingQuestion: scribingQuestionReducer,
  form: formReducer,
});
