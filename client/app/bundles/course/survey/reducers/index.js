import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import surveys from './surveys';
import surveyForm from './surveyForm';
import questionForm from './questionForm';
import responseForm from './responseForm';
import sectionForm from './sectionForm';
import deleteConfirmation from './deleteConfirmation';
import notification from './notification';
import surveysFlags from './surveysFlags';
import results from './results';
import responses from './responses';


export default combineReducers({
  surveys,
  responses,
  results,
  surveyForm,
  questionForm,
  responseForm,
  sectionForm,
  deleteConfirmation,
  notification,
  surveysFlags,
  form: formReducer,
});
