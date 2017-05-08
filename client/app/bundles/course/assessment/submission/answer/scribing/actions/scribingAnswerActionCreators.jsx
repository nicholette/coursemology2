import _ from 'lodash';
import API from 'api';
import CourseAPI from 'api/course';
import { getCourseId, getAssessmentId, getScribingId } from 'lib/helpers/url-helpers';
import actionTypes from '../constants';

export function fetchScribingQuestion(scribingId) {
  console.log('here again');
  return (dispatch) => {
    dispatch({ type: actionTypes.FETCH_SCRIBING_QUESTION_REQUEST });
    return CourseAPI.question.scribing.scribings.fetch(scribingId)
      .then((response) => {
        console.log('success', response.data)
        dispatch({
          scribingId,
          type: actionTypes.FETCH_SCRIBING_QUESTION_SUCCESS,
          data: response.data,
        });
      })
      .catch((error) => {
        console.log('error', error)
        dispatch({ type: actionTypes.FETCH_SCRIBING_QUESTION_FAILURE });
        if (error.response && error.response.data) {
          throw new SubmissionError(error.response.data.errors);
        }
      });
  };
}

export function fetchScribingAnswer(answerId) {
  return (dispatch) => {
    dispatch({ type: actionTypes.FETCH_SCRIBING_ANSWER_REQUEST });
    return CourseAPI.answer.scribing.scribings.fetch(answerId)
      .then((response) => {
        console.log('success', response.data)
        dispatch({
          answerId,
          type: actionTypes.FETCH_SCRIBING_ANSWER_SUCCESS,
          data: response.data,
        });
      })
      .catch((error) => {
        console.log('error', error)
        dispatch({ type: actionTypes.FETCH_SCRIBING_ANSWER_FAILURE });
        if (error.response && error.response.data) {
          throw new SubmissionError(error.response.data.errors);
        }
      });
  };
}

// scribblesinSVG: array of scribbles in SVG
export function updateScribingAnswer(answerId, scribblesInSvg) {
  const data = {
    scribing_answer: {
      scribbles: scribblesInSvg,
    },
  }

  return (dispatch) => {
    CourseAPI.answer.scribing.scribings.update(answerId, data)
    .then((response) => {
      dispatch({
        answerId,
        type: actionTypes.UPDATE_SCRIBING_ANSWER_SUCCESS,
        data: response.data,
      });
    })
    .catch((error) => {
      dispatch({ type: actionTypes.UPDATE_SCRIBING_ANSWER_FAILURE });
      if (error.response && error.response.data) {
        throw new SubmissionError(error.response.data.errors);
      }
    });
  };
}

