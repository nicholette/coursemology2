import _ from 'lodash';
import API from 'api';
import CourseAPI from 'api/course';
import { getCourseId, getAssessmentId, getScribingId } from 'lib/helpers/url-helpers';
import { actionTypes } from '../constants';

export function setCanvasLoaded(loaded) {
  return (dispatch) => {
    dispatch({ type: actionTypes.SET_CANVAS_LOADED, loaded });
  }
}

// For using API call to get scribing answer

// export function fetchScribingAnswer(answerId) {
//   return (dispatch) => {
//     dispatch({ type: actionTypes.FETCH_SCRIBING_ANSWER_REQUEST });
//     return CourseAPI.answer.scribing.scribings.fetch(answerId)
//       .then((response) => {
//         dispatch({
//           answerId,
//           type: actionTypes.FETCH_SCRIBING_ANSWER_SUCCESS,
//           data: response.data,
//         });
//       })
//       .catch((error) => {
//         dispatch({ type: actionTypes.FETCH_SCRIBING_ANSWER_FAILURE });
//         if (error.response && error.response.data) {
//           throw new SubmissionError(error.response.data.errors);
//         }
//       });
//   };
// }

// For using data attribute to get scribing answer
export function setUpScribingAnswer(data) {
  return (dispatch) => {
    dispatch({
      answerId: data.scribing_answer.answer_id,
      type: actionTypes.FETCH_SCRIBING_ANSWER_SUCCESS,
      data,
    });
  }
}

export function updateScribingAnswer(answerId, scribblesInJSON) {
  const data = {
    content: scribblesInJSON,
    answer_id: answerId
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

