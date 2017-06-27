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
    is_saving: PropTypes.bool,
    is_saved: PropTypes.bool,
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
  saving_status_label: {
    color: '#bdc3c7',
    fontSize: `14px`,
    fontWeight: `500`,
    letterSpacing: `0px`,
    textTransform: `uppercase`,
    fontFamily: `Roboto, sans-serif`,
  },
  custom_line: {
    width: `30px`,
    marginRight: '12px',
    height: `55%`,
    display: `block`,
    transform: `translate(50%, 0px) scale(0.70, 0.2) rotate(85deg) skewX(70deg)`,
  }
}

class ScribingAnswerForm extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTool: tools.SELECT,
      imageWidth: 0,
      imageHeight: 0,
      isPopoverOpen: false,
    }
    this.onClickDrawingMode = this.onClickDrawingMode.bind(this);
    this.onClickLineMode = this.onClickLineMode.bind(this);
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

  getMousePoint(event) {
    let pointer = this.canvas.getPointer(event.e);
    return [pointer.x, pointer.y];
  }

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
      _self.canvas.on('mouse:down', (options) => {
        this.mouseDragFlag = false;
        this.mouseDragStartPoint = this.getMousePoint(options.e);
      })

      _self.canvas.on('mouse:move', (options) => {
        this.mouseDragFlag = true;
      })

      _self.canvas.on('mouse:up', (options) => {
        _self.saveScribbles();

        // This is a drag as the mouse move occurs after mouse down.
        if (this.mouseDragFlag === true) {
          this.mouseDragEndPoint = this.getMousePoint(options.e);
          if (this.state.selectedTool === tools.LINE) {
            _self.canvas.add(new fabric.Line(
              [...this.mouseDragStartPoint, ...this.mouseDragEndPoint],
              {fill: 'black', stroke: 'black', strokeWidth: 1, selectable: true}
            ))
          }
        }
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

  onClickLineMode() {
    this.canvas.isLineMode = true;
    this.setState({selectedTool: tools.LINE})
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
    return this.layers && this.layers.length !== 0 ? (
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

  renderSavingStatus() {
    var status = '';

    if (this.props.scribingAnswer.is_saving) {
      status = 'Saving..';
    } else if (this.props.scribingAnswer.is_saved) {
      status = 'Saved';
      // TODO: make fading animation
      setTimeout(this.props.actions.clearSavingStatus.bind(this), 3000);
    } else if (this.props.scribingAnswer.save_errors) {
      // TODO: add warning color
      status = 'Save errors.'
    }

    return (
      <div>
        <label style={styles.saving_status_label}>{status}</label>
      </div>
    );
  }

  renderToolBar() {
    const lineToolStyle = { 
      ...styles.custom_line,
      background: this.state.selectedTool === tools.LINE ? `black` : `rgba(0, 0, 0, 0.4)`,
    } 

    return (
      <Toolbar style={styles.toolbar}>
        <ToolbarGroup>
          <FontIcon className="fa fa-pencil" style={this.state.selectedTool === tools.DRAW ? {color: `black`} : {}}
            onClick={this.onClickDrawingMode} />
          <FontIcon style={lineToolStyle} onClick={this.onClickLineMode} />
          <FontIcon className="fa fa-hand-pointer-o" style={this.state.selectedTool === tools.SELECT ? {color: `black`} : {}}
            onClick={this.onClickSelectionMode}/>
          <FontIcon className="fa fa-trash-o" style={this.state.selectedTool === tools.DELETE ? {color: `black`} : {}}
            onClick={this.onClickDelete}/>
          <RaisedButton
            onTouchTap={this.handlePopoverTouchTap}
            label="Layers"
            disabled={this.layers && this.layers.length === 0}
          />
          { this.renderPopover() }
        </ToolbarGroup>
        <ToolbarGroup>
          { this.renderSavingStatus() }
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