import React, { Component, PropTypes } from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';

import LineStyleField from '../fields/LineStyleField';
import LineThicknessField from '../fields/LineThicknessField';
import ColorPickerField from '../fields/ColorPickerField';
import ShapeField from '../fields/ShapeField';

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
  toolDropdowns: {
    padding: `10px`,
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
  renderShapeComponent() {
    const { setSelectedShape } = this.props;

    return (
      <div>
        <div>
          <h4>Shape</h4>
        </div>
        <ShapeField setSelectedShape={setSelectedShape} />
      </div>
    );
  }

  renderBorderComponent() {
    const {
      lineToolType, selectedLineStyle, onTouchTapLineStyleChip,
      toolThicknessValue, onChangeSliderThickness, onClickBorderColorPicker,
      borderColorPickerPopoverOpen, borderColorPickerPopoverAnchorEl,
      onRequestCloseBorderColorPickerPopover, borderColorPickerColor,
      onChangeCompleteBorderColorPicker
    } = this.props;

    return (
      <div>
        <div>
          <h4>Border</h4>
        </div>
          <LineStyleField
            lineToolType={lineToolType}
            selectedLineStyle={selectedLineStyle}
            onTouchTapLineStyleChip={onTouchTapLineStyleChip}
          />
          <LineThicknessField
            toolThicknessValue={toolThicknessValue}
            onChangeSliderThickness={onChangeSliderThickness}
          />
          <ColorPickerField 
            onClickColorPicker={onClickBorderColorPicker}
            colorPickerPopoverOpen={borderColorPickerPopoverOpen}
            colorPickerPopoverAnchorEl={borderColorPickerPopoverAnchorEl}
            onRequestCloseColorPickerPopover={onRequestCloseBorderColorPickerPopover}
            colorPickerColor={borderColorPickerColor}
            onChangeCompleteColorPicker={onChangeCompleteBorderColorPicker}
          />
      </div>
    );
  }

  renderFillComponent() {
    const { 
      onClickFillColorPicker, fillColorPickerPopoverOpen,
      fillColorPickerPopoverAnchorEl, onRequestCloseFillColorPickerPopover,
      fillColorPickerColor, onChangeCompleteFillColorPicker
    } = this.props;

    return (
      <div>
        <div>
          <h4>Fill</h4>
        </div>
        <ColorPickerField 
          onClickColorPicker={onClickFillColorPicker}
          colorPickerPopoverOpen={fillColorPickerPopoverOpen}
          colorPickerPopoverAnchorEl={fillColorPickerPopoverAnchorEl}
          onRequestCloseColorPickerPopover={onRequestCloseFillColorPickerPopover}
          colorPickerColor={fillColorPickerColor}
          onChangeCompleteColorPicker={onChangeCompleteFillColorPicker}
        />
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