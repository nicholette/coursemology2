import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import translations from '../../translations';

const propTypes = {
  intl: intlShape.isRequired,
  fontSizeValue: PropTypes.number,
  onChangeFontSize: PropTypes.func,
}

const styles = {
  select: {
    width: '210px',
  },
}

class FontSizeField extends Component {
  render() {
    const { intl, fontSizeValue, onChangeFontSize } = this.props;
    const menuItems = [];

    for (var i=1; i<=60; i++) {
      menuItems.push(<MenuItem key={i} value={i} primaryText={i} />);
    }

    return (
      <div>
        <SelectField
          floatingLabelText={intl.formatMessage(translations.fontSize)}
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
export default injectIntl(FontSizeField);