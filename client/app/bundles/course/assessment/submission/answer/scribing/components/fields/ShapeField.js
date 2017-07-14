import React, { Component, PropTypes } from 'react';
import Slider from 'material-ui/Slider';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import { shapes } from '../../constants';

const propTypes = {
  setSelectedShape: PropTypes.func,
}

export default class ShapeField extends Component {
  render() {
    const { setSelectedShape } = this.props;

    return (
      <div>
        <IconButton tooltip="Square" tooltipPosition="top-center">
          <FontIcon className="fa fa-square-o" onClick={() => (setSelectedShape(shapes.RECT))}/>
        </IconButton>
        <IconButton tooltip="Ellipse" tooltipPosition="top-center">
          <FontIcon className="fa fa-circle-o" onClick={() => (setSelectedShape(shapes.ELLIPSE))}/>
        </IconButton>
      </div>
    );
  }
} 

ShapeField.propTypes = propTypes;