import React, { PropTypes } from 'react';
import { Canvas } from 'react-fabricjs';

import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

import { injectIntl, intlShape } from 'react-intl';

import translations from './ScribingAnswerForm.intl';

import { fetchScribingQuestion, fetchScribingAnswer, updateScribingAnswer } from '../../actions/scribingAnswerActionCreators';

import { tools } from '../../constants';

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
      canvas: {},
      selectedTool: tools.SELECT,
    }
    this.onClickDrawingMode = this.onClickDrawingMode.bind(this);
    this.onClickSelectionMode = this.onClickSelectionMode.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
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
    this.setState({selectedTool: tools.DRAW})
  }

  onClickSelectionMode() {
    this.state.canvas.isDrawingMode = false;
    this.setState({selectedTool: tools.SELECT})
  }

  onClickDelete() {
    const canvas = this.state.canvas;
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
    const { dispatch } = this.props;
    const objects = this.state.canvas._objects;
    const scribbles = [];
    for (var i=0; i<objects.length; i++) {
      // scribbles.push( objects[i].toSVG() + this.addSvgEndText());
      console.log('scribble' + i, JSON.stringify(objects[i]));
    }
    console.log('canvas', JSON.stringify(this.state.canvas));
    const answerId = document.getElementById('scribing-answer').dataset.scribingAnswerId;

    // dispatch(updateScribingAnswer(answerId, scribbles));

    // TODO: remove after demo
    // window.location.reload(true);
  }

  renderToolBar() {
    // TODO: show state of the button
    console.log(this.state.selectedTool, tools.DRAW, this.state.selectedTool === tools.DRAW);

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

  renderCanvas() {
    return (
      <canvas style={styles.canvas} id="canvas" ref="canvas" height={1256} width={890}/>
    );
  }

  render() {

    // TODO: Make the height/width automatic
    return (
      <div style={styles.canvas_div}>
        { this.renderToolBar() }
        { this.renderCanvas() }
      </div>
    );
  }
}

ScribingAnswerForm.propTypes = propTypes;

export default injectIntl(ScribingAnswerForm);