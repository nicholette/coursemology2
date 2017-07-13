import React, { Component, PropTypes } from 'react';
import { SketchPicker } from 'react-color';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import FontIcon from 'material-ui/FontIcon';

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
  select: {
    width: `210px`,
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
  renderFontFamilySelect() {
    const { fontFamilyValue, onChangeFontFamily } = this.props;
    const fontFamilies = [
      'Arial',
      'Arial Black',
      'Comic Sans MS',
      'Georgia',
      'Impact',
      'Lucida Sans Unicode',
      'Palatino Linotype',
      'Tahoma',
      'Times New Roman',
    ];
    const menuItems = [];

    fontFamilies.forEach((font) => {
      menuItems.push(<MenuItem key={font} value={font} primaryText={font} />);
    })

    return (
      <div>
        <SelectField
          floatingLabelText="Font Family:"
          value={fontFamilyValue}
          onChange={onChangeFontFamily}
          maxHeight={150}
          style={styles.select}
        >
          {menuItems}
        </SelectField>
      </div>
    );
  }

  renderFontSizeSelect() {
    const { fontSizeValue, onChangeFontSize } = this.props;
    const menuItems = [];

    for (var i=1; i<=60; i++) {
      menuItems.push(<MenuItem key={i} value={i} primaryText={i} />);
    }

    return (
      <div>
        <SelectField
          floatingLabelText="Font Size:"
          value={fontSizeValue}
          onChange={onChangeFontSize}
          maxHeight={150}
          style={styles.select}
        >
          {menuItems}
        </SelectField>
      </div>
    )
  }

  renderColorPickerField() {
    const { colorPickerColor, onClickColorPicker, colorPickerPopoverOpen,
            colorPickerPopoverAnchorEl, onRequestCloseColorPickerPopover,
            onChangeCompleteColorPicker } = this.props;

    return (
      <div style={styles.colorPickerFieldDiv}>
        <label style={styles.label}>Colour:</label>
        <div 
          style={{background: colorPickerColor, ...styles.colorPicker }}
          onClick={onClickColorPicker} />
          <Popover
            style={styles.toolDropdowns}
            open={colorPickerPopoverOpen}
            anchorEl={colorPickerPopoverAnchorEl}
            anchorOrigin={popoverStyles.anchorOrigin}
            targetOrigin={popoverStyles.targetOrigin}
            onRequestClose={onRequestCloseColorPickerPopover}
            animation={PopoverAnimationVertical}
          >
            <SketchPicker
              color={colorPickerColor}
              onChangeComplete={onChangeCompleteColorPicker}
            />
          </Popover>
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
          <div>
            <h4>Font</h4>
          </div>
          {this.renderFontFamilySelect()}
          {this.renderFontSizeSelect()}
          {this.renderColorPickerField()}
        </Menu>
      </Popover>
    );
  }
} 

TypePopover.propTypes = propTypes;