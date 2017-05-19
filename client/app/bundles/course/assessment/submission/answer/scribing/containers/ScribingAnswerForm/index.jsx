import React, { PropTypes } from 'react';
import { Canvas } from 'react-fabricjs';

import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

import { injectIntl, intlShape } from 'react-intl';

import translations from './ScribingAnswerForm.intl';

import { questionShape } from '../../../../../question/scribing/propTypes';
import { answerShape } from '../../propTypes';
import { tools } from '../../constants';

const propTypes = {
  actions: React.PropTypes.shape({
    setPathLoaded: PropTypes.func.isRequired,
    setImageLoaded: PropTypes.func.isRequired,
    setCanvasLoaded: PropTypes.func.isRequired,
    fetchScribingQuestion: PropTypes.func.isRequired,
    fetchScribingAnswer: PropTypes.func.isRequired,
    updateScribingAnswer: PropTypes.func.isRequired,
  }),
  scribingAnswer: PropTypes.shape({
    question: questionShape,
    // answer: answerShape,
    is_loading: PropTypes.bool,
    is_canvas_loaded: PropTypes.bool,
    save_errors: PropTypes.array(PropTypes.string),
  }),
}

const styles = {
  canvas_div: {
    width: `890px`,
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
      selectedTool: tools.SELECT,
      imageWidth: 0,
      imageHeight: 0,
    }
    this.onClickDrawingMode = this.onClickDrawingMode.bind(this);
    this.onClickSelectionMode = this.onClickSelectionMode.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  initializeAnswer() {
    var answer = document.getElementById('scribing-answer');
    var scribingQuestionId = answer.dataset.scribingQuestionId;
    var scribingAnswerId = answer.dataset.scribingAnswerId;

    if (scribingQuestionId) {
      this.props.actions.fetchScribingQuestion(scribingQuestionId);
    }
    if (scribingAnswerId) {
      this.props.actions.fetchScribingAnswer(scribingAnswerId);
    }
  }

  initializeCanvas(imagePath) {
    const _self = this;
    const imageUrl = window.location.origin + '\\' + imagePath;
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const CANVAS_MAX_WIDTH = 890;
      const width = Math.min(image.width, CANVAS_MAX_WIDTH);
      const scale = Math.min(width / image.width, 1);
      const height = scale * image.height;

      _self.refs.canvas.width = width;
      _self.refs.canvas.height = height;

      // Takes in canvas's id for initialization
      const canvas = new fabric.Canvas('canvas', { width, height });

      const fabricImage = new fabric.Image(
        image,
        {opacity: 1, scaleX: scale, scaleY: scale}
      );
      canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas));

      _self.canvas = canvas;
      _self.props.actions.setCanvasLoaded(true);
    }
  }

  componentDidMount() {
    this.initializeAnswer();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  shouldComponentUpdate(nextProps) {
    if (!this.props.scribingAnswer.is_canvas_loaded && 
        this.props.scribingAnswer.question.attachment_reference.path !==
        nextProps.scribingAnswer.question.attachment_reference.path) {
        this.initializeCanvas(nextProps.scribingAnswer.question.attachment_reference.path);
      return false;
    }
    return nextProps.scribingAnswer.is_canvas_loaded;
  }

  onClickDrawingMode() {
    this.canvas.isDrawingMode = true;
    this.setState({selectedTool: tools.DRAW})
  }

  onClickSelectionMode() {
    this.canvas.isDrawingMode = false;
    this.setState({selectedTool: tools.SELECT})
  }

  onClickDelete() {
    const canvas = this.canvas;
    const activeGroup = canvas.getActiveGroup();
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      canvas.remove(activeObject);
    }
    else if (activeGroup) {
      const objectsInGroup = activeGroup.getObjects();
      canvas.discardActiveGroup();
      objectsInGroup.forEach(function(object) {
        canvas.remove(object);
      });
    }
  }

  // addSvgStartText() {
  //   return `<svg xmlns="http://www.w3.org/2000/svg" 
  //           xmlns:xlink="http://www.w3.org/1999/xlink"
  //           version="1.1" width="${this.refs.canvas.clientWidth}" 
  //           height="${this.refs.canvas.clientHeight}" xml:space="preserve">
  //           <desc>Created with Fabric.js 1.6.0-rc.1</desc>
  //           <defs></defs>`;
  // }

  // addSvgEndText() {
  //   return '</svg>';
  // }

  onClickSave() {
    const objects = this.canvas._objects;
    const scribbles = [];
    for (var i=0; i<objects.length; i++) {
      // scribbles.push( objects[i].toSVG() + this.addSvgEndText());
      console.log('scribble' + i, JSON.stringify(objects[i]));
    }
    console.log('canvas', JSON.stringify(this.canvas));
    const answerId = document.getElementById('scribing-answer').dataset.scribingAnswerId;

    // dispatch(updateScribingAnswer(answerId, scribbles));

    // TODO: remove after demo
    // window.location.reload(true);
  }

  renderToolBar() {
    return (
      <Toolbar style={styles.toolbar}>
        <ToolbarGroup>
          <FontIcon className="fa fa-pencil" style={this.state.selectedTool === tools.DRAW ? {color: `black`} : {}}
            onClick={this.onClickDrawingMode} />
          <FontIcon className="fa fa-hand-pointer-o" style={this.state.selectedTool === tools.SELECT ? {color: `black`} : {}}
            onClick={this.onClickSelectionMode}/>
          <FontIcon className="fa fa-trash-o" style={this.state.selectedTool === tools.DELETE ? {color: `black`} : {}}
            onClick={this.onClickDelete}/>
        </ToolbarGroup>
        <ToolbarGroup>
          <RaisedButton label="Save" primary={true} onClick={this.onClickSave} />
        </ToolbarGroup>
      </Toolbar>
    )
  }

  updateCanvas() {
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
        <canvas style={styles.canvas} id="canvas" ref="canvas" />
      </div>
    );
  }
}

ScribingAnswerForm.propTypes = propTypes;

export default injectIntl(ScribingAnswerForm);