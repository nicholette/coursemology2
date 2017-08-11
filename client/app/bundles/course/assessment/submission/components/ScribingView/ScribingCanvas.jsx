/* eslint no-mixed-operators: "off" */
/* eslint react/sort-comp: "off" */
import React, { PropTypes } from 'react';
import { Canvas } from 'react-fabricjs'; // eslint-disable-line no-unused-vars
import { injectIntl, intlShape } from 'react-intl';

import FontIcon from 'material-ui/FontIcon';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MaterialTooltip from 'material-ui/internal/Tooltip';
import LoadingIndicator from 'lib/components/LoadingIndicator';

import SavingIndicator from './SavingIndicator';
import ToolDropdown from './ToolDropdown';
import LayersComponent from './LayersComponent';
import TypePopover from './popovers/TypePopover';
import DrawPopover from './popovers/DrawPopover';
import LinePopover from './popovers/LinePopover';
import ShapePopover from './popovers/ShapePopover';

// import { setCanvasLoaded, fetchScribingAnswer, clearSavingStatus,
//          updateScribingAnswer, updateScribingAnswerInLocal } = '../actions/scribing';
import { scribingShape } from '../../propTypes';
import { scribingTranslations as translations } from '../../translations';
import { scribingTools, scribingShapes, scribingToolColor,
         scribingToolThickness, scribingToolLineStyle, scribingPopoverTypes } from '../../constants';

/* NOTE: Denormalizing and normalizing scribble code is brought over
  * from Coursemology v1. They are not needed for the scribing
  * question to work but it is required to support scribing questions
  * that were migrated over.
*/

const propTypes = {
  intl: intlShape.isRequired,
  // scribing: PropTypes.shape({
  //   answer: scribingShape,
  //   isLoading: PropTypes.bool,
  //   isCanvasLoaded: PropTypes.bool,
  //   isSaving: PropTypes.bool,
  //   isSaved: PropTypes.bool,
  //   hasError: PropTypes.bool,
  // }),
  // readOnly: PropTypes.bool.isRequired,
  // answerId: PropTypes.number,
  // data: scribingShape.isRequired,
  setCanvasLoaded: PropTypes.func.isRequired,
  // fetchScribingAnswer: PropTypes.func.isRequired,
  clearSavingStatus: PropTypes.func.isRequired,
  updateScribingAnswer: PropTypes.func.isRequired,
  updateScribingAnswerInLocal: PropTypes.func.isRequired,

  setToolSelected: PropTypes.func.isRequired,
  setFontFamily: PropTypes.func.isRequired,
  setFontSize: PropTypes.func.isRequired,
  setLineStyleChip: PropTypes.func.isRequired,
  setColoringToolColor: PropTypes.func.isRequired,
  setToolThickness: PropTypes.func.isRequired,
  setSelectedShape: PropTypes.func.isRequired,
  openHoverToolTip: PropTypes.func.isRequired,
  closeHoverToolTip: PropTypes.func.isRequired,
  openColorPicker: PropTypes.func.isRequired,
  closeColorPicker: PropTypes.func.isRequired,
  openPopover: PropTypes.func.isRequired,
  closePopover: PropTypes.func.isRequired,
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

class ScribingCanvas extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   selectedTool: scribingTools.SELECT,
    //   selectedShape: scribingShapes.RECT,
    //   hoveredToolTip: '',
    //   imageWidth: 0,
    //   imageHeight: 0,
    //   fontFamily: 'Arial',
    //   fontSize: 12,
    //   colors: [],
    //   colorDropdowns: [],
    //   lineStyles: [],
    //   thickness: [],
    //   popovers: [],
    //   popoverAnchor: undefined,
    //   popoverColorPickerAnchor: undefined,
    // };

    this.viewportLeft = 0;
    this.viewportTop = 0;
  }

  componentDidMount() {
    this.initializeCanvas(
        this.props.answerId,
        this.props.scribing.answer.image_path);
  }

  shouldComponentUpdate(nextProps) {
    // if (this.props.scribing.isCanvasLoaded) {
    //   // this.updateScribbles();
    // }
    return !this.props.scribing.isCanvasLoaded;
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

    if (this.props.scribing.selectedTool === scribingTools.PAN && this.mouseDownFlag) {
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
      switch (this.props.scribing.lineStyles[toolType]) {
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
      if (this.props.scribing.selectedTool === scribingTools.LINE) {
        const strokeDashArray = getStrokeDashArray(scribingToolLineStyle.LINE);
        const line = new fabric.Line( // eslint-disable-line no-undef
          [
            this.mouseCanvasDragStartPoint.x, this.mouseCanvasDragStartPoint.y,
            this.mouseCanvasDragEndPoint.x, this.mouseCanvasDragEndPoint.y,
          ],
          {
            stroke: `${this.props.scribing.colors[scribingToolColor.LINE]}`,
            strokeWidth: this.props.scribing.thickness[scribingToolThickness.LINE],
            strokeDashArray,
            selectable: false,
          }
        );
        this.canvas.add(line);
        this.canvas.renderAll();
      } else if (this.props.scribing.selectedTool === scribingTools.SHAPE) {
        const strokeDashArray = getStrokeDashArray(scribingToolLineStyle.SHAPE_BORDER);
        switch (this.props.scribing.selectedShape) {
          case scribingShapes.RECT: {
                      console.log('selected SHAPE');
            const dragProps = this.generateMouseDragProperties(
              this.mouseCanvasDragStartPoint,
              this.mouseCanvasDragEndPoint
            );
            const rect = new fabric.Rect({ // eslint-disable-line no-undef
              left: dragProps.left,
              top: dragProps.top,
              stroke: `${this.props.scribing.colors[scribingToolColor.SHAPE_BORDER]}`,
              strokeWidth: this.props.scribing.thickness[scribingToolThickness.SHAPE_BORDER],
              strokeDashArray,
              fill: `${this.props.scribing.colors[scribingToolColor.SHAPE_FILL]}`,
              width: dragProps.width,
              height: dragProps.height,
              selectable: false,
            });
            this.canvas.add(rect);
            this.canvas.renderAll();
            break;
          }
          case scribingShapes.ELLIPSE: {
            const dragProps = this.generateMouseDragProperties(
              this.mouseCanvasDragStartPoint,
              this.mouseCanvasDragEndPoint
            );
            const ellipse = new fabric.Ellipse({ // eslint-disable-line no-undef
              left: dragProps.left,
              top: dragProps.top,
              stroke: `${this.props.scribing.colors[scribingToolColor.SHAPE_BORDER]}`,
              strokeWidth: this.props.scribing.thickness[scribingToolThickness.SHAPE_BORDER],
              strokeDashArray,
              fill: `${this.props.scribing.colors[scribingToolColor.SHAPE_FILL]}`,
              rx: dragProps.width / 2,
              ry: dragProps.height / 2,
              selectable: false,
            });
            this.canvas.add(ellipse);
            this.canvas.renderAll();
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
  // enableTextSelection() {
  //   this.canvas.clear();
  //   this.initializeScribbles(false);
  //   this.canvas.forEachObject(object => (
  //     // eslint-disable-next-line no-param-reassign
  //     object.selectable = (object.type === 'i-text')
  //   ));
  // }

  // This method clears the selection-disabled scribbles
  // and reloads them to enable selection again
  enableObjectSelection() {
    this.canvas.clear();
    this.initializeScribbles(false);
  }

  setSelectedShape = (shape) => {
    this.setState({
      selectedShape: shape,
    });
  }

  addText = () => {
    // eslint-disable-next-line no-undef
    this.canvas.add(new fabric.IText('Text', { // eslint-disable-line no-undef
      fontFamily: this.props.scribing.fontFamily,
      fontSize: this.props.scribing.fontSize,
      fill: this.props.scribing.colors[scribingToolColor.TYPE],
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
    }));
    this.canvas.renderAll();
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

  initializeScribbles = (isFirstInit) => {
    const { scribbles } = this.props.scribing.answer;
    const userId = this.props.scribing.answer.user_id;

    this.isScribblesLoaded = false;
    let userScribble = [];

    if (isFirstInit) {
      this.canvas.layers = [];
    } else {
      this.canvas.layers.forEach((layer) => this.canvas.add(layer.scribbleGroup));
    }

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
        if (isFirstInit && scribble.creator_id !== userId) {
          // eslint-disable-next-line no-undef
          const scribbleGroup = new fabric.Group(fabricObjs);
          scribbleGroup.selectable = false;

          const showLayer = (isShown) => {
            // eslint-disable-next-line no-param-reassign
            scribbleGroup._objects.forEach(obj => (obj.visible = isShown));
          };
          // Populate layers list
          const newScribble = {
            ...scribble,
            isDisplayed: true,
            showLayer,
            scribbleGroup,
          };
          this.canvas.layers = [...this.canvas.layers, newScribble];
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
    this.canvas.renderAll();
    this.isScribblesLoaded = true;
  }

  initializeCanvas(answerId, imagePath) {
    const imageUrl = `https://coursemology.org/${imagePath}`;
    // const imageUrl = `${window.location.origin}/${imagePath}`;
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
      this.canvas = new fabric.Canvas(`canvas-${answerId}`, {
        width: this.width,
        height: this.height,
        preserveObjectStacking: true,
        renderOnAddRemove: false,
        objectCaching: false,
        statefullCache: false,
        noScaleCache: true,
        needsItsOwnCache: false,
      });

      const fabricImage = new fabric.Image( // eslint-disable-line no-undef
        this.image,
        { opacity: 1, scaleX: this.scale, scaleY: this.scale }
      );
      this.canvas.setBackgroundImage(fabricImage, this.canvas.renderAll.bind(this.canvas));

      this.canvas.initializeScribbles = this.initializeScribbles;
      this.canvas.initializeScribbles(true);

      this.canvas.on('mouse:down', this.onMouseDownCanvas);
      this.canvas.on('mouse:move', this.onMouseMoveCanvas);
      this.canvas.on('mouse:up', this.onMouseUpCanvas);
      this.canvas.on('object:moving', this.onObjectMovingCanvas);
      this.canvas.on('object:modified', this.saveScribbles);
      this.canvas.on('object:added', this.saveScribbles);
      this.canvas.on('path:created', this.saveScribbles);
      this.canvas.on('object:removed', this.saveScribbles);
      this.canvas.on('text:changed', this.saveScribbles);

      this.scaleCanvas();
      this.props.setCanvasLoaded(this.props.answerId, true, this.canvas);
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

  saveScribbles = () => {
    return new Promise((resolve) => {
      if (this.isScribblesLoaded) {
        const answerId = this.props.answerId;
        const json = this.getScribbleJSON();
        this.props.updateScribingAnswerInLocal(answerId, json);
        this.props.updateScribingAnswer(answerId, json);
      }
      resolve();
    });
  }

  getScribbleJSON() {
    // Remove non-user scribings in canvas
    this.canvas.layers.forEach((layer) => {
      if (layer.creator_id !== this.props.scribing.answer.user_id) {
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
    this.canvas.layers.forEach(layer => (layer.showLayer(layer.isDisplayed)));
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

  render() {
    const answerId = this.props.answerId;
    const isCanvasLoaded = this.props.scribing.isCanvasLoaded;
    return (answerId ?
      <div style={styles.canvas_div}>
        { !isCanvasLoaded ? <LoadingIndicator /> : null }
        <canvas style={styles.canvas} id={`canvas-${answerId}`} />
      </div> : null
    );
  }
}

ScribingCanvas.propTypes = propTypes;
export default injectIntl(ScribingCanvas);
