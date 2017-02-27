import axios from 'axios';
import actionTypes from '../constants/scribingQuestionConstants';

export function updateScribingQuestion(field, newValue) {
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

export function setValidationErrors(errors) {
  return {
    type: actionTypes.VALIDATION_ERRORS_SET,
    errors,
  };
}

export function clearHasError() {
  return {
    type: actionTypes.HAS_ERROR_CLEAR,
  };
}

export function clearSubmissionMessage() {
  return {
    type: actionTypes.SUBMISSION_MESSAGE_CLEAR,
  };
}

function setSubmissionMessage(message) {
  return {
    type: actionTypes.SUBMISSION_MESSAGE_SET,
    message,
  };
}

function submitFormLoading(isLoading) {
  return {
    type: actionTypes.SUBMIT_FORM_LOADING,
    isLoading,
  };
}

function submitFormSuccess(data) {
  return {
    type: actionTypes.SUBMIT_FORM_SUCCESS,
    data,
  };
}

function submitFormFailure(error) {
  return {
    type: actionTypes.SUBMIT_FORM_FAILURE,
    error,
  };
}

export function submitForm(url, method, data, failureMessage) {
  return (dispatch) => {
    dispatch(submitFormLoading(true));

    axios({
      method,
      url,
      data,
      headers: { Accept: 'application/json' },
    }).then((response) => {
      const {
        redirect_assessment: redirectAssessment,
        message: successMessage,
      } = response.data;

      if (redirectAssessment) {
        // No need for package evaluation, redirect back to assessment page
        window.location = redirectAssessment;
      } else {
        dispatch(submitFormSuccess(response.data));
        dispatch(submitFormLoading(false));
        dispatch(setSubmissionMessage(successMessage));
      }
    }).catch((error) => {
      dispatch(submitFormFailure(error));
      dispatch(submitFormLoading(false));
      if (error.response) {
        // Server responded with errors.
        const { data: { message, errors } } = error.response;

        if (errors) {
          dispatch(setValidationErrors([{ path: ['save_errors'], error: errors }]));
        } else {
          dispatch(setSubmissionMessage(message || failureMessage));
        }
      } else {
        // Not able to send request.
        dispatch(setSubmissionMessage(error.message));
      }
    });
  };
}
