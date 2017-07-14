import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const propTypes = {
  fontFamilyValue: PropTypes.string,
  onChangeFontFamily: PropTypes.func.isRequired,
}

const styles = {
  select: {
    width: `210px`,
  }
}

export default class FontFamilyField extends Component {
  render() {
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
} 
FontFamilyField.propTypes = propTypes;