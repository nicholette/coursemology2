import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const propTypes = {
  fontSizeValue: PropTypes.number,
  onChangeFontSize: PropTypes.func,
}

const styles = {
  select: {
    width: `210px`,
  },
}

export default class FontSizeField extends Component {
  render() {
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
} 

FontSizeField.propTypes = propTypes;