import _ from 'lodash';
import CourseAPI from 'api/course';
import { getCourseId, getAssessmentId, getScribingId } from 'lib/helpers/url-helpers';
import { submit, SubmissionError } from 'redux-form';
import actionTypes, { formNames } from '../constants';

export function submitForm() {
  return (dispatch) => {
    dispatch(submit(formNames.SCRIBING_QUESTION));
  };
}

export function newScribingQuestion() {
  return (dispatch) => {
    dispatch({ type: actionTypes.NEW_SCRIBING_QUESTION_REQUEST });
    return CourseAPI.question.scribing.scribings.new()
      .then((response) => {
        dispatch({
          type: actionTypes.NEW_SCRIBING_QUESTION_SUCCESS,
          skills: response.data.question.skills,
        });
      })
      .catch((error) => {
        dispatch({ type: actionTypes.NEW_SCRIBING_QUESTION_FAILURE });
        if (error.response && error.response.data) {
          throw new SubmissionError(error.response.data.errors);
        }
      });
  };
}

export function fetchScribingQuestion(scribingId) {
  return (dispatch) => {
    dispatch({ type: actionTypes.FETCH_SCRIBING_QUESTION_REQUEST });
    return CourseAPI.question.scribing.scribings.fetch(scribingId)
      .then((response) => {
        dispatch({
          scribingId: CourseAPI.question.scribing.scribings.getScribingId(),
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
  };
}

// Helper function to convert array of skills to array of skill_ids
function getSkillIdsFromSkills(skills) {
  // Need to return array of empty string if nothing
  // If not, backend will barf
  return (skills.length > 0) ? _.map(skills, 'id') : [''];
}

// Helper function to process form fields before create/update
function processFields(fields) {
  const parsedFields = _.cloneDeep(fields);
  parsedFields.question_scribing.skill_ids =
    getSkillIdsFromSkills(fields.question_scribing.skill_ids);

  if (fields.question_scribing.attachment) {
    parsedFields.question_scribing.file = fields.question_scribing.attachment[0];
  } else {
    delete parsedFields.question_scribing.file;
  }

  delete parsedFields.question_scribing.attachment;

  return parsedFields;
}

export function clearSubmitError() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.CLEAR_SUBMIT_ERROR,
    });
  };
}

export function createScribingQuestion(fields) {
  return (dispatch) => {
    dispatch({ type: actionTypes.CREATE_SCRIBING_QUESTION_REQUEST });
    const parsedFields = processFields(fields);
    CourseAPI.question.scribing.scribings.create(parsedFields)
      .then((response) => {
        dispatch({
          scribingId: getScribingId(),
          type: actionTypes.CREATE_SCRIBING_QUESTION_SUCCESS,
          question: response.data,
          courseId: getCourseId(),
          assessmentId: getAssessmentId(),
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.CREATE_SCRIBING_QUESTION_FAILURE,
          saveErrors: error.response && error.response.data && error.response.data.errors,
        });
      });
  };
}

export function updateScribingQuestion(questionId, fields) {
  return (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_SCRIBING_QUESTION_REQUEST });
    const parsedFields = processFields(fields);
    CourseAPI.question.scribing.scribings.update(questionId, parsedFields)
    .then((response) => {
      dispatch({
        scribingId: getScribingId(),
        type: actionTypes.UPDATE_SCRIBING_QUESTION_SUCCESS,
        question: response.data,
        courseId: getCourseId(),
        assessmentId: getAssessmentId(),
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.UPDATE_SCRIBING_QUESTION_FAILURE,
        saveErrors: error.response && error.response.data && error.response.data.errors,
      });
    });
  };
}

export function deleteScribingQuestion(question) {
  return (dispatch) => {
    dispatch({ type: actionTypes.DELETE_SCRIBING_QUESTION_REQUEST });
    return CourseAPI.question.scribing.scribings.delete(question.id)
      .then(() => {
        dispatch({
          scribingId: CourseAPI.question.scribing.scribings.getScribingId(),
          questionId: question.id,
          type: actionTypes.DELETE_SCRIBING_QUESTION_SUCCESS,
        });
      })
      .catch(() => {
        dispatch({ type: actionTypes.DELETE_SCRIBING_QUESTION_FAILURE });
      });
  };
}

