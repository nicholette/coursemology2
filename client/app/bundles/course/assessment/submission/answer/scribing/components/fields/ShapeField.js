import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Slider from 'material-ui/Slider';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import translations from '../../translations';
import { shapes } from '../../constants';

const propTypes = {
  intl: intlShape.isRequired,
  setSelectedShape: PropTypes.func,
}

class ShapeField extends Component {
  render() {
    const { setSelectedShape, intl } = this.props;

    return (
      <div>
        <IconButton tooltip={intl.formatMessage(translations.rectangle)} tooltipPosition="top-center">
          <FontIcon className="fa fa-square-o" onClick={() => (setSelectedShape(shapes.RECT))}/>
        </IconButton>
        <IconButton tooltip={intl.formatMessage(translations.ellipse)} tooltipPosition="top-center">
          <FontIcon className="fa fa-circle-o" onClick={() => (setSelectedShape(shapes.ELLIPSE))}/>
        </IconButton>
      </div>
    );
  }
} 

ShapeField.propTypes = propTypes;
export default injectIntl(ShapeField);