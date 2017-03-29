import CourseAPI from 'api/course';
import { getCourseId, getAssessmentId, getScribingId } from 'lib/helpers/url-helpers';
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
          scribingId: getScribingId(),
          type: actionTypes.CREATE_SCRIBING_QUESTION_SUCCESS,
          question: response.data,
        });
        const courseId = getCourseId();
        const assessmentId = getAssessmentId();
        window.location.href = `/courses/${courseId}/assessments/${assessmentId}`;
      })
      .catch((error) => {
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
        console.log('successful update', response);
        dispatch({
          scribingId: getScribingId(),
          type: actionTypes.UPDATE_SCRIBING_QUESTION_SUCCESS,
          question: response.data,
        });

        const courseId = getCourseId();
        const assessmentId = getAssessmentId();
        console.log(`/courses/${courseId}/assessments/${assessmentId}/`);
        window.location.href = `/courses/${courseId}/assessments/${assessmentId}/`;
      })
      .catch((error) => {
        console.log('error', error);
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
          scribingId: CourseAPI.scribing.scribings.getScribingId(),
          questionId: question.id,
          type: actionTypes.DELETE_SCRIBING_QUESTION_SUCCESS,
        });
      })
      .catch(() => {
        dispatch({ type: actionTypes.DELETE_SCRIBING_QUESTION_FAILURE });
      });
  };
}






