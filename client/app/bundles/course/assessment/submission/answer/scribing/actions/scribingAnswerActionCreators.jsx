import _ from 'lodash';
import API from 'api';
import CourseAPI from 'api/course';
import { getCourseId, getAssessmentId, getScribingId } from 'lib/helpers/url-helpers';
import actionTypes from '../constants';

export function fetchScribingQuestion(scribingId) {
  console.log('here again');
  return (dispatch) => {
    dispatch({ type: actionTypes.FETCH_SCRIBING_QUESTION_REQUEST });
    return CourseAPI.scribing.scribings.fetch(scribingId)
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

