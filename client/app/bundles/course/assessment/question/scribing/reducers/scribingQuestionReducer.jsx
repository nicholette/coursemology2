import actionTypes from '../constants';

export const initialState = {
  question: {
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
    attachment_reference: {
      name: '',
      path: '',
      updater_name: '',
    },
  },
  is_loading: false,
  is_submitting: false,
  save_errors: undefined,
  error: false,
};

// Helper function to redirect to assessment main page
function redirectToAssessment(courseId, assessmentId) {
  window.location.href = `/courses/${courseId}/assessments/${assessmentId}`;
}

export default function scribingQuestionReducer(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case actionTypes.FETCH_SCRIBING_QUESTION_REQUEST:
      return {
        ...state,
        is_loading: true,
        is_submitting: false,
        save_errors: undefined,
        error: false,
      };
    case actionTypes.CREATE_SCRIBING_QUESTION_REQUEST:
    case actionTypes.UPDATE_SCRIBING_QUESTION_REQUEST: {
      return {
        ...state,
        is_loading: false,
        is_submitting: true,
        save_errors: undefined,
        error: false,
      };
    }
    case actionTypes.FETCH_SCRIBING_QUESTION_SUCCESS: {
      const { question } = action.data;
      // Returned value from server is in string, requires int
      question.maximum_grade = parseInt(question.maximum_grade, 10);
      return {
        ...state,
        question,
        is_loading: false,
        is_submitting: false,
        save_errors: undefined,
        error: false,
      };
    }
    case actionTypes.CREATE_SCRIBING_QUESTION_SUCCESS:
    case actionTypes.UPDATE_SCRIBING_QUESTION_SUCCESS: {
      const { courseId, assessmentId } = action;
      redirectToAssessment(courseId, assessmentId);
      return {
        ...state,
        is_loading: false,
        is_submitting: true, // to provide transition to assessment page
        save_errors: undefined,
        error: false,
      };
    }
    case actionTypes.FETCH_SCRIBING_QUESTION_FAILURE: {
      return {
        ...state,
        is_loading: false,
        is_submitting: false,
        error: true,
      };
    }
    case actionTypes.CREATE_SCRIBING_QUESTION_FAILURE:
    case actionTypes.UPDATE_SCRIBING_QUESTION_FAILURE: {
      return {
        ...state,
        is_loading: false,
        is_submitting: false,
        save_errors: action.save_errors,
        error: true,
      };
    }
    case actionTypes.CLEAR_SUBMIT_ERROR: {
      return {
        ...state,
        error: false,
      };
    }
    default: {
      return state;
    }
  }
}
