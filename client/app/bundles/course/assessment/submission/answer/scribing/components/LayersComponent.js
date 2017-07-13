import React, { Component, PropTypes } from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const propTypes = {
  onTouchTap: PropTypes.func,
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  anchorEl: PropTypes.object,
  onRequestClose: PropTypes.func,
  layers: PropTypes.array,
  onTouchTapLayer: PropTypes.func,
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

export default class LayersComponent extends Component {
  renderLayersPopover() {
    const { layers, open, anchorEl,
            onRequestClose, onTouchTapLayer } = this.props;

    return layers && layers.length !== 0 ? (
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={popoverStyles.anchorOrigin}
        targetOrigin={popoverStyles.targetOrigin}
        onRequestClose={onRequestClose}
      >
        <Menu>
          { layers.map((layer) => (
              <MenuItem 
                key={layer.creator_id}
                primaryText={layer.creator_name}
                checked={layer.isDisplayed}
                onTouchTap={() => (onTouchTapLayer(layer))}
              />
            ))
          }
        </Menu>
      </Popover>
    ) : null;
  }

  render() {
    const { onTouchTap, disabled } = this.props;
    return (
      <div>
        <RaisedButton
          onTouchTap={onTouchTap}
          label="Layers"
          disabled={disabled}
        />
        { this.renderLayersPopover() }
      </div>
    );
  }
}

LayersComponent.propTypes = propTypes;