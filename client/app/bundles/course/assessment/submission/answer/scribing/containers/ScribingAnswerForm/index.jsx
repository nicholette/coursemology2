import React, { PropTypes } from 'react';
import { Canvas } from 'react-fabricjs';
import { SketchPicker } from 'react-color';

import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider';
import Chip from 'material-ui/Chip';
import {cyan500, grey50} from 'material-ui/styles/colors';

import { injectIntl, intlShape } from 'react-intl';

import translations from './ScribingAnswerForm.intl';

import { answerShape } from '../../propTypes';
import { tools, shapes, toolColor, toolThickness, toolLineStyle, popoverTypes } from '../../constants';

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
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
  canvas_div: {
    // width: `890px`,
    alignItems: `center`,
    margin: `auto`,
  },
  canvas: {
    width: `100%`,
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
    display: `inline-block`,
    position: `inherit`,
    width: `25px`,
    height: `21px`,
    marginLeft: `-2px`,
    transform: `scale(1.0, 0.2) rotate(90deg) skewX(76deg)`,
  },
  tool: {
    position: `relative`,
    display: `inline-block`,
    paddingRight: `24px`,
  },
  toolDropdowns: {
    width: `240px`,
    padding: `10px`,
  },
  menu: {
    maxHeight: `250px`,
    overflowY: `auto`,
  },
  slider: {
    padding: `0px 10px`,
  },
  innerTool: {
    display: `inline-block`,
  },
  chevron: {
    color: `rgba(0, 0, 0, 0.4)`,
    fontSize:`12px`,
    padding: `10px 0px 10px 0px`,
  },
  colorPicker: {
    height: `20px`,
    width: `20px`,
    display: `inline-block`,
    margin: `0px 10px`,
  },
  chip: {
    margin: `4px`,
  },
  chipWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}

class ScribingAnswerForm extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTool: tools.SELECT,
      selectedShape: shapes.RECT,
      imageWidth: 0,
      imageHeight: 0,
      isPopoverOpen: false,
      colors: [],
      colorDropdowns: [],
      lineStyles: [],
      thickness: [],
      popovers: [],
      popoverAnchor: undefined,
      popoverColorPickerAnchor: undefined,
    }

    this.viewportLeft = 0;
    this.viewportTop = 0;

    this.onClickTypingMode = this.onClickTypingMode.bind(this);
    this.onClickDrawingMode = this.onClickDrawingMode.bind(this);
    this.onClickLineMode = this.onClickLineMode.bind(this);
    this.onClickShapeMode = this.onClickShapeMode.bind(this);
    this.onClickSelectionMode = this.onClickSelectionMode.bind(this);
    this.onClickPanMode = this.onClickPanMode.bind(this);
    this.onClickZoomIn = this.onClickZoomIn.bind(this);
    this.onClickZoomOut = this.onClickZoomOut.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  getRgbaHelper(json) {
    return 'rgba(' + json.r + ',' + json.g + ',' + json.b + ',' + json.a + ')';
  }

  handleOnChangeCompleteColor = (color, coloringTool) => {
    if (coloringTool === toolColor.DRAW) {
      this.canvas.freeDrawingBrush.color = this.getRgbaHelper(color.rgb);
    }

    this.setState({
      colors: { ...this.state.colors, [coloringTool]: this.getRgbaHelper(color.rgb)},
    });
  }

  handleColorPickerClick = (event, toolType) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      popoverColorPickerAnchor: event.currentTarget,
      colorDropdowns: { ...this.state.popovers, [toolType]: true },
    });
  }

  handleColorPickerClose = (toolType) => {
    this.setState({
      colorDropdowns: { ...this.state.popovers, [toolType]: false },
    });
  }

  handlePopoverTouchTap = (event, popoverType) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      popovers: { ...this.state.popovers, [popoverType]: true },
      popoverAnchor: event.currentTarget.parentElement.parentElement,
    });
  };

  handlePopoverRequestClose = (popoverType) => {
    this.setState({
      popovers: { ...this.state.popovers, [popoverType]: false },
    });
  };

  handleTouchTapLineStyleChip = (event, toolType, style) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      lineStyles: { ...this.state.lineStyles, [toolType]: style},
    });
  }

  handleSliderThicknessOnChange = (event, toolType, value) => {
    if (toolType === toolThickness.DRAW) {
      this.canvas.freeDrawingBrush.width = value;
    }

    this.setState({
      thickness: { ...this.state.thickness, [toolType]: value}
    })
  }

  getMousePoint(event) {
    return {
      x: event.clientX,
      y: event.clientY,
    }
  }

  getCanvasPoint(event) {
    let pointer = this.canvas.getPointer(event.e);
    return {
      x: pointer.x,
      y: pointer.y,
    };
  }

  // Generates the left, top, width and height of the drag
  generateMouseDragProperties(point1, point2) {
    return {
      left: point1.x < point2.x ? point1.x : point2.x,
      top: point1.y < point2.y ? point1.y : point2.y,
      width: Math.abs(point1.x - point2.x),
      height: Math.abs(point1.y - point2.y),
    }
  }

  initializeToolColor() {
    for (var toolType in toolColor) {
      this.state.colors[toolType] = `#000000`;
    }
  }

  initializeColorDropdowns() {
    for (var toolType in toolColor) {
      this.state.colorDropdowns[toolType] = false;
    }
  }

  initializeLineStyles() {
    for (var toolType in toolLineStyle) {
      this.state.lineStyles[toolType] = 'solid';
    }
  }

  initializeToolThickness() {
      for (var toolType in toolThickness) {
      this.state.thickness[toolType] = 1;
    }
  }

  initializePopovers() {
    for (var popoverType in popoverTypes) {
      this.state.popovers[popoverType] = false;
    }
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
      // const CANVAS_MAX_WIDTH = 890;
      
      // Get the calculated width of canvas, 750 is min width for scribing toolbar
      const element = document.getElementById(`canvas-${answerId}`);
      this.CANVAS_MAX_WIDTH = Math.max(element.getBoundingClientRect().width, 750);

      const width = Math.min(image.width, this.CANVAS_MAX_WIDTH);
      this.scale = Math.min(width / image.width, 1);
      const height = this.scale * image.height;

      _self.refs.canvas.width = width;
      _self.refs.canvas.height = height;

      // Takes in canvas's id for initialization
      const canvas = new fabric.Canvas(`canvas-${answerId}`, { width, height });

      const fabricImage = new fabric.Image(
        image,
        {opacity: 1, scaleX: this.scale, scaleY: this.scale}
      );
      canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas));

      _self.canvas = canvas;
      _self.canvas.on('mouse:down', (options) => {
        this.mouseDragFlag = false;
        this.mouseCanvasDragStartPoint = this.getCanvasPoint(options.e);

        // To facilitate panning
        this.mouseDownFlag = true;
        this.viewportLeft = this.canvas.viewportTransform[4];
        this.viewportTop = this.canvas.viewportTransform[5];
        this.mouseStartPoint = this.getMousePoint(options.e);
      })

      _self.canvas.on('mouse:move', (options) => {
        this.mouseDragFlag = true;

        // Do panning action
        let tryPan = (finalLeft, finalTop) => {
          // limit panning
          finalLeft = Math.min(finalLeft, 0);
          finalLeft = Math.max(finalLeft, (this.canvas.getZoom() - 1) * this.canvas.getWidth() * -1);
          finalTop = Math.min(finalTop, 0);
          finalTop = Math.max(finalTop, (this.canvas.getZoom() - 1) * this.canvas.getHeight() * -1);
          
          // apply calculated pan transforms
          this.canvas.viewportTransform[4] = finalLeft;
          this.canvas.viewportTransform[5] = finalTop;
          this.canvas.renderAll();
        };

        if (this.state.selectedTool === tools.PAN && this.mouseDownFlag) {
          let mouseCurrentPoint = this.getMousePoint(options.e);
          var deltaLeft = mouseCurrentPoint.x - this.mouseStartPoint.x;
          var deltaTop = mouseCurrentPoint.y - this.mouseStartPoint.y;
          var newLeft = this.viewportLeft + deltaLeft;
          var newTop = this.viewportTop + deltaTop;
          tryPan(newLeft, newTop);
        // } else if (options['isForced']) {
        //   tryPan(this.canvas.viewportTransform[4], this.canvas.viewportTransform[5]);
        }
      });

      // REFACTOR!!!
      _self.canvas.on('mouse:up', (options) => {
        this.mouseDownFlag = false;
        this.mouseCanvasDragEndPoint = this.getCanvasPoint(options.e);

        let minDistThreshold = 25;
        let dist = Math.abs((this.mouseCanvasDragStartPoint.x - this.mouseCanvasDragEndPoint.x) << 1)
                    + Math.abs((this.mouseCanvasDragStartPoint.y - this.mouseCanvasDragEndPoint.y) << 1);
        let passedDistThreshold = dist > minDistThreshold;
        let isMouseDrag = this.mouseDragFlag === true && passedDistThreshold;

        if (this.state.selectedTool === tools.TYPE) {
          // TODO: add typing functionality
          console.log('TYPE TOOL selected');
        } else if (isMouseDrag) {
          // This is a drag as the mouse move occurs after mouse down.
          if (this.state.selectedTool === tools.LINE) {
            var strokeDashArray = [];
            if (this.state.lineStyles[toolLineStyle.LINE] === 'dotted') {
              strokeDashArray = [1, 3];
            } else if (this.state.lineStyles[toolLineStyle.LINE] === 'dashed') {
              strokeDashArray = [10, 5];
            }

            let line = new fabric.Line(
              [this.mouseCanvasDragStartPoint.x, this.mouseCanvasDragStartPoint.y,
               this.mouseCanvasDragEndPoint.x, this.mouseCanvasDragEndPoint.y],
              {
                stroke: `${this.state.colors[toolColor.LINE]}`,
                strokeWidth: this.state.thickness[toolThickness.LINE],
                strokeDashArray,
                selectable: false
              }
            );
            this.canvas.add(line);
          } else if (this.state.selectedTool === tools.SHAPE) {

            var strokeDashArray = [];
            if (this.state.lineStyles[toolLineStyle.SHAPE_BORDER] === 'dotted') {
              strokeDashArray = [1, 3];
            } else if (this.state.lineStyles[toolLineStyle.SHAPE_BORDER] === 'dashed') {
              strokeDashArray = [10, 5];
            }

            switch (this.state.selectedShape) {
              case shapes.RECT: {
                let dragProps = this.generateMouseDragProperties(this.mouseCanvasDragStartPoint, this.mouseCanvasDragEndPoint);
                let rect = new fabric.Rect({
                  left: dragProps.left,
                  top: dragProps.top,
                  stroke: `${this.state.colors[toolColor.SHAPE_BORDER]}`,
                  strokeWidth: this.state.thickness[toolThickness.SHAPE_BORDER],
                  strokeDashArray,
                  fill: `${this.state.colors[toolColor.SHAPE_FILL]}`,
                  width: dragProps.width,
                  height: dragProps.height,
                  selectable: false,
                });
                this.canvas.add(rect);
                break;
              }
              case shapes.ELLIPSE: {
                let dragProps = this.generateMouseDragProperties(this.mouseCanvasDragStartPoint, this.mouseCanvasDragEndPoint);
                let ellipse = new fabric.Ellipse({
                  left: dragProps.left,
                  top: dragProps.top,
                  stroke: `${this.state.colors[toolColor.SHAPE_BORDER]}`,
                  strokeWidth: this.state.thickness[toolThickness.SHAPE_BORDER],
                  strokeDashArray,
                  fill: `${this.state.colors[toolColor.SHAPE_FILL]}`,
                  rx: dragProps.width / 2,
                  ry: dragProps.height / 2,
                  selectable: false,
                });
                this.canvas.add(ellipse);
                break;
              }
            }
          }
        }
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

          switch (objects[i].type) {
            case 'path': {
              klass.fromObject(objects[i], (obj)=>{
                this.scaleScribble(obj);
                fabricObjs.push(obj);
              });
              break;
            }
            case 'line':
            case 'rect':
            case 'ellipse': {
              let obj = klass.fromObject(objects[i]);
              this.scaleScribble(obj);
              fabricObjs.push(obj);
              break;
            }
          }
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
    this.initializeToolColor();
    this.initializeToolThickness();
    this.initializeLineStyles();
    this.initializeColorDropdowns();
    this.initializePopovers();
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

  disableObjectSelection() {
    this.canvas.forEachObject(function(o) {
      o.selectable = false;
    });
  }

  enableObjectSelection() {
    // this clears the selection-disabled scribbles
    // and reloads them to enable selection again
    this.canvas.clear();
    this.initializeScribbles();
  }

  onClickTypingMode() {
    this.canvas.isDrawingMode = false;
    this.disableObjectSelection();
    this.setState({selectedTool: tools.TYPE});
  }

  onClickDrawingMode() {
    // isDrawingMode automatically disables selection mode 
    // in fabric.js library
    this.canvas.isDrawingMode = true;
    this.setState({selectedTool: tools.DRAW})
  }

  onClickLineMode() {
    this.canvas.isDrawingMode = false;
    this.disableObjectSelection();
    this.setState({selectedTool: tools.LINE})
  }

  onClickShapeMode() {
    this.canvas.isDrawingMode = false;
    this.disableObjectSelection();
    this.setState({selectedTool: tools.SHAPE});
  }

  onClickSelectionMode() {
    this.canvas.isDrawingMode = false;
    this.enableObjectSelection();
    this.setState({selectedTool: tools.SELECT})
  }

  onClickPanMode() {
    this.canvas.isDrawingMode = false;
    this.disableObjectSelection();
    this.setState({selectedTool: tools.PAN})
  }

  onClickZoomIn() {
    let newZoom = this.canvas.getZoom() + 0.1;
    this.canvas.zoomToPoint({
      x: this.canvas.height / 2,
      y: this.canvas.width / 2,
    }, newZoom);
  }

  onClickZoomOut() {
    let newZoom = Math.max(this.canvas.getZoom() - 0.1, 1);
    this.canvas.zoomToPoint({
      x: this.canvas.height / 2,
      y: this.canvas.width / 2,
    }, newZoom);
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
    this.saveScribbles();
  }

  scaleScribble(scribble) {
    scribble.scaleX *= this.scale;
    scribble.scaleY *= this.scale;
    scribble.left *= this.scale;
    scribble.top *= this.scale;
  }

  rescaleScribble(scribble) {
    scribble.scaleX /= this.scale;
    scribble.scaleY /= this.scale;
    scribble.left /= this.scale;
    scribble.top /= this.scale;
  }

  getScribbleJSON() {
    // Remove non-user scribings in canvas
    this.layers.forEach((layer) => {
      if (layer.creator_id !== this.props.scribingAnswer.answer.user_id) {
        layer.showLayer(false)
      }
    })

    // only save rescaled user scribings
    const objects = this.canvas._objects;
    objects.forEach((obj) => (this.rescaleScribble(obj)));
    const json = JSON.stringify(objects);

    // scale back user scribings
    objects.forEach((obj) => (this.scaleScribble(obj)));

    // Add back non-user scribings according canvas state
    this.layers.forEach((layer) => (layer.showLayer(layer.showLayer)));

    return '{"objects":'+ json +'}';
  }

  saveScribbles() {
    const answerId = this.props.scribingAnswer.answer.answer_id;
    const json = this.getScribbleJSON();
    this.props.actions.updateScribingAnswerInLocal(json);
    this.props.actions.updateScribingAnswer(answerId, json);
  }

  renderPopover() {
    return this.layers && this.layers.length !== 0 ? (
      <Popover
        open={this.state.isPopoverOpen}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={() => (this.handlePopoverRequestClose(popoverTypes.LAYER))}
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

  renderLineStyleChips(toolType) {
    const lineStyles = ['solid', 'dotted', 'dashed'];
    const chips = [];
    lineStyles.forEach((style)=>(chips.push(
      <Chip
        backgroundColor={this.state.lineStyles[toolType] === style ? cyan500 : undefined}
        labelColor={this.state.lineStyles[toolType] === style ? grey50 : undefined}
        key={toolType + style}
        style={styles.chip}
        onTouchTap={(event) => this.handleTouchTapLineStyleChip(event, toolType, style)}
      >
        {style}
      </Chip>
    )));
    return chips;
  }

  renderToolBar() {
    const lineToolStyle = { 
      ...styles.custom_line,
      background: this.state.selectedTool === tools.LINE ? `black` : `rgba(0, 0, 0, 0.4)`,
    } 

    return (
      <Toolbar style={{...styles.toolbar, width: this.CANVAS_MAX_WIDTH}}>
        <ToolbarGroup>
          <div style={styles.tool} onClick={this.onClickTypingMode}>
            <div style={styles.innerTool}>
              <FontIcon className="fa fa-font" style={this.state.selectedTool === tools.TYPE ? {color: `black`} : {color: `rgba(0, 0, 0, 0.4)`}}/>
              <div style={{width:`23px`, height:`8px`, background: this.state.colors[toolColor.TYPE]}}/>
            </div>
            <div style={styles.innerTool}>
              <FontIcon className="fa fa-chevron-down" style={styles.chevron} onTouchTap={(event) => (this.handlePopoverTouchTap(event, popoverTypes.TYPE))}/>
            </div>

            <Popover
              style={styles.toolDropdowns}
              open={this.state.popovers.TYPE}
              anchorEl={this.state.popoverAnchor}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={() => (this.handlePopoverRequestClose(popoverTypes.TYPE))}
              animation={PopoverAnimationVertical}
            >
              <Menu style={styles.menu}>
                <div>
                  <label>Font</label>
                </div>
                <div>
                  <label>Font Family:</label>
                </div>
                <div>
                  <label>Size:</label>

                </div>
                <div>
                  <label>Colour:</label>
                  <div 
                    style={{background: this.state.colors[toolColor.TYPE], ...styles.colorPicker }}
                    onClick={(event) => (this.handleColorPickerClick(event, toolColor.TYPE))} />

                    <Popover
                      style={styles.toolDropdowns}
                      open={this.state.colorDropdowns[toolColor.TYPE]}
                      anchorEl={this.state.popoverColorPickerAnchor}
                      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                      onRequestClose={() => (this.handleColorPickerClose(toolColor.TYPE)) }
                      animation={PopoverAnimationVertical}
                    >
                      <SketchPicker
                        color={ this.state.colors[toolColor.TYPE] }
                        onChangeComplete={(color) => (this.handleOnChangeCompleteColor(color, toolColor.TYPE))}
                      />
                    </Popover>

                </div>
              </Menu>
            </Popover>

          </div>

          <div style={styles.tool} onClick={this.onClickDrawingMode}>
            <div style={styles.innerTool}>
              <FontIcon className="fa fa-pencil" style={this.state.selectedTool === tools.DRAW ? {color: `black`} : {color: `rgba(0, 0, 0, 0.4)`}}/>
              <div style={{width:`23px`, height:`8px`, background: this.state.colors[toolColor.DRAW]}}/>
            </div>
            <div style={styles.innerTool}>
              <FontIcon className="fa fa-chevron-down" style={styles.chevron} onTouchTap={(event) => (this.handlePopoverTouchTap(event, popoverTypes.DRAW))}/>
            </div>

            <Popover
              style={styles.toolDropdowns}
              open={this.state.popovers.DRAW}
              anchorEl={this.state.popoverAnchor}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={() => (this.handlePopoverRequestClose(popoverTypes.DRAW))}
              animation={PopoverAnimationVertical}
            >
              <Menu style={styles.menu}>
                <div>
                  <label>Pencil</label>
                </div>
                <div>
                  <label>Thickness:</label>
                  <Slider 
                    style={styles.slider} min={0} max={5} step={1} value={this.state.thickness[toolThickness.DRAW]}
                    onChange={(event, newValue) => (this.handleSliderThicknessOnChange(event, toolThickness.DRAW, newValue))}
                   />
                </div>
                <div>
                  <label>Colour:</label>
                  <div 
                    style={{background: this.state.colors[toolColor.DRAW], ...styles.colorPicker }}
                    onClick={(event) => (this.handleColorPickerClick(event, toolColor.DRAW))} />
                    <Popover
                      style={styles.toolDropdowns}
                      open={this.state.colorDropdowns[toolColor.DRAW]}
                      anchorEl={this.state.popoverColorPickerAnchor}
                      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                      onRequestClose={() => (this.handleColorPickerClose(toolColor.DRAW)) }
                      animation={PopoverAnimationVertical}
                    >
                      <SketchPicker
                        color={ this.state.colors[toolColor.DRAW] }
                        onChangeComplete={(color) => (this.handleOnChangeCompleteColor(color, toolColor.DRAW))}
                      />
                    </Popover>
                </div>
              </Menu>
            </Popover>
          </div>

          <div style={styles.tool} onClick={this.onClickLineMode} >
            <div style={styles.innerTool}>
              <div style={lineToolStyle}/>
              <div style={{width:`23px`, height:`8px`, background: this.state.colors[toolColor.LINE]}}/>
            </div>
            <div style={styles.innerTool}>
              <FontIcon className="fa fa-chevron-down" style={styles.chevron} onTouchTap={(event) => (this.handlePopoverTouchTap(event, popoverTypes.LINE))}/>
            </div>

            <Popover
              style={styles.toolDropdowns}
              open={this.state.popovers.LINE}
              anchorEl={this.state.popoverAnchor}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={() => (this.handlePopoverRequestClose(popoverTypes.LINE))}
              animation={PopoverAnimationVertical}
            >
              <Menu style={styles.menu}>
                <div>
                  <label>Line</label>
                </div>
                <div>
                  <label>Style:</label>
                  <div style={styles.chipWrapper}>
                    { this.renderLineStyleChips(toolLineStyle.LINE) }
                  </div>
                </div>
                <div>
                  <label>Thickness:</label>
                  <Slider style={styles.slider} min={0} max={5} step={1} value={this.state.thickness[toolThickness.LINE]}
                    onChange={(event, newValue) => (this.handleSliderThicknessOnChange(event, toolThickness.LINE, newValue))}
                  />
                </div>
                <div>
                  <label>Colour:</label>
                  <div 
                    style={{background: this.state.colors[toolColor.LINE], ...styles.colorPicker }}
                    onClick={(event) => (this.handleColorPickerClick(event, toolColor.LINE))} />
                    <Popover
                      style={styles.toolDropdowns}
                      open={this.state.colorDropdowns[toolColor.LINE]}
                      anchorEl={this.state.popoverColorPickerAnchor}
                      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                      onRequestClose={() => (this.handleColorPickerClose(toolColor.LINE)) }
                      animation={PopoverAnimationVertical}
                    >
                      <SketchPicker
                        color={ this.state.colors[toolColor.LINE] }
                        onChangeComplete={(color) => (this.handleOnChangeCompleteColor(color, toolColor.LINE))}
                        disableAlpha={false}
                      />
                    </Popover>
                </div>
              </Menu>
            </Popover>
          </div>

          <div style={styles.tool} onClick={this.onClickShapeMode} >
            <div style={styles.innerTool}>
              <FontIcon
                className={
                  this.state.selectedShape === shapes.RECT ? 'fa fa-square-o' : 'fa fa-circle-o'
                }
                style={this.state.selectedTool === tools.SHAPE ? {color: `black`} : {color: `rgba(0, 0, 0, 0.4)`}}
              />
              <div style={{width:`23px`, height:`8px`,
                border: `${this.state.colors[toolColor.SHAPE_BORDER]} 2px solid`,
                background: this.state.colors[toolColor.SHAPE_FILL]}}/>
            </div>
            <div style={styles.innerTool}>
              <FontIcon className="fa fa-chevron-down" style={styles.chevron} onTouchTap={(event) => (this.handlePopoverTouchTap(event, popoverTypes.SHAPE))}/>
            </div>

            <Popover
              style={styles.toolDropdowns}
              open={this.state.popovers.SHAPE}
              anchorEl={this.state.popoverAnchor}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={() => (this.handlePopoverRequestClose(popoverTypes.SHAPE))}
              animation={PopoverAnimationVertical}
            >
              <Menu style={styles.menu}>
                <div>
                  <div>
                    <label>Shape</label>
                  </div>
                  <div>
                    <IconButton tooltip="Square" tooltipPosition="top-center">
                      <FontIcon className="fa fa-square-o" onClick={() => (this.setState({selectedShape: shapes.RECT}))}/>
                    </IconButton>
                    <IconButton tooltip="Ellipse" tooltipPosition="top-center">
                      <FontIcon className="fa fa-circle-o" onClick={() => (this.setState({selectedShape: shapes.ELLIPSE}))}/>
                    </IconButton>
                  </div>
                </div>
                <Divider />
                <div>
                  <div>
                    <label>Border</label>
                  </div>
                  <label>Style:</label>
                  <div style={styles.chipWrapper}>
                    { this.renderLineStyleChips(toolLineStyle.SHAPE_BORDER) }
                  </div>
                  <div>
                    <label>Thickness:</label>
                    <Slider style={styles.slider} min={0} max={5} step={1} value={this.state.thickness[toolThickness.SHAPE_BORDER]}
                      onChange={(event, newValue) => (this.handleSliderThicknessOnChange(event, toolThickness.SHAPE_BORDER, newValue))}
                    />
                  </div>
                  <div>
                    <label>Colour:</label>
                    <div 
                      style={{background: this.state.colors[toolColor.SHAPE_BORDER], ...styles.colorPicker }}
                      onClick={(event) => (this.handleColorPickerClick(event, toolColor.SHAPE_BORDER))} />
                      <Popover
                        style={styles.toolDropdowns}
                        open={this.state.colorDropdowns[toolColor.SHAPE_BORDER]}
                        anchorEl={this.state.popoverColorPickerAnchor}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={() => (this.handleColorPickerClose(toolColor.SHAPE_BORDER)) }
                        animation={PopoverAnimationVertical}
                      >
                        <SketchPicker
                          color={ this.state.colors[toolColor.SHAPE_BORDER] }
                          onChangeComplete={(color) => (this.handleOnChangeCompleteColor(color, toolColor.SHAPE_BORDER))}
                        />
                      </Popover>
                  </div>
                </div>
                <Divider />
                <div>
                  <label>Fill</label>
                </div>
                <div>
                  <label>Colour:</label>
                    <div 
                    style={{
                      background: this.state.colors[toolColor.SHAPE_FILL], 
                      ...styles.colorPicker }}
                    onClick={(event) => (this.handleColorPickerClick(event, toolColor.SHAPE_FILL))} />
                    <Popover
                      style={styles.toolDropdowns}
                      open={this.state.colorDropdowns[toolColor.SHAPE_FILL]}
                      anchorEl={this.state.popoverColorPickerAnchor}
                      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                      onRequestClose={() => (this.handleColorPickerClose(toolColor.SHAPE_FILL)) }
                      animation={PopoverAnimationVertical}
                    >
                      <SketchPicker
                        color={ this.state.colors[toolColor.SHAPE_FILL] }
                        onChangeComplete={(color) => (this.handleOnChangeCompleteColor(color, toolColor.SHAPE_FILL))}
                      />
                    </Popover>
                </div>
              </Menu>
            </Popover>
          </div>

        </ToolbarGroup>
        <ToolbarGroup>
          <FontIcon className="fa fa-hand-pointer-o" style={this.state.selectedTool === tools.SELECT ? {color: `black`} : {}}
            onClick={this.onClickSelectionMode}/>
          <RaisedButton
            onTouchTap={(event) => (this.handlePopoverTouchTap(event, popoverTypes.LAYER))}
            label="Layers"
            disabled={this.layers && this.layers.length === 0}
          />
          { this.renderPopover() }
        </ToolbarGroup>
        <ToolbarGroup>
          <FontIcon className="fa fa-arrows" style={this.state.selectedTool === tools.PAN ? {color: `black`} : {}}
            onClick={this.onClickPanMode} />
          <FontIcon className="fa fa-search-plus" style={this.state.selectedTool === tools.ZOOM_IN ? {color: `black`} : {}}
            onClick={this.onClickZoomIn} />
          <FontIcon className="fa fa-search-minus" style={this.state.selectedTool === tools.ZOOM_OUT ? {color: `black`} : {}}
            onClick={this.onClickZoomOut} />
        </ToolbarGroup>
        <ToolbarGroup>
          <FontIcon className="fa fa-trash-o" style={this.state.selectedTool === tools.DELETE ? {color: `black`} : {}}
            onClick={this.onClickDelete}/>
        </ToolbarGroup>
        <ToolbarGroup>
          { this.renderSavingStatus() }
        </ToolbarGroup>
      </Toolbar>
    )
  }

  render() {
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