import actions from '../constants';

// Shape of every scribing answer
  // {
  //    answer: {
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
  // }

export default function (state = {}, action) {
  switch (action.type) {
    case actions.FETCH_SUBMISSION_SUCCESS:
      return {
        ...state,
        ...action.payload.answers.reduce((obj, answer) =>
          ({
            ...obj,
            [answer.fields.id]: {
              answer: { ...answer.scribing_answer },
              isCanvasLoaded: false,
              isLoading: false,
              isSaving: false,
              isSaved: false,
              hasError: false,
            },
          })
        , {}),
      };
    case actions.SET_CANVAS_LOADED: {
      const { answerId, loaded } = action.payload;
      console.log('loaded', loaded);
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          isCanvasLoaded: loaded,
        }
      };
    }
    // case actions.FETCH_SCRIBING_ANSWER_REQUEST: {
    //   const { answerId } = action.payload;
    //   return {
    //     ...state,
    //     [answerId]: {
    //       ...state[answerId],
    //       isLoading: true,
    //       hasError: false,
    //     }
    //   };
    // }
    case actions.UPDATE_SCRIBING_ANSWER_REQUEST: {
      const { answerId } = action.payload;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          isLoading: true,
          isSaving: true,
          hasError: false,
        }
      };
    }
    // case actions.FETCH_SCRIBING_ANSWER_SUCCESS: {
    //   const answer = action.payload.data && action.payload.data.scribing_answer;
    //   const answerId = action.payload.answerId;
    //   return {
    //     ...state,
    //     [answerId]: {
    //       ...state[answerId],
    //       answer,
    //       isLoading: false,
    //       hasError: false,
    //     }
    //   };
    // }
    case actions.UPDATE_SCRIBING_ANSWER_SUCCESS: {
      const { answerId } = action.payload;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          isSaving: false,
          isSaved: true,
          isLoading: false,
          hasError: false,
        }
      };
    }
    // case actions.FETCH_SCRIBING_ANSWER_FAILURE:
    case actions.UPDATE_SCRIBING_ANSWER_FAILURE: {
      const { answerId } = action.payload;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          isSaving: false,
          isSaved: false,
          isLoading: false,
          hasError: true,
        }
      };
    }
    case actions.CLEAR_SAVING_STATUS: {
      const { answerId } = action.payload;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          isSaving: false,
          isSaved: false,
          isLoading: false,
          hasError: false,
        }
      };
    }
    case actions.UPDATE_SCRIBING_ANSWER_IN_LOCAL: {
      const { answerId } = action.payload;
      const scribbles = [];
      state[answerId].answer.scribbles.forEach((scribble) => {
        scribbles.push({
          ...scribble,
          content: scribble.creator_id === state[answerId].answer.user_id ?
            action.payload.scribble : scribble.content,
        });
      });

      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          answer: { ...state[answerId].answer, scribbles },
        },
      };
    }
    default: {
      return state;
    }
  }
}



// const initialState = {
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

// export default function (state = initialState, action) {
//   const { type } = action;

//   switch (type) {
//     case actions.SET_CANVAS_LOADED: {
//       return {
//         ...state,
//         isCanvasLoaded: action.loaded,
//       };
//     }
//     case actions.FETCH_SCRIBING_ANSWER_REQUEST: {
//       return {
//         ...state,
//         isLoading: true,
//         hasError: false,
//       };
//     }
//     case actions.UPDATE_SCRIBING_ANSWER_REQUEST: {
//       return {
//         ...state,
//         isLoading: true,
//         isSaving: true,
//         hasError: false,
//       };
//     }
//     case actions.FETCH_SCRIBING_ANSWER_SUCCESS: {
//       const answer = action.data && action.data.scribing_answer;
//       return {
//         ...state,
//         answer,
//         isLoading: false,
//         hasError: false,
//       };
//     }
//     case actions.UPDATE_SCRIBING_ANSWER_SUCCESS: {
//       return {
//         ...state,
//         isSaving: false,
//         isSaved: true,
//         isLoading: false,
//         hasError: false,
//       };
//     }
//     case actions.FETCH_SCRIBING_ANSWER_FAILURE:
//     case actions.UPDATE_SCRIBING_ANSWER_FAILURE: {
//       return {
//         ...state,
//         isSaving: false,
//         isSaved: false,
//         isLoading: false,
//         hasError: true,
//       };
//     }
//     case actions.CLEAR_SAVING_STATUS: {
//       return {
//         ...state,
//         isSaving: false,
//         isSaved: false,
//         isLoading: false,
//         hasError: false,
//       };
//     }
//     case actions.UPDATE_SCRIBING_ANSWER_IN_LOCAL: {
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
