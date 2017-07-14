import React, { Component, PropTypes } from 'react';
import { SketchPicker } from 'react-color';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';

import LineThicknessField from '../fields/LineThicknessField';
import ColorPickerField from '../fields/ColorPickerField';

const propTypes = {
  open: PropTypes.bool,
  anchorEl: PropTypes.object,
  onRequestClose: PropTypes.func,
  toolThicknessValue: PropTypes.number,
  onChangeSliderThickness: PropTypes.func,
  colorPickerColor: PropTypes.string,
  onClickColorPicker: PropTypes.func,
  colorPickerPopoverOpen: PropTypes.bool,
  colorPickerPopoverAnchorEl: PropTypes.object,
  onRequestCloseColorPickerPopover: PropTypes.func,
  onChangeCompleteColorPicker: PropTypes.func,
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

export default class DrawPopover extends Component {
  render() {
    const { open, anchorEl, onRequestClose,
            toolThicknessValue, onChangeSliderThickness,
            colorPickerColor, onClickColorPicker, colorPickerPopoverOpen,
            colorPickerPopoverAnchorEl, onRequestCloseColorPickerPopover,
            onChangeCompleteColorPicker } = this.props;

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
          <div>
            <h4>Pencil</h4>
          </div>
          <LineThicknessField
            toolThicknessValue={toolThicknessValue}
            onChangeSliderThickness={onChangeSliderThickness}
          />
          <ColorPickerField 
            onClickColorPicker={onClickColorPicker}
            colorPickerPopoverOpen={colorPickerPopoverOpen}
            colorPickerPopoverAnchorEl={colorPickerPopoverAnchorEl}
            onRequestCloseColorPickerPopover={onRequestCloseColorPickerPopover}
            colorPickerColor={colorPickerColor}
            onChangeCompleteColorPicker={onChangeCompleteColorPicker}
          />
        </Menu>
      </Popover>
    );
  }
} 

DrawPopover.propTypes = propTypes;