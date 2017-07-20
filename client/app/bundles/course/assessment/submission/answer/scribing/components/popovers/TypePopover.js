import React, { Component, PropTypes } from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';

import FontFamilyField from '../fields/FontFamilyField';
import FontSizeField from '../fields/FontSizeField';
import ColorPickerField from '../fields/ColorPickerField';

const propTypes = {
  open: PropTypes.bool,
  anchorEl: PropTypes.object,
  onRequestClose: PropTypes.func,
  fontFamilyValue: PropTypes.string,
  onChangeFontFamily: PropTypes.func,
  fontSizeValue: PropTypes.number,
  onChangeFontSize: PropTypes.func,
  onClickColorPicker: PropTypes.func,
  colorPickerPopoverOpen: PropTypes.bool,
  colorPickerPopoverAnchorEl: PropTypes.object,
  onRequestCloseColorPickerPopover: PropTypes.func,
  colorPickerColor: PropTypes.string,
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

export default class TypePopover extends Component {
  render() {
    const { open, anchorEl, onRequestClose, fontFamilyValue, onChangeFontFamily, fontSizeValue,
            onChangeFontSize, onClickColorPicker, colorPickerPopoverOpen, colorPickerPopoverAnchorEl,
            onRequestCloseColorPickerPopover, colorPickerColor, onChangeCompleteColorPicker
          } = this.props;

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
            <h4>Font</h4>
          </div>
          <FontFamilyField
            fontFamilyValue={fontFamilyValue}
            onChangeFontFamily={onChangeFontFamily}
          />
          <FontSizeField
            fontSizeValue={fontSizeValue}
            onChangeFontSize={onChangeFontSize}
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

TypePopover.propTypes = propTypes;