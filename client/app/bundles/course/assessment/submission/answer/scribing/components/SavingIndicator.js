import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import translations from '../translations';

const propTypes = {
  intl: intlShape.isRequired,
  clearSavingStatus: PropTypes.func.isRequired,
  is_saving: PropTypes.bool,
  is_saved: PropTypes.bool,
  save_errors: PropTypes.array,
}

const style = {
  savingStatus: {
    width: `50px`,
  },
  saving_status_label: {
    color: '#bdc3c7',
    fontSize: `14px`,
    fontWeight: `500`,
    letterSpacing: `0px`,
    textTransform: `uppercase`,
    fontFamily: `Roboto, sans-serif`,
  },
}

class SavingIndicator extends Component {
  render() {
    const { intl, clearSavingStatus, is_saving, is_saved, save_errors } = this.props;

    var status = '';

    if (is_saving) {
      status = intl.formatMessage(translations.saving);
    } else if (is_saved) {
      status = intl.formatMessage(translations.saved);
      // TODO: make fading animation
      setTimeout(clearSavingStatus, 3000);
    } else if (save_errors) {
      // TODO: add warning color
      status = 'Save errors.'
    }

    return (
      <div style={style.savingStatus}>
        <label style={style.saving_status_label}>{status}</label>
      </div>
    );
  }
} 

SavingIndicator.propTypes = propTypes;
export default injectIntl(SavingIndicator);