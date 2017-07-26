/* eslint no-mixed-operators: "off" */
/* eslint react/sort-comp: "off" */
import React, { PropTypes } from 'react';
import { Canvas } from 'react-fabricjs'; // eslint-disable-line no-unused-vars
import { injectIntl, intlShape } from 'react-intl';

import FontIcon from 'material-ui/FontIcon';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MaterialTooltip from 'material-ui/internal/Tooltip';
import LoadingIndicator from 'lib/components/LoadingIndicator';

import SavingIndicator from '../../components/SavingIndicator';
import ToolDropdown from '../../components/ToolDropdown';
import LayersComponent from '../../components/LayersComponent';
import TypePopover from '../../components/popovers/TypePopover';
import DrawPopover from '../../components/popovers/DrawPopover';
import LinePopover from '../../components/popovers/LinePopover';
import ShapePopover from '../../components/popovers/ShapePopover';

import { answerShape } from '../../propTypes';
import translations from '../../translations';
import { tools, shapes, toolColor, toolThickness, toolLineStyle, popoverTypes } from '../../constants';

/* NOTE: Denormalizing and normalizing scribble code is brought over
  * from Coursemology v1. They are not needed for the scribing
  * question to work but it is required to support scribing questions
  * that were migrated over.
*/

const propTypes = {
  intl: intlShape.isRequired,
  actions: React.PropTypes.shape({
    setCanvasLoaded: PropTypes.func.isRequired,
    setUpScribingAnswer: PropTypes.func.isRequired,
    clearSavingStatus: PropTypes.func.isRequired,
    updateScribingAnswer: PropTypes.func.isRequired,
    updateScribingAnswerInLocal: PropTypes.func.isRequired,
  }),
  scribingAnswer: PropTypes.shape({
    answer: answerShape,
    isLoading: PropTypes.bool,
    isCanvasLoaded: PropTypes.bool,
    isSaving: PropTypes.bool,
    isSaved: PropTypes.bool,
    hasError: PropTypes.bool,
  }),
  data: answerShape.isRequired,
};

const styles = {
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
  canvas_div: {
    alignItems: 'center',
    margin: 'auto',
  },
  canvas: {
    width: '100%',
    border: '1px solid black',
  },
  toolbar: {
    marginBottom: '1em',
  },
  custom_line: {
    display: 'inline-block',
    position: 'inherit',
    width: '25px',
    height: '21px',
    marginLeft: '-2px',
    transform: 'scale(1.0, 0.2) rotate(90deg) skewX(76deg)',
  },
  tool: {
    position: 'relative',
    display: 'inline-block',
    paddingRight: '24px',
  },
};

class ScribingAnswerForm extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTool: tools.SELECT,
      selectedShape: shapes.RECT,
      hoveredToolTip: '',
      imageWidth: 0,
      imageHeight: 0,
      fontFamily: 'Arial',
      fontSize: 12,
      colors: [],
      colorDropdowns: [],
      lineStyles: [],
      thickness: [],
      popovers: [],
      popoverAnchor: undefined,
      popoverColorPickerAnchor: undefined,
    };

    this.viewportLeft = 0;
    this.viewportTop = 0;
  }

  componentDidMount() {
    const initializeAnswer = () => {
      this.props.actions.setUpScribingAnswer(this.props.data);
    };

    const initializeToolColor = () => {
      Object.values(toolColor).forEach(toolType =>
       (this.state.colors[toolType] = '#000000')
      );
    };

    const initializeToolThickness = () => {
      Object.values(toolThickness).forEach(toolType =>
       (this.state.thickness[toolType] = 1)
      );
    };

    const initializeLineStyles = () => {
      Object.values(toolLineStyle).forEach(toolType =>
       (this.state.lineStyles[toolType] = 'solid')
      );
    };

    const initializeColorDropdowns = () => {
      Object.values(toolColor).forEach(toolType =>
       (this.state.colorDropdowns[toolType] = false)
      );
    };

    const initializePopovers = () => {
      Object.values(popoverTypes).forEach(popoverType =>
       (this.state.popovers[popoverType] = false)
      );
    };

    initializeAnswer();
    initializeToolColor();
    initializeToolThickness();
    initializeLineStyles();
    initializeColorDropdowns();
    initializePopovers();
  }

  shouldComponentUpdate(nextProps) {
    // Don't update until canvas is ready
    if (!this.props.scribingAnswer.isCanvasLoaded
        // Don't allow the canvas to initialize twice
        && !nextProps.scribingAnswer.isCanvasLoaded
        && nextProps.scribingAnswer.answer.answer_id
        && nextProps.scribingAnswer.answer.image_path
      ) {
      this.initializeCanvas(
        nextProps.scribingAnswer.answer.answer_id,
        nextProps.scribingAnswer.answer.image_path);
    } else if (this.props.scribingAnswer.isCanvasLoaded) {
      this.updateScribbles();
    }
    return true;
  }

  // Toolbar Event handlers

  onChangeCompleteColor = (color, coloringTool) => {
    if (coloringTool === toolColor.DRAW) {
      this.canvas.freeDrawingBrush.color = this.getRgbaHelper(color.rgb);
    }

    this.setState({
      colors: { ...this.state.colors, [coloringTool]: this.getRgbaHelper(color.rgb) },
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
      popoverAnchor: popoverType === popoverTypes.LAYER ?
            event.currentTarget :
            event.currentTarget.parentElement.parentElement,
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
      lineStyles: { ...this.state.lineStyles, [toolType]: style },
    });
  }

  onChangeSliderThickness = (event, toolType, value) => {
    if (toolType === toolThickness.DRAW) {
      this.canvas.freeDrawingBrush.width = value;
    }

    this.setState({
      thickness: { ...this.state.thickness, [toolType]: value },
    });
  }

  onClickTypingMode = () => {
    this.setState({ selectedTool: tools.TYPE });
    this.canvas.isDrawingMode = false;
    this.canvas.defaultCursor = 'pointer';
    this.enableTextSelection();
  }

  onClickTypingIcon = () => {
    this.onClickTypingMode();
    this.addText();
  }

  onClickTypingChevron = (event) => {
    this.onClickTypingMode();
    this.onTouchTapPopover(event, popoverTypes.TYPE);
  }

  onClickDrawingMode = () => {
    this.setState({ selectedTool: tools.DRAW });
    // isDrawingMode automatically disables selection mode in fabric.js
    this.canvas.isDrawingMode = true;
  }

  onClickLineMode = () => {
    this.setState({ selectedTool: tools.LINE });
    this.canvas.isDrawingMode = false;
    this.canvas.defaultCursor = 'crosshair';
    this.disableObjectSelection();
  }

  onClickShapeMode = () => {
    this.setState({ selectedTool: tools.SHAPE });
    this.canvas.isDrawingMode = false;
    this.canvas.defaultCursor = 'crosshair';
    this.disableObjectSelection();
  }

  onClickSelectionMode = () => {
    this.setState({ selectedTool: tools.SELECT });
    this.canvas.isDrawingMode = false;
    this.canvas.defaultCursor = 'pointer';
    this.enableObjectSelection();
  }

  onClickPanMode = () => {
    this.setState({ selectedTool: tools.PAN });
    this.canvas.isDrawingMode = false;
    this.canvas.defaultCursor = 'move';
    this.disableObjectSelection();
  }

  onClickZoomIn = () => {
    const newZoom = this.canvas.getZoom() + 0.1;
    this.canvas.zoomToPoint({
      x: this.canvas.height / 2,
      y: this.canvas.width / 2,
    }, newZoom);
  }

  onClickZoomOut = () => {
    const newZoom = Math.max(this.canvas.getZoom() - 0.1, 1);
    this.canvas.zoomToPoint({
      x: this.canvas.height / 2,
      y: this.canvas.width / 2,
    }, newZoom);
    this.canvas.trigger('mouse:move', { isForced: true });
  }

  onClickDelete = () => {
    const activeGroup = this.canvas.getActiveGroup();
    const activeObject = this.canvas.getActiveObject();

    if (activeObject) {
      this.canvas.remove(activeObject);
    } else if (activeGroup) {
      const objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      objectsInGroup.forEach(object => (this.canvas.remove(object)));
    }
  }

  onMouseEnter(tool) {
    this.setState({ hoveredToolTip: tool });
  }

  onMouseLeave = () => {
    this.setState({ hoveredToolTip: '' });
  }

  // Canvas Event Handlers

  onMouseDownCanvas = (options) => {
    this.mouseDragFlag = false;
    this.mouseCanvasDragStartPoint = this.getCanvasPoint(options.e);

    // To facilitate panning
    this.mouseDownFlag = true;
    this.viewportLeft = this.canvas.viewportTransform[4];
    this.viewportTop = this.canvas.viewportTransform[5];
    this.mouseStartPoint = this.getMousePoint(options.e);
  }

  onMouseMoveCanvas = (options) => {
    this.mouseDragFlag = true;

    // Do panning action
    const tryPan = (left, top) => {
      // limit panning
      let finalLeft = Math.min(left, 0);
      finalLeft = Math.max(finalLeft, (this.canvas.getZoom() - 1) * this.canvas.getWidth() * -1);
      let finalTop = Math.min(top, 0);
      finalTop = Math.max(finalTop, (this.canvas.getZoom() - 1) * this.canvas.getHeight() * -1);

      // apply calculated pan transforms
      this.canvas.viewportTransform[4] = finalLeft;
      this.canvas.viewportTransform[5] = finalTop;
      this.canvas.renderAll();
    };

    if (this.state.selectedTool === tools.PAN && this.mouseDownFlag) {
      const mouseCurrentPoint = this.getMousePoint(options.e);
      const deltaLeft = mouseCurrentPoint.x - this.mouseStartPoint.x;
      const deltaTop = mouseCurrentPoint.y - this.mouseStartPoint.y;
      const newLeft = this.viewportLeft + deltaLeft;
      const newTop = this.viewportTop + deltaTop;
      tryPan(newLeft, newTop);
    } else if (options.isForced) {
      // Facilitates zooming out
      tryPan(this.canvas.viewportTransform[4], this.canvas.viewportTransform[5]);
    }
  }

  onMouseUpCanvas = (options) => {
    this.mouseDownFlag = false;
    this.mouseCanvasDragEndPoint = this.getCanvasPoint(options.e);

    const getVectorDist = () => (
      (this.mouseCanvasDragStartPoint.x - this.mouseCanvasDragEndPoint.x)
      * (this.mouseCanvasDragStartPoint.x - this.mouseCanvasDragEndPoint.x)
      + (this.mouseCanvasDragStartPoint.y - this.mouseCanvasDragEndPoint.y)
      * (this.mouseCanvasDragStartPoint.y - this.mouseCanvasDragEndPoint.y)
    );

    const getStrokeDashArray = (toolType) => {
      switch (this.state.lineStyles[toolType]) {
        case 'dotted': {
          return [1, 3];
        }
        case 'dashed': {
          return [10, 5];
        }
        case 'solid':
        default: {
          return [];
        }
      }
    };

    const minDistThreshold = 25;
    const passedDistThreshold = getVectorDist() > minDistThreshold;
    const isMouseDrag = this.mouseDragFlag === true && passedDistThreshold;

    if (isMouseDrag) {
      if (this.state.selectedTool === tools.LINE) {
        const strokeDashArray = getStrokeDashArray(toolLineStyle.LINE);
        const line = new fabric.Line( // eslint-disable-line no-undef
          [
            this.mouseCanvasDragStartPoint.x, this.mouseCanvasDragStartPoint.y,
            this.mouseCanvasDragEndPoint.x, this.mouseCanvasDragEndPoint.y,
          ],
          {
            stroke: `${this.state.colors[toolColor.LINE]}`,
            strokeWidth: this.state.thickness[toolThickness.LINE],
            strokeDashArray,
            selectable: false,
          }
        );
        this.canvas.add(line);
      } else if (this.state.selectedTool === tools.SHAPE) {
        const strokeDashArray = getStrokeDashArray(toolLineStyle.SHAPE_BORDER);
        switch (this.state.selectedShape) {
          case shapes.RECT: {
            const dragProps = this.generateMouseDragProperties(
              this.mouseCanvasDragStartPoint,
              this.mouseCanvasDragEndPoint
            );
            const rect = new fabric.Rect({ // eslint-disable-line no-undef
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
            const dragProps = this.generateMouseDragProperties(
              this.mouseCanvasDragStartPoint,
              this.mouseCanvasDragEndPoint
            );
            const ellipse = new fabric.Ellipse({ // eslint-disable-line no-undef
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
          default: {
            break;
          }
        }
      }
    }
  }

  // Limit moving of objects to within the canvas
  onObjectMovingCanvas = (options) => {
    const obj = options.target;
     // if object is too big ignore
    if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
      return;
    }
    obj.setCoords();
    // top-left  corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
      obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
      obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
    }
    // bot-right corner
    if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height
      || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
      obj.top = Math.min(obj.top,
        (obj.canvas.height - obj.getBoundingRect().height
        + obj.top - obj.getBoundingRect().top));
      obj.left = Math.min(obj.left,
        (obj.canvas.width - obj.getBoundingRect().width
        + obj.left - obj.getBoundingRect().left));
    }
  }

  // Helpers

  // Function Helpers

  disableObjectSelection() {
    this.canvas.forEachObject(object => (
      object.selectable = false // eslint-disable-line no-param-reassign
    ));
  }

  // This method only enable selection for interactive texts
  enableTextSelection() {
    this.canvas.clear();
    this.initializeScribbles();
    this.canvas.forEachObject(object => (
      // eslint-disable-next-line no-param-reassign
      object.selectable = (object.type === 'i-text')
    ));
  }

  // This method clears the selection-disabled scribbles
  // and reloads them to enable selection again
  enableObjectSelection() {
    this.canvas.clear();
    this.initializeScribbles();
  }

  setSelectedShape = (shape) => {
    this.setState({
      selectedShape: shape,
    });
  }

  addText = () => {
    // eslint-disable-next-line no-undef
    this.canvas.add(new fabric.IText('Text', { // eslint-disable-line no-undef
      fontFamily: this.state.fontFamily,
      fontSize: this.state.fontSize,
      fill: this.state.colors[toolColor.TYPE],
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
    }));
  }

  // Legacy code needed to support migrated v1 scribing questions.
  // This code scales/unscales the scribbles by a standard number.
  normaliseScribble(scribble, isDenormalise) {
    const STANDARD = 1000;
    let factor;

    if (isDenormalise) {
      factor = this.canvas.getWidth() / STANDARD;
    } else {
      factor = STANDARD / this.canvas.getWidth();
    }

    scribble.set({
      scaleX: scribble.scaleX * factor,
      scaleY: scribble.scaleY * factor,
      left: scribble.left * factor,
      top: scribble.top * factor,
    });
  }

  denormaliseScribble(scribble) {
    return this.normaliseScribble(scribble, true);
  }

  initializeScribbles() {
    const { scribbles } = this.props.scribingAnswer.answer;
    const userId = this.props.scribingAnswer.answer.user_id;

    this.isScribblesLoaded = false;
    this.layers = [];
    let userScribble = [];

    if (scribbles) {
      scribbles.forEach((scribble) => {
        const objects = JSON.parse(scribble.content).objects;
        const fabricObjs = [];

        // Parse JSON to Fabric.js objects
        for (let i = 0; i < objects.length; i++) {
          // eslint-disable-next-line no-undef
          const klass = fabric.util.getKlass(objects[i].type);
          switch (objects[i].type) {
            case 'path': {
              klass.fromObject(objects[i], (obj) => {
                this.denormaliseScribble(obj);
                fabricObjs.push(obj);
              });
              break;
            }
            case 'i-text':
            case 'line':
            case 'rect':
            case 'ellipse': {
              const obj = klass.fromObject(objects[i]);
              this.denormaliseScribble(obj);
              fabricObjs.push(obj);
              break;
            }
            default: {
              break;
            }
          }
        }

        // Create layer for each user's scribble

        // Layer for other users' scribble
        // Disables scribble selection
        if (scribble.creator_id !== userId) {
          // eslint-disable-next-line no-undef
          const scribbleGroup = new fabric.Group(fabricObjs);
          scribbleGroup.selectable = false;

          const showLayer = (isShown) => {
            // eslint-disable-next-line no-param-reassign
            scribbleGroup._objects.forEach(obj => (obj.visible = isShown));
            this.canvas.renderAll();
          };
          // Populate layers list
          const newScribble = {
            ...scribble,
            isDisplayed: true,
            showLayer,
          };
          this.layers = [...this.layers, newScribble];
          this.canvas.add(scribbleGroup);
        } else {
          // Add other user's layers first to avoid blocking of user's layer
          userScribble = fabricObjs;
        }
      });

      // Layer for current user's scribble
      // Enables scribble selection
      userScribble.map(obj => (this.canvas.add(obj)));
    }
    this.isScribblesLoaded = true;
  }

  initializeCanvas(answerId, imagePath) {
    const _self = this;
    const imageUrl = `${window.location.origin}/${imagePath}`;
    this.image = new Image(); // eslint-disable-line no-undef
    this.image.src = imageUrl;

    this.image.onload = () => {
      // Get the calculated width of canvas, 750 is min width for scribing toolbar
      const element = document.getElementById(`canvas-${answerId}`);
      this.CANVAS_MAX_WIDTH = Math.max(element.getBoundingClientRect().width, 750);

      this.width = Math.min(this.image.width, this.CANVAS_MAX_WIDTH);
      this.scale = Math.min(this.width / this.image.width, 1);
      this.height = this.scale * this.image.height;

      // eslint-disable-next-line no-undef
      const canvas = new fabric.Canvas(`canvas-${answerId}`, {
        width: this.width,
        height: this.height,
        preserveObjectStacking: true,
      });

      const fabricImage = new fabric.Image( // eslint-disable-line no-undef
        this.image,
        { opacity: 1, scaleX: this.scale, scaleY: this.scale }
      );
      canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas));

      _self.canvas = canvas;
      _self.canvas.on('mouse:down', this.onMouseDownCanvas);
      _self.canvas.on('mouse:move', this.onMouseMoveCanvas);
      _self.canvas.on('mouse:up', this.onMouseUpCanvas);
      _self.canvas.observe('object:moving', this.onObjectMovingCanvas);
      _self.canvas.observe('object:modified', this.saveScribbles);
      _self.canvas.observe('object:added', this.saveScribbles);
      _self.canvas.observe('object:removed', this.saveScribbles);
      _self.canvas.observe('text:changed', this.saveScribbles);

      _self.initializeScribbles();
      _self.scaleCanvas();

      _self.props.actions.setCanvasLoaded(true);
    };
  }

  // Adjusting canvas height after canvas initialization
  // helps to scale/move scribbles accordingly
  scaleCanvas() {
    this.canvas.setWidth(this.width);
    this.canvas.setHeight(this.height);
    this.canvas.renderAll();
  }

  // Scribble Helpers

  updateScribbles() {
    const { layers } = this;

    if (layers) {
      layers.forEach((layer) => {
        layer.showLayer(layer.isDisplayed);
      });
    }
  }

  saveScribbles = () => {
    if (this.isScribblesLoaded) {
      const answerId = this.props.scribingAnswer.answer.answer_id;
      const json = this.getScribbleJSON();
      this.props.actions.updateScribingAnswerInLocal(json);
      this.props.actions.updateScribingAnswer(answerId, json);
    }
  }

  getScribbleJSON() {
    // Remove non-user scribings in canvas
    this.layers.forEach((layer) => {
      if (layer.creator_id !== this.props.scribingAnswer.answer.user_id) {
        layer.showLayer(false);
      }
    });

    // Only save rescaled user scribings
    const objects = this.canvas._objects;
    objects.forEach((obj) => {
      this.normaliseScribble(obj);
    });
    const json = JSON.stringify(objects);

    // Scale back user scribings
    objects.forEach((obj) => {
      this.denormaliseScribble(obj);
    });

    // Add back non-user scribings according canvas state
    this.layers.forEach(layer => (layer.showLayer(layer.isDisplayed)));
    return `{"objects": ${json}}`;
  }

  // Utility Helpers

  getRgbaHelper = json => (
    `rgba(${json.r},${json.g},${json.b},${json.a})`
  );

  getMousePoint = event => (
    {
      x: event.clientX,
      y: event.clientY,
    }
  );

  // Generates the left, top, width and height of the drag
  generateMouseDragProperties = (point1, point2) => (
    {
      left: point1.x < point2.x ? point1.x : point2.x,
      top: point1.y < point2.y ? point1.y : point2.y,
      width: Math.abs(point1.x - point2.x),
      height: Math.abs(point1.y - point2.y),
    }
  );

  getCanvasPoint(event) {
    const pointer = this.canvas.getPointer(event.e);
    return {
      x: pointer.x,
      y: pointer.y,
    };
  }


  renderToolBar() {
    const { intl } = this.props;
    const lineToolStyle = {
      ...styles.custom_line,
      background: this.state.selectedTool === tools.LINE ? 'black' : 'rgba(0, 0, 0, 0.4)',
    };

    return (
      <Toolbar style={{ ...styles.toolbar, width: this.CANVAS_MAX_WIDTH }}>
        <ToolbarGroup>
          <ToolDropdown
            toolType={tools.TYPE}
            tooltip={intl.formatMessage(translations.text)}
            showTooltip={this.state.hoveredToolTip === tools.TYPE}
            currentTool={this.state.selectedTool}
            onClickIcon={this.onClickTypingIcon}
            colorBar={this.state.colors[toolColor.TYPE]}
            onTouchTapChevron={this.onClickTypingChevron}
            iconClassname="fa fa-font"
            onMouseEnter={() => this.onMouseEnter(tools.TYPE)}
            onMouseLeave={this.onMouseLeave}
            popoverComponent={() => (
              <TypePopover
                open={this.state.popovers.TYPE}
                anchorEl={this.state.popoverAnchor}
                onRequestClose={() => (this.onRequestClosePopover(popoverTypes.TYPE))}
                fontFamilyValue={this.state.fontFamily}
                onChangeFontFamily={this.onChangeFontFamily}
                fontSizeValue={this.state.fontSize}
                onChangeFontSize={this.onChangeFontSize}
                onClickColorPicker={event => (this.onClickColorPicker(event, toolColor.TYPE))}
                colorPickerPopoverOpen={this.state.colorDropdowns[toolColor.TYPE]}
                colorPickerPopoverAnchorEl={this.state.popoverColorPickerAnchor}
                onRequestCloseColorPickerPopover={() => (this.onRequestCloseColorPicker(toolColor.TYPE))}
                colorPickerColor={this.state.colors[toolColor.TYPE]}
                onChangeCompleteColorPicker={color => (this.onChangeCompleteColor(color, toolColor.TYPE))}
              />)}
          />
          <ToolDropdown
            toolType={tools.DRAW}
            tooltip={intl.formatMessage(translations.pencil)}
            showTooltip={this.state.hoveredToolTip === tools.DRAW}
            currentTool={this.state.selectedTool}
            onClick={this.onClickDrawingMode}
            colorBar={this.state.colors[toolColor.DRAW]}
            onTouchTapChevron={event => (this.onTouchTapPopover(event, popoverTypes.DRAW))}
            iconClassname="fa fa-pencil"
            onMouseEnter={() => this.onMouseEnter(tools.DRAW)}
            onMouseLeave={this.onMouseLeave}
            popoverComponent={() => (
              <DrawPopover
                open={this.state.popovers.DRAW}
                anchorEl={this.state.popoverAnchor}
                onRequestClose={() => (this.onRequestClosePopover(popoverTypes.DRAW))}
                toolThicknessValue={this.state.thickness[toolThickness.DRAW]}
                onChangeSliderThickness={(event, newValue) =>
                  (this.onChangeSliderThickness(event, toolThickness.DRAW, newValue))
                }
                colorPickerColor={this.state.colors[toolColor.DRAW]}
                onClickColorPicker={event => (this.onClickColorPicker(event, toolColor.DRAW))}
                colorPickerPopoverOpen={this.state.colorDropdowns[toolColor.DRAW]}
                colorPickerPopoverAnchorEl={this.state.popoverColorPickerAnchor}
                onRequestCloseColorPickerPopover={() => (this.onRequestCloseColorPicker(toolColor.DRAW))}
                onChangeCompleteColorPicker={color => (this.onChangeCompleteColor(color, toolColor.DRAW))}
              />
            )}
          />
          <ToolDropdown
            toolType={tools.LINE}
            tooltip={intl.formatMessage(translations.line)}
            showTooltip={this.state.hoveredToolTip === tools.LINE}
            currentTool={this.state.selectedTool}
            onClick={this.onClickLineMode}
            colorBar={this.state.colors[toolColor.LINE]}
            onTouchTapChevron={event => (this.onTouchTapPopover(event, popoverTypes.LINE))}
            iconComponent={() => (<div style={lineToolStyle} />)}
            onMouseEnter={() => this.onMouseEnter(tools.LINE)}
            onMouseLeave={this.onMouseLeave}
            popoverComponent={() => (
              <LinePopover
                lineToolType={toolThickness.LINE}
                open={this.state.popovers.LINE}
                anchorEl={this.state.popoverAnchor}
                onRequestClose={() => (this.onRequestClosePopover(popoverTypes.LINE))}
                selectedLineStyle={this.state.lineStyles[toolLineStyle.LINE]}
                onTouchTapLineStyleChip={this.onTouchTapLineStyleChip}
                toolThicknessValue={this.state.thickness[toolThickness.LINE]}
                onChangeSliderThickness={(event, newValue) =>
                  (this.onChangeSliderThickness(event, toolThickness.LINE, newValue))
                }
                colorPickerColor={this.state.colors[toolColor.LINE]}
                onClickColorPicker={event => (this.onClickColorPicker(event, toolColor.LINE))}
                colorPickerPopoverOpen={this.state.colorDropdowns[toolColor.LINE]}
                colorPickerPopoverAnchorEl={this.state.popoverColorPickerAnchor}
                onRequestCloseColorPickerPopover={() => (this.onRequestCloseColorPicker(toolColor.LINE))}
                onChangeCompleteColorPicker={color => (this.onChangeCompleteColor(color, toolColor.LINE))}
              />
            )}
          />
          <ToolDropdown
            toolType={tools.SHAPE}
            tooltip={intl.formatMessage(translations.shape)}
            showTooltip={this.state.hoveredToolTip === tools.SHAPE}
            currentTool={this.state.selectedTool}
            onClick={this.onClickShapeMode}
            onMouseEnter={() => this.onMouseEnter(tools.SHAPE)}
            onMouseLeave={this.onMouseLeave}
            colorBarComponent={() => (
              <div
                style={{
                  width: '23px',
                  height: '8px',
                  border: `${this.state.colors[toolColor.SHAPE_BORDER]} 2px solid`,
                  background: this.state.colors[toolColor.SHAPE_FILL],
                }}
              />
            )}
            onTouchTapChevron={event => (this.onTouchTapPopover(event, popoverTypes.SHAPE))}
            iconClassname={this.state.selectedShape === shapes.RECT ? 'fa fa-square-o' : 'fa fa-circle-o'}
            popoverComponent={() => (
              <ShapePopover
                lineToolType={toolThickness.SHAPE_BORDER}
                open={this.state.popovers.SHAPE}
                anchorEl={this.state.popoverAnchor}
                onRequestClose={() => (this.onRequestClosePopover(popoverTypes.SHAPE))}
                setSelectedShape={shape => (this.setSelectedShape(shape))}
                selectedLineStyle={this.state.lineStyles[toolLineStyle.SHAPE_BORDER]}
                onTouchTapLineStyleChip={this.onTouchTapLineStyleChip}
                toolThicknessValue={this.state.thickness[toolThickness.SHAPE_BORDER]}
                onChangeSliderThickness={(event, newValue) =>
                  (this.onChangeSliderThickness(event, toolThickness.SHAPE_BORDER, newValue))
                }
                borderColorPickerColor={this.state.colors[toolColor.SHAPE_BORDER]}
                onClickBorderColorPicker={event => (this.onClickColorPicker(event, toolColor.SHAPE_BORDER))}
                borderColorPickerPopoverOpen={this.state.colorDropdowns[toolColor.SHAPE_BORDER]}
                borderColorPickerPopoverAnchorEl={this.state.popoverColorPickerAnchor}
                onRequestCloseBorderColorPickerPopover={() => (this.onRequestCloseColorPicker(toolColor.SHAPE_BORDER))}
                onChangeCompleteBorderColorPicker={color => (this.onChangeCompleteColor(color, toolColor.SHAPE_BORDER))}
                fillColorPickerColor={this.state.colors[toolColor.SHAPE_FILL]}
                onClickFillColorPicker={event => (this.onClickColorPicker(event, toolColor.SHAPE_FILL))}
                fillColorPickerPopoverOpen={this.state.colorDropdowns[toolColor.SHAPE_FILL]}
                fillColorPickerPopoverAnchorEl={this.state.popoverColorPickerAnchor}
                onRequestCloseFillColorPickerPopover={() => (this.onRequestCloseColorPicker(toolColor.SHAPE_FILL))}
                onChangeCompleteFillColorPicker={color => (this.onChangeCompleteColor(color, toolColor.SHAPE_FILL))}
              />
            )}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <FontIcon
            className="fa fa-hand-pointer-o"
            style={this.state.selectedTool === tools.SELECT ?
              { ...styles.tool, color: 'black' } : styles.tool}
            onClick={this.onClickSelectionMode}
            onMouseEnter={() => this.onMouseEnter(tools.SELECT)}
            onMouseLeave={this.onMouseLeave}
          >
            <MaterialTooltip
              horizontalPosition={'center'}
              label={intl.formatMessage(translations.select)}
              show={this.state.hoveredToolTip === tools.SELECT}
              verticalPosition={'top'}
            />
          </FontIcon>
          <LayersComponent
            onTouchTap={event => (this.onTouchTapPopover(event, popoverTypes.LAYER))}
            disabled={this.layers && this.layers.length === 0}
            open={this.state.popovers[popoverTypes.LAYER]}
            anchorEl={this.state.popoverAnchor}
            onRequestClose={() => (this.onRequestClosePopover(popoverTypes.LAYER))}
            layers={this.layers}
            onTouchTapLayer={(layer) => {
              this.layers.forEach((l) => {
                if (l.creator_id === layer.creator_id) {
                  // eslint-disable-next-line no-param-reassign
                  l.isDisplayed = !l.isDisplayed;
                }
              });
              this.updateScribbles();
              this.forceUpdate();
            }}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <FontIcon
            className="fa fa-arrows"
            style={this.state.selectedTool === tools.PAN ?
              { color: 'black' } : {}}
            onClick={this.onClickPanMode}
            onMouseEnter={() => this.onMouseEnter(tools.PAN)}
            onMouseLeave={this.onMouseLeave}
          >
            <MaterialTooltip
              horizontalPosition={'center'}
              label={intl.formatMessage(translations.pan)}
              show={this.state.hoveredToolTip === tools.PAN}
              verticalPosition={'top'}
            />
          </FontIcon>
          <FontIcon
            className="fa fa-search-plus"
            onClick={this.onClickZoomIn}
            onMouseEnter={() => this.onMouseEnter(tools.ZOOM_IN)}
            onMouseLeave={this.onMouseLeave}
          >
            <MaterialTooltip
              horizontalPosition={'center'}
              label={intl.formatMessage(translations.zoomIn)}
              show={this.state.hoveredToolTip === tools.ZOOM_IN}
              verticalPosition={'top'}
            />
          </FontIcon>
          <FontIcon
            className="fa fa-search-minus"
            onClick={this.onClickZoomOut}
            onMouseEnter={() => this.onMouseEnter(tools.ZOOM_OUT)}
            onMouseLeave={this.onMouseLeave}
          >
            <MaterialTooltip
              horizontalPosition={'center'}
              label={intl.formatMessage(translations.zoomOut)}
              show={this.state.hoveredToolTip === tools.ZOOM_OUT}
              verticalPosition={'top'}
            />
          </FontIcon>
        </ToolbarGroup>
        <ToolbarGroup>
          <FontIcon
            className="fa fa-trash-o"
            onClick={this.onClickDelete}
            onMouseEnter={() => this.onMouseEnter(tools.DELETE)}
            onMouseLeave={this.onMouseLeave}
          >
            <MaterialTooltip
              horizontalPosition={'center'}
              label={intl.formatMessage(translations.delete)}
              show={this.state.hoveredToolTip === tools.DELETE}
              verticalPosition={'top'}
            />
          </FontIcon>
        </ToolbarGroup>
        <ToolbarGroup>
          <SavingIndicator
            isSaving={this.props.scribingAnswer.isSaving}
            isSaved={this.props.scribingAnswer.isSaved}
            hasError={this.props.scribingAnswer.hasError}
            clearSavingStatus={this.props.actions.clearSavingStatus}
          />
        </ToolbarGroup>
      </Toolbar>
    );
  }

  render() {
    const answerId = this.props.scribingAnswer.answer.answer_id;
    const isCanvasLoaded = this.props.scribingAnswer.isCanvasLoaded;
    return (answerId ?
      <div style={styles.canvas_div}>
        { this.renderToolBar() }
        { !isCanvasLoaded ? <LoadingIndicator /> : null }
        <canvas style={styles.canvas} id={`canvas-${answerId}`} />
      </div> : null
    );
  }
}

ScribingAnswerForm.propTypes = propTypes;
export default injectIntl(ScribingAnswerForm);
