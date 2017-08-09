import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import { scribingTranslations as translations } from '../../../translations';
import { scribingShapes } from '../../../constants';

const propTypes = {
  intl: intlShape.isRequired,
  setSelectedShape: PropTypes.func,
};

const ShapeField = (props) => {
  const { intl, setSelectedShape } = props;

  return (
    <div>
      <IconButton tooltip={intl.formatMessage(translations.rectangle)} tooltipPosition="top-center">
        <FontIcon className="fa fa-square-o" onClick={() => (setSelectedShape(scribingShapes.RECT))} />
      </IconButton>
      <IconButton tooltip={intl.formatMessage(translations.ellipse)} tooltipPosition="top-center">
        <FontIcon className="fa fa-circle-o" onClick={() => (setSelectedShape(scribingShapes.ELLIPSE))} />
      </IconButton>
    </div>
  );
};

ShapeField.propTypes = propTypes;
export default injectIntl(ShapeField);
