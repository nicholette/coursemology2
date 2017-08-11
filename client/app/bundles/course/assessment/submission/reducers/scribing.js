import actions, { canvasActionTypes, scribingTools, scribingShapes,
      scribingToolColor, scribingToolThickness, scribingToolLineStyle,
      scribingPopoverTypes } from '../constants';

// Shape of every scribing answer
  // {
  //    answer: {
  //     scribbles: [],
  //     image_path: '',
  //     user_id: undefined,
  //     answer_id: undefined,
  //   },
  //   canvas: fabric.Canvas
  //   isCanvasLoaded: false,
  //   isLoading: false,
  //   isSaving: false,
  //   isSaved: false,
  //   hasError: false,
  // }
  // 

function initializeToolColor() {
  const colors = {};
  Object.values(scribingToolColor).forEach(toolType =>
   (colors[toolType] = '#000000')
  );
  return colors;
}

function initializeToolThickness() {
  const thickness = {};
  Object.values(scribingToolThickness).forEach(toolType =>
   (thickness[toolType] = 1)
  );
  return thickness;
};

function initializeLineStyles() {
  const lineStyles = {};
  Object.values(scribingToolLineStyle).forEach(toolType =>
   (lineStyles[toolType] = 'solid')
  );
  return lineStyles;
};

function initializeColorDropdowns() {
  const colorDropdowns = {};
  Object.values(scribingToolColor).forEach(toolType =>
   (colorDropdowns[toolType] = false)
  );
  return colorDropdowns;
};

function initializePopovers() {
  const popovers = {};
  Object.values(scribingPopoverTypes).forEach(popoverType =>
   (popovers[popoverType] = false)
  );
  return popovers;
};

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
              selectedTool: scribingTools.SELECT,
              selectedShape: scribingShapes.RECT,
              hoveredToolTip: '',
              imageWidth: 0,
              imageHeight: 0,
              fontFamily: 'Arial',
              fontSize: 12,
              layers: [],
              colors: initializeToolColor(),
              colorDropdowns: initializeColorDropdowns(),
              lineStyles: initializeLineStyles(),
              thickness: initializeToolThickness(),
              popovers: initializePopovers(),
              popoverAnchor: undefined,
              popoverColorPickerAnchor: undefined,
              viewportLeft: 0,
              viewportTop: 0,
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
      const { answerId, loaded, canvas } = action.payload;
      console.log('loaded', loaded);
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          canvas,
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

    case canvasActionTypes.SET_TOOL_SELECTED: {
      const { answerId, selectedTool } = action.payload;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          selectedTool,
        },
      }
    }

    case canvasActionTypes.SET_FONT_FAMILY: {
      const { answerId, fontFamily } = action.payload;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          fontFamily,
        },
      };
    }

    case canvasActionTypes.SET_FONT_SIZE: {
      const { answerId, fontSize } = action.payload;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          fontSize,
        },
      };
    }

    case canvasActionTypes.SET_LINE_STYLE_CHIP: {
      const { answerId, toolType, style } = action.payload;
      const { lineStyles } = state[answerId];
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          lineStyles: { ...lineStyles, [toolType]: style },
        },
      };
    }

    case canvasActionTypes.SET_COLORING_TOOL_COLOR: {
      const { answerId, coloringTool, color } = action.payload;
      const { colors } = state[answerId];
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          colors: { ...colors, [coloringTool]: color },
        },
      };
    }

    case canvasActionTypes.SET_TOOL_THICKNESS: {
      const { answerId, toolType, value } = action.payload;
      const { thickness } = state[answerId];
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          thickness: { ...thickness, [toolType]: value },
        },
      };
    }

    case canvasActionTypes.SET_SELECTED_SHAPE: {
      const { answerId, selectedShape } = action.payload;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          selectedShape,
        },
      };
    }

    case canvasActionTypes.OPEN_HOVER_TOOL_TIP: {
      const { answerId, hoveredToolTip } = action.payload;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          hoveredToolTip,
        },
      };
    }

    case canvasActionTypes.CLOSE_HOVER_TOOL_TIP: {
      const { answerId } = action.payload;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          hoveredToolTip: '',
        },
      };
    }


    case canvasActionTypes.OPEN_COLOR_PICKER: {
      const { answerId, toolType, popoverColorPickerAnchor } = action.payload;
      const { popovers } = state;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          popovers: { ...popovers, [toolType]: true },
          popoverColorPickerAnchor,
        },
      };
    }

    case canvasActionTypes.OPEN_POPOVER: {
      const { answerId, popoverType, popoverAnchor } = action.payload;
      const { popovers } = state;
      return {
        ...state,        
        [answerId]: {
          ...state[answerId],
          popovers: { ...popovers, [popoverType]: true },
          popoverAnchor,
        },
      };
    }

    case canvasActionTypes.CLOSE_COLOR_PICKER:
    case canvasActionTypes.CLOSE_POPOVER: {
      const { answerId, toolType } = action.payload;
      const { popovers } = state;
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          popovers: { ...popovers, [toolType]: false },
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
