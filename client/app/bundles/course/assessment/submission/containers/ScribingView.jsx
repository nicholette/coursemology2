import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setCanvasLoaded, fetchScribingAnswer, clearSavingStatus,
         updateScribingAnswer, updateScribingAnswerInLocal } from '../actions/scribing';
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
  mapStateToProps, {
    setCanvasLoaded,
    // fetchScribingAnswer,
    clearSavingStatus,
    updateScribingAnswer,
    updateScribingAnswerInLocal,
  }
)(ScribingViewContainer);
export default ScribingView;
