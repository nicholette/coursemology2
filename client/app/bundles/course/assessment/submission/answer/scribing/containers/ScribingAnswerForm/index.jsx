import React, { PropTypes } from 'react';
import { Canvas } from 'react-fabricjs';

import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import { injectIntl, intlShape } from 'react-intl';

import translations from './ScribingAnswerForm.intl';

import { answerShape } from '../../propTypes';
import { tools } from '../../constants';

const propTypes = {
  actions: React.PropTypes.shape({
    setCanvasLoaded: PropTypes.func.isRequired,
    // fetchScribingAnswer: PropTypes.func.isRequired,
    setUpScribingAnswer: PropTypes.func.isRequired,
    updateScribingAnswer: PropTypes.func.isRequired,
  }),
  scribingAnswer: PropTypes.shape({
    // question: questionShape,
    // answer: answerShape,
    is_loading: PropTypes.bool,
    is_canvas_loaded: PropTypes.bool,
    save_errors: PropTypes.array(PropTypes.string),
  }),
  data: PropTypes.object.isRequired,
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
  },
}

class ScribingAnswerForm extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTool: tools.SELECT,
      imageWidth: 0,
      imageHeight: 0,
      isPopoverOpen: false,
      layers: [],
    }
    this.onClickDrawingMode = this.onClickDrawingMode.bind(this);
    this.onClickSelectionMode = this.onClickSelectionMode.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  handlePopoverTouchTap = (event) => {
    // This prevents ghost click.
    // event.preventDefault();

    this.setState({
      isPopoverOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  handlePopoverRequestClose = () => {
    this.setState({
      isPopoverOpen: false,
    });
  };

  initializeAnswer() {
    // var answer = document.getElementById('scribing-answer');
    // var data = JSON.parse(answer.getAttribute('data'));

    this.props.actions.setUpScribingAnswer(this.props.data);
  }

  initializeCanvas(imagePath) {
    const _self = this;
    const answerId = this.props.scribingAnswer.answer.answer_id;
    const imageUrl = window.location.origin + '\\' + imagePath;
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      // A4 size width
      const CANVAS_MAX_WIDTH = 890;
      const width = Math.min(image.width, CANVAS_MAX_WIDTH);
      const scale = Math.min(width / image.width, 1);
      const height = scale * image.height;

      _self.refs.canvas.width = width;
      _self.refs.canvas.height = height;

      // Takes in canvas's id for initialization
      const canvas = new fabric.Canvas(`canvas-${answerId}`, { width, height });

      const fabricImage = new fabric.Image(
        image,
        {opacity: 1, scaleX: scale, scaleY: scale}
      );
      canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas));

      _self.canvas = canvas;
      _self.canvas.on('mouse:up', (options) => {
        _self.saveScribbles();
      })

      _self.initializeScribbles();

      _self.props.actions.setCanvasLoaded(true);
    }
  }

  initializeScribbles() {
    const { scribbles, user_id } = this.props.scribingAnswer.answer;
    this.layers = [];
    if (scribbles) {
      scribbles.forEach((scribble) => {
        const objects = JSON.parse(scribble.content).objects;
        const fabricObjs = [];

        for (var i = 0; i < objects.length; i++) {
          var klass = fabric.util.getKlass(objects[i].type);
          klass.fromObject(objects[i], (obj)=>(fabricObjs.push(obj)));
        }

        if (scribble.creator_id !== user_id) {
          const scribbleGroup = new fabric.Group(fabricObjs);
          scribbleGroup.selectable = false;

          const showLayer = (isShown) => {
            const thisGroup = scribbleGroup;
            if (isShown && !this.canvas.contains(thisGroup)) {
              this.canvas.add(thisGroup);
            } else if (!isShown && this.canvas.contains(thisGroup)) {
              this.canvas.remove(thisGroup);
            }
            this.canvas.renderAll();
          }
          // Populate layers list
          const newScribble = {
            ...scribble,
            isDisplayed: true,
            showLayer,
          }
          this.layers = [...this.layers, newScribble];
        } else {
          fabricObjs.map((obj) => {
            this.canvas.add(obj)
          });
        }
      })
    }
  }

  updateScribbles() {
    const { user_id } = this.props.scribingAnswer.answer;
    const { layers } = this;

    if (layers) {
      layers.forEach((layer) => {
        layer.showLayer(layer.isDisplayed);
      })
    }
  }

  componentDidMount() {
    // Retrieve answer in async call
    this.initializeAnswer();
  }

  shouldComponentUpdate(nextProps) {
    // Don't update until canvas is ready
    if (!this.props.scribingAnswer.is_canvas_loaded && 
        this.props.scribingAnswer.answer.image_path !==
        nextProps.scribingAnswer.answer.image_path) {
        this.initializeCanvas(nextProps.scribingAnswer.answer.image_path);
      return false;
    }
    this.updateScribbles();
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

  getScribbleJSON() {
    // Remove non-user scribings in canvas
    this.layers.forEach((layer) => {
      if (layer.creator_id !== this.props.scribingAnswer.answer.user_id) {
        layer.showLayer(false)
      }
    })
    
    // Only save user scribings
    const json = JSON.stringify(this.canvas._objects);

    // Add back non-user scribings according canvas state
    this.layers.forEach((layer) => (layer.showLayer(layer.showLayer)));

    return '{"objects":'+ json +'}';
  }

  saveScribbles() {
    const objects = this.canvas._objects;
    const answerId = this.props.scribingAnswer.answer.answer_id;
    const json = this.getScribbleJSON();
    this.props.actions.updateScribingAnswer(answerId, json);
  }

  renderPopover() {

    return this.layers ? (
      <Popover
        open={this.state.isPopoverOpen}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={this.handlePopoverRequestClose}
      >
        <Menu>
          { this.layers.map((layer) => (
              <MenuItem 
                key={layer.creator_id}
                primaryText={layer.creator_name}
                checked={layer.isDisplayed}
                onTouchTap={(event) => {
                  // Shift to props for updating
                    const layersClone = _.cloneDeep(this.layers);
                    const temp = _.find(layersClone, {creator_id: layer.creator_id});
                    temp.isDisplayed = !temp.isDisplayed;
                    this.layers = layersClone;
                    this.updateScribbles();
                    this.forceUpdate();
                }}
              />
            ))
          }
        </Menu>
      </Popover>
    ) : null;
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
          <RaisedButton
            onTouchTap={this.handlePopoverTouchTap}
            label="Layers"
          />
          { this.renderPopover() }
        </ToolbarGroup>
      </Toolbar>
    )
  }

  render() {
    // TODO: Make the height/width automatic
    const answerId = this.props.scribingAnswer.answer.answer_id;
    return (
      <div style={styles.canvas_div}>
        { this.renderToolBar() }
        <canvas style={styles.canvas} id={`canvas-${answerId}`} ref="canvas" />
      </div>
    );
  }
}

ScribingAnswerForm.propTypes = propTypes;

export default injectIntl(ScribingAnswerForm);