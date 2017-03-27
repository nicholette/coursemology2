import actionTypes from '../constants';

export const initialState = {
  question: {
    assessment_id: null,
    id: null,
    title: '',
    description: '',
    staff_only_comments: '',
    maximum_grade: 0,
    weight: 0,
    skill_ids: [],
    skills: [],
    published_assessment: false,
    attempt_limit: null,
  },
};

function questionReducer(state, action) {
  const { type } = action;
  switch (type) {
    case actionTypes.SCRIBING_QUESTION_UPDATE: {
      const { field, newValue } = action;
      return {
        ...state,
        [field]: newValue,
        error: {...state.error, [field]: undefined }
      };
    }
    case actionTypes.SKILLS_UPDATE: {
      const { skills } = action;
      return {
        ...state,
        skill_ids: skills
      };
    }
    default: {
      return state;
    }
  }
}

function apiReducer(state, action) {
  const { type } = action;

  switch (type) {
    case actionTypes.SUBMIT_FORM_LOADING: {
      const { isLoading } = action;
      return {
        ...state,
        is_loading: isLoading,
        save_errors: undefined
      };
    }
    case actionTypes.SUBMIT_FORM_SUCCESS: {
      const { form_data, question } = action.data;
      return {
        ...state,
        question,
        form_data,
      }
    }
    case actionTypes.SUBMIT_FORM_FAILURE: {
      return state;
    }
    default: {
      return state;
    }
  }
}

export default function scribingQuestionReducer(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case actionTypes.SKILLS_UPDATE:
    case actionTypes.SCRIBING_QUESTION_UPDATE: {
      return {
        ...state,
        question: questionReducer(state.question, action)
      };
    }
    case actionTypes.SUBMIT_FORM_LOADING:
    case actionTypes.SUBMIT_FORM_SUCCESS:
    case actionTypes.SUBMIT_FORM_FAILURE: {
      return apiReducer(state, action);
    }
    case actionTypes.VALIDATION_ERRORS_SET: {
      const { errors } = action;
      let newState = state;

      errors.forEach((error) => {
        newState = newState.error[error.path] = error.error;
      });

      return {
        ...newState,
        has_errors: errors.length !== 0
      }
    }
    case actionTypes.HAS_ERROR_CLEAR: {
      return {
        ...state,
        has_errors: false
      };
    }
    case actionTypes.SUBMISSION_MESSAGE_SET: {
      const { message } = action;
      return {
        ...state,
        show_submission_message: true,
        submission_message: message
      };
    }
    case actionTypes.SUBMISSION_MESSAGE_CLEAR: {
      return {
        ...state,
        show_submission_message: false,
        submission_message: ''
      };
    }
    default: {
      return state;
    }
  }
}
