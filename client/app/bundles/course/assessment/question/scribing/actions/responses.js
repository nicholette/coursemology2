import { browserHistory } from 'react-router';
import { SubmissionError } from 'redux-form';
import CourseAPI from 'api/course';
import actionTypes from '../constants/scribingQuestionConstants';

export function createResponse(scribingId) {
  const courseId = CourseAPI.scribing.responses.getCourseId();
  const assessmentId = CourseAPI.scribing.responses.getAssessmentId();
  const goToResponse = responseId => browserHistory.push(
    `/courses/${courseId}/assessments/${assessmentId}/question/scribing/${scribingId}/responses/${responseId}`
  );
  return (dispatch) => {
    dispatch({ type: actionTypes.CREATE_RESPONSE_REQUEST });

    return CourseAPI.scribing.responses.create(scribingId)
        .then((response) => {
        goToResponse(response.data.response.id);
    dispatch({
      type: actionTypes.CREATE_RESPONSE_SUCCESS,
      scribing: response.data.scribing,
      response: response.data.response,
    });
  })
  .catch((error) => {
      dispatch({ type: actionTypes.CREATE_RESPONSE_FAILURE });
    if (!error.response || !error.response.data) { return; }
    if (error.response.data.responseId) {
      goToResponse(error.response.data.responseId);
    }
  });
  };
}

export function fetchResponse(responseId) {
  return (dispatch) => {
    dispatch({ type: actionTypes.LOAD_RESPONSE_REQUEST });

    return CourseAPI.scribing.responses.fetch(responseId)
      .then((response) => {
      dispatch({
        type: actionTypes.LOAD_RESPONSE_SUCCESS,
        scribing: response.data.scribing,
        response: response.data.response,
  });
  })
  .catch(() => {
      dispatch({ type: actionTypes.LOAD_RESPONSE_FAILURE });
  });
  };
}

export function updateResponse(
  responseId,
  payload,
  successMessage,
  failureMessage
) {
  return (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_RESPONSE_REQUEST });

    return CourseAPI.scribing.responses.update(responseId, payload)
      .then((response) => {
      dispatch({
        type: actionTypes.UPDATE_RESPONSE_SUCCESS,
      scribing: response.data.scribing,
      response: response.data.response,
  });

    if (payload.response.submit) {
      const courseId = CourseAPI.scribing.responses.getCourseId();
      const assessmentId = CourseAPI.scribing.responses.getAssessmentId();
      browserHistory.push(`/courses/${courseId}/assessments/${assessmentId}/question/scribing/`)
    }
  })
  .catch((error) => {
      dispatch({ type: actionTypes.UPDATE_RESPONSE_FAILURE });
    if (error.response && error.response.data) {
      throw new SubmissionError(error.response.data.errors);
    }
  });
  };
}
