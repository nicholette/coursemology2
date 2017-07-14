import React, { Component, PropTypes } from 'react';
import Chip from 'material-ui/Chip';
import {cyan500, grey50} from 'material-ui/styles/colors';

const propTypes = {
  lineToolType: PropTypes.string,
  selectedLineStyle: PropTypes.string,
  onTouchTapLineStyleChip: PropTypes.func,
}

const styles = {
  fieldDiv: {
    fontSize: `16px`,
    lineHeight: `24px`,
    width: `210px`,
    height: `72px`,
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
  chip: {
    margin: `4px`,
  },
  chipWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    width: `220px`,
    padding: `40px 0px`,
  },
}

export default class LineStyleField extends Component {
  renderLineStyleChips() {
    const { lineToolType, selectedLineStyle, onTouchTapLineStyleChip } = this.props;
    const lineStyles = ['solid', 'dotted', 'dashed'];
    const chips = [];
    lineStyles.forEach((style)=>(chips.push(
      <Chip
        backgroundColor={selectedLineStyle === style ? cyan500 : undefined}
        labelColor={selectedLineStyle === style ? grey50 : undefined}
        key={lineToolType + style}
        style={styles.chip}
        onTouchTap={(event) => onTouchTapLineStyleChip(event, lineToolType, style)}
      >
        {style}
      </Chip>
    )));
    return chips;
  }

  render() {
    return (
      <div style={styles.fieldDiv}>
        <label style={styles.label}>Style:</label>
        <div style={styles.chipWrapper}>
          { this.renderLineStyleChips() }
        </div>
      </div>
    );
  }
} 

LineStyleField.propTypes = propTypes;