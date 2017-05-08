import React, { PropTypes } from 'react';
import { Canvas } from 'react-fabricjs';
import { injectIntl, intlShape } from 'react-intl';

import styles from './ScribingAnswerForm.scss';
import translations from './ScribingAnswerForm.intl';

import { fetchScribingQuestion } from '../../actions/scribingAnswerActionCreators';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  scribingAnswer: PropTypes.shape({
    question: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      staff_only_comments: PropTypes.string,
      maximum_grade: PropTypes.number,
      weight: PropTypes.number,
      skill_ids: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
      })),
      skills: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
      })),
      attachment_reference: PropTypes.shape({
        name: PropTypes.string,
        path: PropTypes.string,
        updater_name: PropTypes.string,
      }),
      error: PropTypes.shape({
        title: PropTypes.string,
        skills_id: PropTypes.string,
        maximum_grade: PropTypes.number,
      }),
      published_assessment: PropTypes.bool,
      attempt_limit: PropTypes.number,
      attachment_reference: PropTypes.shape({
        name: PropTypes.string,
        path: PropTypes.string,
        updater_name: PropTypes.string,
      })
    }),
    isLoading: PropTypes.bool,
  }),
  save_errors: PropTypes.string,
}

class ScribingAnswerForm extends React.Component {

  constructor() {
    super();
    this.state = {
      canvas: {},
    }
    this.onClickDrawingMode = this.onClickDrawingMode.bind(this);
    this.onClickSelectionMode = this.onClickSelectionMode.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    var answer = document.getElementById('scribing-answer');
    var scribingQuestionId = answer.dataset.scribingQuestionId;
    if (scribingQuestionId) {
      dispatch(fetchScribingQuestion(scribingQuestionId));
    }

    // Initialize Fabric.js canvas
    // Takes in canvas's id for initialization
    const canvas = new fabric.Canvas('canvas', {
      width: this.refs.canvas.clientWidth,
      height: this.refs.canvas.clientHeight
    });

    this.setState({ canvas });
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  handleImageLoaded() {

  }

  handleImageErrored() {

  }

  onClickDrawingMode() {
    this.state.canvas.isDrawingMode = true;
    console.log('drawing mode');
  }

  onClickSelectionMode() {
    this.state.canvas.isDrawingMode = false;
    const objects = this.state.canvas._objects;
    console.log(objects);

    for (var i=0; i<objects.length; i++) {
      console.log(i, objects[i].toSVG());
    }
  }

  onClickSave() {

  }

  renderButtons() {
    // TODO: show state of the button
    return (
      <div>
        <button onClick={this.onClickDrawingMode}>Drawing Mode</button>
        <button onClick={this.onClickSelectionMode}>Selection Mode</button>
        <button onClick={this.onClickSave}>Save</button>
      </div>
    )
  }

  updateCanvas() {
    const imagePath = this.props.scribingAnswer.question.attachment_reference.path;
    if (imagePath) {
      const canvas = this.state.canvas;
      canvas.setBackgroundImage(window.location.origin + '\\' + imagePath, canvas.renderAll.bind(canvas));
    }
  }

  render() {
    // TODO: Make the height/width automatic
    return (
      <div>
        { this.renderButtons() }
        <canvas id="canvas" ref="canvas" height={800} width={600}/>
      </div>
    );
  }
}

ScribingAnswerForm.propTypes = propTypes;

export default injectIntl(ScribingAnswerForm);