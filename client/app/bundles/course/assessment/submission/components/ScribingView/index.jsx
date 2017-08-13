import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'lib/components/LoadingIndicator';
import ScribingToolbar from './ScribingToolbar';
import ScribingCanvas from './ScribingCanvas';
import style from './ScribingView.scss'; // eslint-disable-line no-unused-vars
import { submissionShape, scribingShape } from '../../propTypes';

const propTypes = {
  answerId: PropTypes.number.isRequired,
  submission: submissionShape,
  scribing: scribingShape,
};

const styles = {
  canvas_div: {
    alignItems: 'center',
    margin: 'auto',
  },
};

export default class ScribingViewComponent extends React.Component {
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
