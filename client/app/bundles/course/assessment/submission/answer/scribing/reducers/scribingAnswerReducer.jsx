import { actionTypes } from '../constants';

export const initialState = {
  answer: {
    scribbles: [],
    image_path: '',
    user_id: undefined,
    answer_id: undefined,
  },
  is_canvas_loaded: false,
  is_loading: false,
  is_saving: false,
  is_saved: false,
  save_errors: undefined,
};

export default function scribingAnswerReducer(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case actionTypes.SET_CANVAS_LOADED: {
      return {
        ...state,
        is_canvas_loaded: action.loaded,
      };
    }
    case actionTypes.FETCH_SCRIBING_ANSWER_REQUEST: {
      return {
        ...state,
        is_loading: true,
        save_errors: undefined,
      };
    }
    case actionTypes.UPDATE_SCRIBING_ANSWER_REQUEST: {
      return {
        ...state,
        is_loading: true,
        is_saving: true,
        save_errors: undefined,
      };
    }
    case actionTypes.FETCH_SCRIBING_ANSWER_SUCCESS: {
      const answer = action.data && action.data.scribing_answer;
      return {
        ...state,
        answer,
        is_loading: false,
      };
    }
    case actionTypes.UPDATE_SCRIBING_ANSWER_SUCCESS: {
      return {
        ...state,
        is_saving: false,
        is_saved: true,
        is_loading: false,
      };
    }
    case actionTypes.FETCH_SCRIBING_ANSWER_FAILURE:
    case actionTypes.UPDATE_SCRIBING_ANSWER_FAILURE:
    case actionTypes.CLEAR_SAVING_STATUS: {
      return {
        ...state,
        is_saving: false,
        is_saved: false,
        is_loading: false,
      };
    }
    case actionTypes.UPDATE_SCRIBING_ANSWER_IN_LOCAL: {
      const scribbles = [];
      state.answer.scribbles.forEach((scribble) => {
        scribbles.push({
          ...scribble,
          content: scribble.creator_id === state.answer.user_id ?
            action.data : scribble.content,
        });
      });

      return {
        ...state,
        scribbles,
      };
    }
    default: {
      return state;
    }
  }
}
