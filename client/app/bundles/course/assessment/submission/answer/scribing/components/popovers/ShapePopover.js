import React, { Component, PropTypes } from 'react';
import { SketchPicker } from 'react-color';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';
import Chip from 'material-ui/Chip';
import SelectField from 'material-ui/SelectField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {cyan500, grey50} from 'material-ui/styles/colors';

import { shapes } from '../../constants';

const propTypes = {
  lineToolType: PropTypes.string,
  open: PropTypes.bool,
  anchorEl: PropTypes.object,
  onRequestClose: PropTypes.func,
  setSelectedShape: PropTypes.func,
  selectedLineStyle: PropTypes.string,
  onTouchTapLineStyleChip: PropTypes.func,
  toolThicknessValue: PropTypes.number,
  onChangeSliderThickness: PropTypes.func,
  borderColorPickerColor: PropTypes.string,
  onClickBorderColorPicker: PropTypes.func,
  borderColorPickerPopoverOpen: PropTypes.bool,
  borderColorPickerPopoverAnchorEl: PropTypes.object,
  onRequestCloseBorderColorPickerPopover: PropTypes.func,
  onChangeCompleteBorderColorPicker: PropTypes.func,
  fillColorPickerColor: PropTypes.string,
  onClickFillColorPicker: PropTypes.func,
  fillColorPickerPopoverOpen: PropTypes.bool,
  fillColorPickerPopoverAnchorEl: PropTypes.object,
  onRequestCloseFillColorPickerPopover: PropTypes.func,
  onChangeCompleteFillColorPicker: PropTypes.func,
}

const styles = {
  select: {
    width: `210px`,
  },
  fieldDiv: {
    fontSize: `16px`,
    lineHeight: `24px`,
    width: `210px`,
    height: `72px`,
    display: `block`,
    position: `relative`,
    backgroundColor: `transparent`,
    fontFamily: `Roboto, sans-serif`,
    transition: `height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms`,
    cursor: `auto`,
  },
  colorPickerFieldDiv: {
    fontSize: `16px`,
    lineHeight: `24px`,
    width: `210px`,
    display: `block`,
    position: `relative`,
    backgroundColor: `transparent`,
    fontFamily: `Roboto, sans-serif`,
    transition: `height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms`,
    cursor: `auto`,
  },
  label: {
    position: `absolute`,
    lineHeight: `22px`,
    top: `38px`,
    transition: `all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms`,
    zIndex: `1`,
    transform: `scale(0.75) translate(0px, -28px)`,
    transformOrigin: `left top 0px`,
    pointerEvents: `none`,
    userSelect: `none`,
    color: `rgba(0, 0, 0, 0.3)`,
  },
  colorPicker: {
    height: `20px`,
    width: `20px`,
    display: `inline-block`,
    margin: `15px 0px 0px 50px`,
  },
  toolDropdowns: {
    padding: `10px`,
  },
  slider: {
    padding: `30px 0px`,
  },
  chip: {
    margin: `4px`,
  },
  chipWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    width: `220px`,
    padding: `40px 0px`,
  },
  menu: {
    maxHeight: `250px`,
    overflowY: `auto`,
  },
}

const popoverStyles = {
  anchorOrigin: {
    horizontal: 'left',
    vertical: 'bottom',
  },
  targetOrigin: {
    horizontal: 'left',
    vertical: 'top',
  }
}

export default class ShapePopover extends Component {

  renderLineStyleChips() {
    const { lineToolType, selectedLineStyle, onTouchTapLineStyleChip } = this.props;
    const lineStyles = ['solid', 'dotted', 'dashed'];
    const chips = [];
    lineStyles.forEach((style)=>(chips.push(
      <Chip
        backgroundColor={selectedLineStyle === style ? cyan500 : undefined}
        labelColor={selectedLineStyle === style ? grey50 : undefined}
        key={lineToolType + style}
        style={styles.chip}
        onTouchTap={(event) => onTouchTapLineStyleChip(event, lineToolType, style)}
      >
        {style}
      </Chip>
    )));
    return chips;
  }

  renderLineStyleField() {
    return (
      <div style={styles.fieldDiv}>
        <label style={styles.label}>Style:</label>
        <div style={styles.chipWrapper}>
          { this.renderLineStyleChips() }
        </div>
      </div>
    );
  }

  renderThicknessField() {
    const { toolThicknessValue, onChangeSliderThickness } = this.props;

    return (
      <div style={styles.fieldDiv}>
        <label style={styles.label}>Thickness:</label>
        <Slider 
          style={styles.slider} min={0} max={5} step={1} value={toolThicknessValue}
          onChange={onChangeSliderThickness}
         />
      </div>
    );
  }

  renderBorderColorPickerField() {
    const { borderColorPickerColor, onClickBorderColorPicker, borderColorPickerPopoverOpen,
            borderColorPickerPopoverAnchorEl, onRequestCloseBorderColorPickerPopover,
            onChangeCompleteBorderColorPicker } = this.props;

    return (
      <div style={styles.colorPickerFieldDiv}>
        <label style={styles.label}>Colour:</label>
        <div 
          style={{background: borderColorPickerColor, ...styles.colorPicker }}
          onClick={onClickBorderColorPicker} />
          <Popover
            style={styles.toolDropdowns}
            open={borderColorPickerPopoverOpen}
            anchorEl={borderColorPickerPopoverAnchorEl}
            anchorOrigin={popoverStyles.anchorOrigin}
            targetOrigin={popoverStyles.targetOrigin}
            onRequestClose={onRequestCloseBorderColorPickerPopover}
            animation={PopoverAnimationVertical}
          >
            <SketchPicker
              color={borderColorPickerColor}
              onChangeComplete={onChangeCompleteBorderColorPicker}
            />
          </Popover>
      </div>
    );
  }

  renderFillColorPickerField() {
    const { fillColorPickerColor, onClickFillColorPicker, fillColorPickerPopoverOpen,
            fillColorPickerPopoverAnchorEl, onRequestCloseFillColorPickerPopover,
            onChangeCompleteFillColorPicker } = this.props;

    return (
      <div style={styles.colorPickerFieldDiv}>
        <label style={styles.label}>Colour:</label>
        <div 
          style={{background: fillColorPickerColor, ...styles.colorPicker }}
          onClick={onClickFillColorPicker} />
          <Popover
            style={styles.toolDropdowns}
            open={fillColorPickerPopoverOpen}
            anchorEl={fillColorPickerPopoverAnchorEl}
            anchorOrigin={popoverStyles.anchorOrigin}
            targetOrigin={popoverStyles.targetOrigin}
            onRequestClose={onRequestCloseFillColorPickerPopover}
            animation={PopoverAnimationVertical}
          >
            <SketchPicker
              color={fillColorPickerColor}
              onChangeComplete={onChangeCompleteFillColorPicker}
            />
          </Popover>
      </div>
    );
  }

  renderShapeField() {
    const { setSelectedShape } = this.props;

    return (
      <div>
        <IconButton tooltip="Square" tooltipPosition="top-center">
          <FontIcon className="fa fa-square-o" onClick={() => (setSelectedShape(shapes.RECT))}/>
        </IconButton>
        <IconButton tooltip="Ellipse" tooltipPosition="top-center">
          <FontIcon className="fa fa-circle-o" onClick={() => (setSelectedShape(shapes.ELLIPSE))}/>
        </IconButton>
      </div>
    );
  }

  renderShapeComponent() {
    return (
      <div>
        <div>
          <h4>Shape</h4>
        </div>
        { this.renderShapeField() }
      </div>
    );
  }

  renderBorderComponent() {
    return (
      <div>
        <div>
          <h4>Border</h4>
        </div>
        { this.renderLineStyleField() }
        { this.renderThicknessField() }
        { this.renderBorderColorPickerField() }
      </div>
    );
  }

  renderFillComponent() {
    return (
      <div>
        <div>
          <h4>Fill</h4>
        </div>
        { this.renderFillColorPickerField() }
      </div>
    );
  }

  render() {
    const { open, anchorEl, onRequestClose } = this.props;

    return (
      <Popover
        style={styles.toolDropdowns}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={popoverStyles.anchorOrigin}
        targetOrigin={popoverStyles.targetOrigin}
        onRequestClose={onRequestClose}
        animation={PopoverAnimationVertical}
      >
        <Menu style={styles.menu}>
          { this.renderShapeComponent() }
          <Divider />
          { this.renderBorderComponent() }
          <Divider />
          { this.renderFillComponent() }
        </Menu>
      </Popover>
    );
  }
} 

ShapePopover.propTypes = propTypes;