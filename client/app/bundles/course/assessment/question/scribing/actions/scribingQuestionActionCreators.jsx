import CourseAPI from 'api/course';
import { browserHistory } from 'react-router';
import { getCourseId, getAssessmentId } from 'lib/helpers/url-helpers';
import { submit, arrayPush, SubmissionError } from 'redux-form';
import actionTypes, { formNames } from '../constants';

export function submitForm() {
  return (dispatch) => {
    dispatch(submit(formNames.SCRIBING_QUESTION));
  };
}

export function onChangeScribingQuestion(field, newValue) {
  return {
    type: actionTypes.SCRIBING_QUESTION_UPDATE,
    field,
    newValue,
  };
}

export function updateSkills(skills) {
  return {
    type: actionTypes.SKILLS_UPDATE,
    skills,
  };
}

export function fetchScribingQuestion(scribingId) {
  return (dispatch) => {
    dispatch({ type: actionTypes.FETCH_SCRIBING_QUESTION_REQUEST });
    return CourseAPI.scribing.scribings.fetch(scribingId)
      .then((response) => {
        console.log('successful fetch');
        dispatch({
          scribingId: CourseAPI.scribing.scribings.getScribingId(),
          type: actionTypes.FETCH_SCRIBING_QUESTION_SUCCESS,
          data: response.data,
        });
      })
      .catch((error) => {
        dispatch({ type: actionTypes.FETCH_SCRIBING_QUESTION_FAILURE });
        if (error.response && error.response.data) {
          throw new SubmissionError(error.response.data.errors);
        }
      });
  }
}

export function createScribingQuestion(
  fields
) {
  return (dispatch) => {
    console.log('1');
    dispatch({ type: actionTypes.CREATE_SCRIBING_QUESTION_REQUEST });
    return CourseAPI.scribing.scribings.create(fields)
      .then((response) => {
        dispatch({
          scribingId: CourseAPI.scribing.responses.getScribingId(),
          type: actionTypes.CREATE_SCRIBING_QUESTION_SUCCESS,
          question: response.data,
        });
        console.log('successful');
        const courseId = getCourseId();
        const assignmentId = getAssignmentId();
        browserHistory.push(`/courses/${courseId}/assignments/${assignmentId}`);
      })
      .catch((error) => {
        console.log('unsuccessful');
        dispatch({ type: actionTypes.CREATE_SCRIBING_QUESTION_FAILURE });
      });
  };
}

export function updateScribingQuestion(
  questionId,
  data
) {
  return (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_SCRIBING_QUESTION_REQUEST });
    return CourseAPI.scribing.scribings.update(questionId, data)
      .then((response) => {
        dispatch({
          scribingId: CourseAPI.scribing.responses.getScribingId(),
          type: actionTypes.UPDATE_SCRIBING_QUESTION_SUCCESS,
          question: response.data,
        });

        const courseId = getCourseId();
        const assignmentId = getAssignmentId();
        browserHistory.push(`/courses/${courseId}/assignments/${assignmentId}`);
      })
      .catch((error) => {
        dispatch({ type: actionTypes.UPDATE_SCRIBING_QUESTION_FAILURE });
        if (error.response && error.response.data) {
          throw new SubmissionError(error.response.data.errors);
        }
      });
  };
}

export function deleteScribingQuestion(
  question,
  successMessage,
  failureMessage
) {
  return (dispatch) => {
    dispatch({ type: actionTypes.DELETE_SCRIBING_QUESTION_REQUEST });
    return CourseAPI.scribing.scribings.delete(question.id)
      .then(() => {
        dispatch({
          scribingId: CourseAPI.scribing.responses.getScribingId(),
          questionId: question.id,
          type: actionTypes.DELETE_SCRIBING_QUESTION_SUCCESS,
        });
      })
      .catch(() => {
        dispatch({ type: actionTypes.DELETE_SCRIBING_QUESTION_FAILURE });
      });
  };
}






