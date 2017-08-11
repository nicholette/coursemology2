/* eslint no-mixed-operators: "off" */
/* eslint react/sort-comp: "off" */
import React, { PropTypes } from 'react';
import { Canvas } from 'react-fabricjs'; // eslint-disable-line no-unused-vars
import { injectIntl, intlShape } from 'react-intl';

import FontIcon from 'material-ui/FontIcon';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MaterialTooltip from 'material-ui/internal/Tooltip';
import LoadingIndicator from 'lib/components/LoadingIndicator';

import SavingIndicator from './SavingIndicator';
import ToolDropdown from './ToolDropdown';
import LayersComponent from './LayersComponent';
import TypePopover from './popovers/TypePopover';
import DrawPopover from './popovers/DrawPopover';
import LinePopover from './popovers/LinePopover';
import ShapePopover from './popovers/ShapePopover';

import ScribingToolbar from './ScribingToolbar';
import ScribingCanvas from './ScribingCanvas';

// import { setCanvasLoaded, fetchScribingAnswer, clearSavingStatus,
//          updateScribingAnswer, updateScribingAnswerInLocal } = '../actions/scribing';
import { scribingShape } from '../../propTypes';
import { scribingTranslations as translations } from '../../translations';
import { scribingTools, scribingShapes, scribingToolColor,
         scribingToolThickness, scribingToolLineStyle, scribingPopoverTypes } from '../../constants';
import style from './ScribingView.scss';

/* NOTE: Denormalizing and normalizing scribble code is brought over
  * from Coursemology v1. They are not needed for the scribing
  * question to work but it is required to support scribing questions
  * that were migrated over.
*/

const propTypes = {
  intl: intlShape.isRequired,
  // scribing: PropTypes.shape({
  //   answer: scribingShape,
  //   isLoading: PropTypes.bool,
  //   isCanvasLoaded: PropTypes.bool,
  //   isSaving: PropTypes.bool,
  //   isSaved: PropTypes.bool,
  //   hasError: PropTypes.bool,
  // }),
  // readOnly: PropTypes.bool.isRequired,
  // answerId: PropTypes.number,
  // data: scribingShape.isRequired,
  setCanvasLoaded: PropTypes.func.isRequired,
  // fetchScribingAnswer: PropTypes.func.isRequired,
  clearSavingStatus: PropTypes.func.isRequired,
  updateScribingAnswer: PropTypes.func.isRequired,
  updateScribingAnswerInLocal: PropTypes.func.isRequired,

  setToolSelected: PropTypes.func.isRequired,
  setFontFamily: PropTypes.func.isRequired,
  setFontSize: PropTypes.func.isRequired,
  setLineStyleChip: PropTypes.func.isRequired,
  setColoringToolColor: PropTypes.func.isRequired,
  setToolThickness: PropTypes.func.isRequired,
  setSelectedShape: PropTypes.func.isRequired,
  openHoverToolTip: PropTypes.func.isRequired,
  closeHoverToolTip: PropTypes.func.isRequired,
  openColorPicker: PropTypes.func.isRequired,
  closeColorPicker: PropTypes.func.isRequired,
  openPopover: PropTypes.func.isRequired,
  closePopover: PropTypes.func.isRequired,
};

const styles = {
  canvas_div: {
    alignItems: 'center',
    margin: 'auto',
  },
};

class ScribingViewComponent extends React.Component {
  render() {
    const { answerId, submission } = this.props;
    const isCanvasLoaded = this.props.scribing.isCanvasLoaded;
    return (answerId ?
      <div style={styles.canvas_div}>
        {submission.canUpdate ? <ScribingToolbar {...this.props} /> : null }
        { !isCanvasLoaded ? <LoadingIndicator /> : null }
        <ScribingCanvas {...this.props} />
      </div> : null
    );
  }
}

ScribingViewComponent.propTypes = propTypes;
export default injectIntl(ScribingViewComponent);
