import React, { PropTypes } from 'react';
import { Canvas } from 'react-fabricjs';

import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import { injectIntl, intlShape } from 'react-intl';

import translations from './ScribingAnswerForm.intl';

import { answerShape } from '../../propTypes';
import { tools, shapes, toolColor, toolThickness, toolLineStyle, popoverTypes } from '../../constants';

import SavingIndicator from '../../components/SavingIndicator';
import ToolDropdown from '../../components/ToolDropdown';
import TypePopover from '../../components/popovers/TypePopover';
import DrawPopover from '../../components/popovers/DrawPopover';
import LinePopover from '../../components/popovers/LinePopover';
import ShapePopover from '../../components/popovers/ShapePopover';

const propTypes = {
  actions: React.PropTypes.shape({
    setCanvasLoaded: PropTypes.func.isRequired,
    // fetchScribingAnswer: PropTypes.func.isRequired,
    setUpScribingAnswer: PropTypes.func.isRequired,
    clearSavingStatus: PropTypes.func.isRequired,
    updateScribingAnswer: PropTypes.func.isRequired,
    updateScribingAnswerInLocal: PropTypes.func.isRequired,
  }),
  scribingAnswer: PropTypes.shape({
    answer: answerShape,
    is_loading: PropTypes.bool,
    is_canvas_loaded: PropTypes.bool,
    is_saving: PropTypes.bool,
    is_saved: PropTypes.bool,
    save_errors: PropTypes.array(PropTypes.string),
  }),
  data: answerShape.isRequired,
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
      fontFamily: 'Arial',
      fontSize: 12,
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
  }

  // Event handlers

  onChangeCompleteColor = (color, coloringTool) => {
    if (coloringTool === toolColor.DRAW) {
      this.canvas.freeDrawingBrush.color = this.getRgbaHelper(color.rgb);
    }

    this.setState({
      colors: { ...this.state.colors, [coloringTool]: this.getRgbaHelper(color.rgb)},
    });
  }

  onChangeFontFamily = (event, index, value) => {
    this.setState({
      fontFamily: value,
    });
  }

  onChangeFontSize = (event, index, value) => {
    this.setState({
      fontSize: value,
    });
  }

  onClickColorPicker = (event, toolType) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      popoverColorPickerAnchor: event.currentTarget,
      colorDropdowns: { ...this.state.popovers, [toolType]: true },
    });
  }

  onRequestCloseColorPicker = (toolType) => {
    this.setState({
      colorDropdowns: { ...this.state.popovers, [toolType]: false },
    });
  }

  onTouchTapPopover = (event, popoverType) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      popovers: { ...this.state.popovers, [popoverType]: true },
      popoverAnchor: event.currentTarget.parentElement.parentElement,
    });
  }

  onRequestClosePopover = (popoverType) => {
    this.setState({
      popovers: { ...this.state.popovers, [popoverType]: false },
    });
  }

  onTouchTapLineStyleChip = (event, toolType, style) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      lineStyles: { ...this.state.lineStyles, [toolType]: style},
    });
  }

  onChangeSliderThickness = (event, toolType, value) => {
    if (toolType === toolThickness.DRAW) {
      this.canvas.freeDrawingBrush.width = value;
    }

    this.setState({
      thickness: { ...this.state.thickness, [toolType]: value}
    })
  }

  onClickTypingMode = () => {
    this.canvas.isDrawingMode = false;
    this.disableObjectSelection();
    this.setState({selectedTool: tools.TYPE});
  }

  onClickDrawingMode = () => {
    // isDrawingMode automatically disables selection mode 
    // in fabric.js library
    this.canvas.isDrawingMode = true;
    this.setState({selectedTool: tools.DRAW})
  }

  onClickLineMode = () => {
    this.canvas.isDrawingMode = false;
    this.disableObjectSelection();
    this.setState({selectedTool: tools.LINE})
  }

  onClickShapeMode = () => {
    this.canvas.isDrawingMode = false;
    this.disableObjectSelection();
    this.setState({selectedTool: tools.SHAPE});
  }

  onClickSelectionMode = () => {
    this.canvas.isDrawingMode = false;
    this.enableObjectSelection();
    this.setState({selectedTool: tools.SELECT})
  }

  onClickPanMode = () => {
    this.canvas.isDrawingMode = false;
    this.disableObjectSelection();
    this.setState({selectedTool: tools.PAN})
  }

  onClickZoomIn = () => {
    let newZoom = this.canvas.getZoom() + 0.1;
    this.canvas.zoomToPoint({
      x: this.canvas.height / 2,
      y: this.canvas.width / 2,
    }, newZoom);
  }

  onClickZoomOut = () => {
    let newZoom = Math.max(this.canvas.getZoom() - 0.1, 1);
    this.canvas.zoomToPoint({
      x: this.canvas.height / 2,
      y: this.canvas.width / 2,
    }, newZoom);
  }

  onClickDelete = () => {
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

  setSelectedShape = (shape) => {
   this.setState({
    selectedShape: shape,
   });
  }

  // Helpers

  getRgbaHelper(json) {
    return 'rgba(' + json.r + ',' + json.g + ',' + json.b + ',' + json.a + ')';
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

        if (isMouseDrag) {
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
            case 'i-text':
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

  addText = () => {
    this.canvas.add(new fabric.IText('Text', { 
      fontFamily: this.state.fontFamily,
      fontSize: this.state.fontSize,
      fill: this.state.colors[toolColor.TYPE],
      left: this.canvas.width / 2, 
      top: this.canvas.height / 2 ,
    }));
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

  renderLayersPopover() {
    return this.layers && this.layers.length !== 0 ? (
      <Popover
        open={this.state.isPopoverOpen}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={() => (this.onRequestClosePopover(popoverTypes.LAYER))}
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
    const lineToolStyle = { 
      ...styles.custom_line,
      background: this.state.selectedTool === tools.LINE ? `black` : `rgba(0, 0, 0, 0.4)`,
    } 

    return (
      <Toolbar style={{...styles.toolbar, width: this.CANVAS_MAX_WIDTH}}>
        <ToolbarGroup>
          <ToolDropdown
            toolType={tools.TYPE}
            currentTool={this.state.selectedTool}
            onClick={this.onClickTypingMode}
            onClickIcon={this.addText}
            colorBar={this.state.colors[toolColor.TYPE]}
            onTouchTapChevron={(event) => (this.onTouchTapPopover(event, popoverTypes.TYPE))}
            iconClassname="fa fa-font"
            popoverComponent={()=>(
              <TypePopover
                open={this.state.popovers.TYPE}
                anchorEl={this.state.popoverAnchor}
                onRequestClose={() => (this.onRequestClosePopover(popoverTypes.TYPE))}
                fontFamilyValue={this.state.fontFamily}
                onChangeFontFamily={this.onChangeFontFamily}
                fontSizeValue={this.state.fontSize}
                onChangeFontSize={this.onChangeFontSize}
                onClickColorPicker={(event) => (this.onClickColorPicker(event, toolColor.TYPE))}
                colorPickerPopoverOpen={this.state.colorDropdowns[toolColor.TYPE]}
                colorPickerPopoverAnchorEl={this.state.popoverColorPickerAnchor}
                onRequestCloseColorPickerPopover={() => (this.onRequestCloseColorPicker(toolColor.TYPE))}
                colorPickerColor={this.state.colors[toolColor.TYPE]}
                onChangeCompleteColorPicker={(color) => (this.onChangeCompleteColor(color, toolColor.TYPE))}
              />)}
          />
          <ToolDropdown
            toolType={tools.DRAW}
            currentTool={this.state.selectedTool}
            onClick={this.onClickDrawingMode}
            colorBar={this.state.colors[toolColor.DRAW]}
            onTouchTapChevron={(event) => (this.onTouchTapPopover(event, popoverTypes.DRAW))}
            iconClassname="fa fa-pencil"
            popoverComponent={()=>(
              <DrawPopover
                open={this.state.popovers.DRAW}
                anchorEl={this.state.popoverAnchor}
                onRequestClose={() => (this.onRequestClosePopover(popoverTypes.DRAW))}
                toolThicknessValue={this.state.thickness[toolThickness.DRAW]}
                onChangeSliderThickness={(event, newValue) => (this.onChangeSliderThickness(event, toolThickness.DRAW, newValue))}
                colorPickerColor={this.state.colors[toolColor.DRAW]}
                onClickColorPicker={(event) => (this.onClickColorPicker(event, toolColor.DRAW))}
                colorPickerPopoverOpen={this.state.colorDropdowns[toolColor.DRAW]}
                colorPickerPopoverAnchorEl={this.state.popoverColorPickerAnchor}
                onRequestCloseColorPickerPopover={() => (this.onRequestCloseColorPicker(toolColor.DRAW)) }
                onChangeCompleteColorPicker={(color) => (this.onChangeCompleteColor(color, toolColor.DRAW))}
              />
            )}
          />
          <ToolDropdown
            toolType={tools.LINE}
            currentTool={this.state.selectedTool}
            onClick={this.onClickLineMode}
            colorBar={this.state.colors[toolColor.LINE]}
            onTouchTapChevron={(event) => (this.onTouchTapPopover(event, popoverTypes.LINE))}
            iconComponent={()=>(<div style={lineToolStyle}/>)}
            popoverComponent={()=>(
              <LinePopover
                lineToolType={toolThickness.LINE}
                open={this.state.popovers.LINE}
                anchorEl={this.state.popoverAnchor}
                onRequestClose={() => (this.onRequestClosePopover(popoverTypes.LINE))}
                selectedLineStyle={this.state.lineStyles[toolLineStyle.LINE]}
                onTouchTapLineStyleChip={this.onTouchTapLineStyleChip}
                toolThicknessValue={this.state.thickness[toolThickness.LINE]}
                onChangeSliderThickness={(event, newValue) => (this.onChangeSliderThickness(event, toolThickness.LINE, newValue))}
                colorPickerColor={this.state.colors[toolColor.LINE]}
                onClickColorPicker={(event) => (this.onClickColorPicker(event, toolColor.LINE))}
                colorPickerPopoverOpen={this.state.colorDropdowns[toolColor.LINE]}
                colorPickerPopoverAnchorEl={this.state.popoverColorPickerAnchor}
                onRequestCloseColorPickerPopover={() => (this.onRequestCloseColorPicker(toolColor.LINE)) }
                onChangeCompleteColorPicker={(color) => (this.onChangeCompleteColor(color, toolColor.LINE))}
              />
            )}
          />
          <ToolDropdown
            toolType={tools.SHAPE}
            currentTool={this.state.selectedTool}
            onClick={this.onClickShapeMode}
            colorBarComponent={()=>(
              <div style={
                {
                  width:`23px`,
                  height:`8px`,
                  border: `${this.state.colors[toolColor.SHAPE_BORDER]} 2px solid`,
                  background: this.state.colors[toolColor.SHAPE_FILL]
                }
              }/>
            )}
            onTouchTapChevron={(event) => (this.onTouchTapPopover(event, popoverTypes.SHAPE))}
            iconClassname={this.state.selectedShape === shapes.RECT ? 'fa fa-square-o' : 'fa fa-circle-o'}
            popoverComponent={()=>(
              <ShapePopover
                lineToolType={toolThickness.SHAPE_BORDER}
                open={this.state.popovers.SHAPE}
                anchorEl={this.state.popoverAnchor}
                onRequestClose={() => (this.onRequestClosePopover(popoverTypes.SHAPE))}
                setSelectedShape={(shape) => (this.setSelectedShape(shape))}
                selectedLineStyle={this.state.lineStyles[toolLineStyle.SHAPE_BORDER]}
                onTouchTapLineStyleChip={this.onTouchTapLineStyleChip}
                toolThicknessValue={this.state.thickness[toolThickness.SHAPE_BORDER]}
                onChangeSliderThickness={(event, newValue) => (this.onChangeSliderThickness(event, toolThickness.SHAPE_BORDER, newValue))}
                borderColorPickerColor={this.state.colors[toolColor.SHAPE_BORDER]}
                onClickBorderColorPicker={(event) => (this.onClickColorPicker(event, toolColor.SHAPE_BORDER))}
                borderColorPickerPopoverOpen={this.state.colorDropdowns[toolColor.SHAPE_BORDER]}
                borderColorPickerPopoverAnchorEl={this.state.popoverColorPickerAnchor}
                onRequestCloseBorderColorPickerPopover={() => (this.onRequestCloseColorPicker(toolColor.SHAPE_BORDER)) }
                onChangeCompleteBorderColorPicker={(color) => (this.onChangeCompleteColor(color, toolColor.SHAPE_BORDER))}
                fillColorPickerColor={this.state.colors[toolColor.SHAPE_FILL]}
                onClickFillColorPicker={(event) => (this.onClickColorPicker(event, toolColor.SHAPE_FILL))}
                fillColorPickerPopoverOpen={this.state.colorDropdowns[toolColor.SHAPE_FILL]}
                fillColorPickerPopoverAnchorEl={this.state.popoverColorPickerAnchor}
                onRequestCloseFillColorPickerPopover={() => (this.onRequestCloseColorPicker(toolColor.SHAPE_FILL)) }
                onChangeCompleteFillColorPicker={(color) => (this.onChangeCompleteColor(color, toolColor.SHAPE_FILL))}
              />
            )}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <FontIcon className="fa fa-hand-pointer-o" style={this.state.selectedTool === tools.SELECT ? {color: `black`} : {}}
            onClick={this.onClickSelectionMode}/>
          <RaisedButton
            onTouchTap={(event) => (this.onTouchTapPopover(event, popoverTypes.LAYER))}
            label="Layers"
            disabled={this.layers && this.layers.length === 0}
          />
          { this.renderLayersPopover() }
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
          <SavingIndicator 
            is_saving={this.props.scribingAnswer.is_saving}
            is_saved={this.props.scribingAnswer.is_saved}
            save_errors={this.props.scribingAnswer.save_errors}
            clearSavingStatus={this.props.actions.clearSavingStatus}
          />
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