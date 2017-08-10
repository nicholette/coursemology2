import CourseAPI from 'api/course';
import { SubmissionError } from 'redux-form';
import actions from '../constants';

export function setCanvasLoaded(answerId, loaded) {
  return (dispatch) => {
    dispatch({
      type: actions.SET_CANVAS_LOADED,
      payload: { answerId, loaded },
    });
  };
}

export function clearSavingStatus(answerId) {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_SAVING_STATUS,
      payload: { answerId },
    });
  };
}

export function updateScribingAnswer(answerId, scribblesInJSON) {
  const data = {
    content: scribblesInJSON,
    answer_id: answerId,
  };

  return (dispatch) => {
    dispatch({
      type: actions.UPDATE_SCRIBING_ANSWER_REQUEST,
      payload: { answerId },
    });

    return CourseAPI.answer.scribing.scribings.update(answerId, data)
    .then((response) => {
      dispatch({
        type: actions.UPDATE_SCRIBING_ANSWER_SUCCESS,
        payload: { answerId },
      });
    })
    .catch((error) => {
      dispatch({
        type: actions.UPDATE_SCRIBING_ANSWER_FAILURE,
        payload: { answerId },
      });
      if (error.response && error.response.data) {
        throw new SubmissionError(error.response.data.errors);
      }
    });
  };
}

export function updateScribingAnswerInLocal(answerId, scribblesInJSON) {
  return (dispatch) => {
    dispatch({
      type: actions.UPDATE_SCRIBING_ANSWER_IN_LOCAL,
      payload: {
        scribble: scribblesInJSON,
        answerId,
      },
    });
  };
}
