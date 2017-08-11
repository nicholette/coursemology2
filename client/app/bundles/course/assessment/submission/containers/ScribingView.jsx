import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../actions/scribing';
import ScribingViewComponent from '../components/ScribingView';
import { scribingShape } from '../propTypes';

class ScribingViewContainer extends Component {
  static propTypes = {
    readOnly: PropTypes.bool.isRequired,
    answerId: PropTypes.number.isRequired,
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

  render() {

    return (
      <ScribingViewComponent
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { answerId } = ownProps;
  return {
    scribing: state.scribing[answerId],
  };
}

const ScribingView = connect(
  mapStateToProps, actions
)(ScribingViewContainer);
export default ScribingView;
