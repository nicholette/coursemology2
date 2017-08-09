// import { actionTypes } from '../constants';

// export const initialState = {
//   answer: {
//     scribbles: [],
//     image_path: '',
//     user_id: undefined,
//     answer_id: undefined,
//   },
//   isCanvasLoaded: false,
//   isLoading: false,
//   isSaving: false,
//   isSaved: false,
//   hasError: false,
// };

// export default function scribingAnswerReducer(state = initialState, action) {
//   const { type } = action;

//   switch (type) {
//     case actionTypes.SET_CANVAS_LOADED: {
//       return {
//         ...state,
//         isCanvasLoaded: action.loaded,
//       };
//     }
//     case actionTypes.FETCH_SCRIBING_ANSWER_REQUEST: {
//       return {
//         ...state,
//         isLoading: true,
//         hasError: false,
//       };
//     }
//     case actionTypes.UPDATE_SCRIBING_ANSWER_REQUEST: {
//       return {
//         ...state,
//         isLoading: true,
//         isSaving: true,
//         hasError: false,
//       };
//     }
//     case actionTypes.FETCH_SCRIBING_ANSWER_SUCCESS: {
//       const answer = action.data && action.data.scribing_answer;
//       return {
//         ...state,
//         answer,
//         isLoading: false,
//         hasError: false,
//       };
//     }
//     case actionTypes.UPDATE_SCRIBING_ANSWER_SUCCESS: {
//       return {
//         ...state,
//         isSaving: false,
//         isSaved: true,
//         isLoading: false,
//         hasError: false,
//       };
//     }
//     case actionTypes.FETCH_SCRIBING_ANSWER_FAILURE:
//     case actionTypes.UPDATE_SCRIBING_ANSWER_FAILURE: {
//       return {
//         ...state,
//         isSaving: false,
//         isSaved: false,
//         isLoading: false,
//         hasError: true,
//       };
//     }
//     case actionTypes.CLEAR_SAVING_STATUS: {
//       return {
//         ...state,
//         isSaving: false,
//         isSaved: false,
//         isLoading: false,
//         hasError: false,
//       };
//     }
//     case actionTypes.UPDATE_SCRIBING_ANSWER_IN_LOCAL: {
//       const scribbles = [];
//       state.answer.scribbles.forEach((scribble) => {
//         scribbles.push({
//           ...scribble,
//           content: scribble.creator_id === state.answer.user_id ?
//             action.data : scribble.content,
//         });
//       });

//       return {
//         ...state,
//         answer: { ...state.answer, scribbles },
//       };
//     }
//     default: {
//       return state;
//     }
//   }
// }
