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
    attachment_reference: {
      name: '',
      path: '',
      updater_name: '',
    },
  },
  isLoading: false,
  isSubmitting: false,
  saveErrors: undefined,
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
        isLoading: true,
        isSubmitting: false,
        saveErrors: undefined,
        error: false,
      };
    case actionTypes.CREATE_SCRIBING_QUESTION_REQUEST:
    case actionTypes.UPDATE_SCRIBING_QUESTION_REQUEST: {
      return {
        ...state,
        isLoading: false,
        isSubmitting: true,
        saveErrors: undefined,
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
        isLoading: false,
        isSubmitting: false,
        saveErrors: undefined,
        error: false,
      };
    }
    case actionTypes.CREATE_SCRIBING_QUESTION_SUCCESS:
    case actionTypes.UPDATE_SCRIBING_QUESTION_SUCCESS: {
      const { courseId, assessmentId } = action;
      redirectToAssessment(courseId, assessmentId);
      return {
        ...state,
        isLoading: false,
        isSubmitting: true, // to provide transition to assessment page
        saveErrors: undefined,
        error: false,
      };
    }
    case actionTypes.FETCH_SCRIBING_QUESTION_FAILURE: {
      return {
        ...state,
        isLoading: false,
        isSubmitting: false,
        error: true,
      };
    }
    case actionTypes.CREATE_SCRIBING_QUESTION_FAILURE:
    case actionTypes.UPDATE_SCRIBING_QUESTION_FAILURE: {
      return {
        ...state,
        isLoading: false,
        isSubmitting: false,
        saveErrors: action.saveErrors,
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
