import React, { PropTypes } from 'react';
import { Canvas } from 'react-fabricjs';

import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

import { injectIntl, intlShape } from 'react-intl';

import translations from './ScribingAnswerForm.intl';

import { fetchScribingQuestion, fetchScribingAnswer, updateScribingAnswer } from '../../actions/scribingAnswerActionCreators';

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
    answer: PropTypes.shape({
      scribbles: PropTypes.arrayOf(PropTypes.shape({
        content: PropTypes.string,
      }))
    }),
    isLoading: PropTypes.bool,
  }),
  save_errors: PropTypes.string,
}

const styles = {
  canvas_div: {
    width: `650px`,
    alignItems: `center`,
    margin: `auto`,
  },
  canvas: {
    border: `1px solid black`,
  },
  toolbar: {
    marginBottom: `1em`,
  }
}

class ScribingAnswerForm extends React.Component {

  constructor() {
    super();
    this.state = {
      canvas: {},
    }
    this.onClickDrawingMode = this.onClickDrawingMode.bind(this);
    this.onClickSelectionMode = this.onClickSelectionMode.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    var answer = document.getElementById('scribing-answer');
    var scribingQuestionId = answer.dataset.scribingQuestionId;
    var scribingAnswerId = answer.dataset.scribingAnswerId;

    if (scribingQuestionId) {
      dispatch(fetchScribingQuestion(scribingQuestionId));
    }
    if (scribingAnswerId) {
      dispatch(fetchScribingAnswer(scribingAnswerId));
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
  }

  onClickSelectionMode() {
    this.state.canvas.isDrawingMode = false;
  }

  addSvgStartText() {
    return `<svg xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1" width="${this.refs.canvas.clientWidth}" 
            height="${this.refs.canvas.clientHeight}" xml:space="preserve">
            <desc>Created with Fabric.js 1.6.0-rc.1</desc>
            <defs></defs>`;
  }

  addSvgEndText() {
    return '</svg>';
  }

  onClickSave() {
    const { dispatch } = this.props;
    const objects = this.state.canvas._objects;
    const scribbles = [];
    for (var i=0; i<objects.length; i++) {
      scribbles.push(this.addSvgStartText() + objects[i].toSVG() + this.addSvgEndText());
    }
    const answerId = document.getElementById('scribing-answer').dataset.scribingAnswerId;

    dispatch(updateScribingAnswer(answerId, scribbles));

    // TODO: remove after demo
    window.location.reload(true);
  }

  renderToolBar() {
    // TODO: show state of the button
    return (
      <Toolbar style={styles.toolbar}>
        <ToolbarGroup>
          <FontIcon className="fa fa-pencil" onClick={this.onClickDrawingMode}/>
          <FontIcon className="fa fa-hand-pointer-o" onClick={this.onClickSelectionMode}/>
        </ToolbarGroup>
        <ToolbarGroup>
          <RaisedButton label="Save" primary={true} onClick={this.onClickSave} />
        </ToolbarGroup>
      </Toolbar>
    )
  }

  updateCanvas() {
    const imagePath = this.props.scribingAnswer.question.attachment_reference.path;
    var canvas = this.state.canvas;
    if (imagePath) {
      canvas.setBackgroundImage(window.location.origin + '\\' + imagePath, canvas.renderAll.bind(canvas));
    }

    const scribbles = this.props.scribingAnswer.answer.scribbles
    // TODO: handle behavior, where after saving, more scribbles will be added
    if (scribbles) {
      var i=0;
      scribbles.forEach((scribble) => {
        fabric.loadSVGFromString(scribble.content, function(objects, options) {
          var obj = fabric.util.groupSVGElements(objects, options);
          canvas.add(obj).renderAll();
        });
      })
    }

    const objects = canvas._objects;
  }

  render() {

    // TODO: Make the height/width automatic
    return (
      <div style={styles.canvas_div}>
        { this.renderToolBar() }
        <canvas style={styles.canvas} id="canvas" ref="canvas" height={800} width={650}/>
      </div>
    );
  }
}

ScribingAnswerForm.propTypes = propTypes;

export default injectIntl(ScribingAnswerForm);