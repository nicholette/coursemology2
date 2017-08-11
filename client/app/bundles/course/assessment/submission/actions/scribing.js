import CourseAPI from 'api/course';
import { SubmissionError } from 'redux-form';
import actions, { canvasActionTypes } from '../constants';

export function setCanvasLoaded(answerId, loaded, canvas) {
  return (dispatch) => {
    dispatch({
      type: actions.SET_CANVAS_LOADED,
      payload: { answerId, loaded, canvas },
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

export function setToolSelected(answerId, selectedTool) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.SET_TOOL_SELECTED,
      payload: { answerId, selectedTool }
    });
  };
}

export function setFontFamily(answerId, fontFamily) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.SET_FONT_FAMILY,
      payload: { answerId, fontFamily }
    });
  };
}

export function setFontSize(answerId, fontSize) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.SET_FONT_SIZE,
      payload: { answerId, fontSize }
    });
  };
}

export function setLineStyleChip(answerId, toolType, style) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.SET_LINE_STYLE_CHIP,
      payload: { answerId, toolType, style }
    });
  };
}

export function setColoringToolColor(answerId, coloringTool, color) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.SET_COLORING_TOOL_COLOR,
      payload: { answerId, coloringTool, color }
    });
  };
}

export function setToolThickness(answerId, toolType, value) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.SET_TOOL_THICKNESS,
      payload: { answerId, toolType, value }
    });
  };
}

export function setSelectedShape(answerId, selectedShape) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.SET_SELECTED_SHAPE,
      payload: { answerId, selectedShape }
    });
  };
}

export function openHoverToolTip(answerId, toolType) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.OPEN_HOVER_TOOL_TIP,
      payload: { answerId, toolType }
    });
  };
}

export function closeHoverToolTip(answerId, toolType) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.CLOSE_HOVER_TOOL_TIP,
      payload: { answerId }
    });
  };
}

export function openColorPicker(answerId, toolType, popoverColorPickerAnchor) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.OPEN_COLOR_PICKER,
      payload: { answerId, toolType, popoverColorPickerAnchor }
    });
  };
}

export function closeColorPicker(answerId, toolType) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.CLOSE_COLOR_PICKER,
      payload: { answerId, toolType }
    });
  };
}

export function openPopover(answerId, popoverType, popoverAnchor) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.OPEN_POPOVER,
      payload: { answerId, popoverType, popoverAnchor }
    });
  };
}

export function closePopover(answerId, toolType) {
  return (dispatch) => {
    dispatch({
      type: canvasActionTypes.CLOSE_POPOVER,
      payload: { answerId, toolType }
    });
  };
}

