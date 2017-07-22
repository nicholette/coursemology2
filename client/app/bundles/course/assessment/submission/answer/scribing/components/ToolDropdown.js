import React, { Component, PropTypes } from 'react';
import FontIcon from 'material-ui/FontIcon';

const propTypes = {
  toolType: PropTypes.string.isRequired,
  currentTool: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onClickIcon: PropTypes.func,
  onTouchTapChevron: PropTypes.func,
  colorBar: PropTypes.string,
  iconClassname: PropTypes.string,
  colorBarComponent: PropTypes.func,
  iconComponent: PropTypes.func,
  popoverComponent: PropTypes.func,
}

const style = {
  tool: {
    position: `relative`,
    display: `inline-block`,
    paddingRight: `24px`,
  },
  innerTool: {
    display: `inline-block`,
  },
  colorBar: {
    width:`23px`,
    height:`8px`,
  },
  chevron: {
    color: `rgba(0, 0, 0, 0.4)`,
    fontSize:`12px`,
    padding: `10px 0px 10px 0px`,
  },
}

export default class ToolDropdown extends Component {

  renderIcon() {
    const { iconClassname, currentTool, toolType, iconComponent } = this.props;

    return iconComponent ?
      iconComponent() :
      <FontIcon
        className={iconClassname}
        style={
          currentTool === toolType ?
            {color: `black`} :
            {color: `rgba(0, 0, 0, 0.4)`}
        }
      />;
  }

  renderColorBar() {
    const { colorBar, colorBarComponent } = this.props;

    return colorBarComponent ?
      colorBarComponent() : 
      <div style={{ ...style.colorBar, background: colorBar }}/>;
  }

  render() {
    const { onClick, onClickIcon, onTouchTapChevron, 
            colorBar, iconComponent, popoverComponent } = this.props;

    return (
      <div style={style.tool} onClick={onClick}>
        <div style={style.innerTool} onClick={onClickIcon}>
          { this.renderIcon() }
          { this.renderColorBar() }
        </div>
        <div style={style.innerTool}>
          <FontIcon className="fa fa-chevron-down" style={style.chevron} onTouchTap={onTouchTapChevron}/>
        </div>

        { popoverComponent() }

      </div>
    );
  }
} 

ToolDropdown.propTypes = propTypes;