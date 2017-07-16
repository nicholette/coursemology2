import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import ChipInput from 'lib/components/ChipInput';
import { questionNamePrefix, questionIdPrefix } from '../constants';
import { skillShape } from '../propTypes';

const propTypes = {
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.array,             //TODO: what is the shape of this?
  options: PropTypes.arrayOf(skillShape),
  error: PropTypes.string,
  is_loading: PropTypes.bool,
}

const styles = {
  menuStyle: { 
    maxHeight: '80vh',
    overflowY: 'scroll',
  },
  skillChip: {
    display: 'none',
  }
};

export default class MultiSelectSkillsField extends Component {
  render() {
    const { label, field, value, options, error, is_loading } = this.props;

    return (
      <div>
        <Field
          name={ questionNamePrefix + field }
          id={ questionIdPrefix + field }
          component={props => (
            <ChipInput
              id={questionIdPrefix + field}
              value={props.input.value || []}
              dataSource={options}
              dataSourceConfig={{ value: 'id', text: 'title' }}
              onRequestAdd={(addedChip) => (
                props.input.onChange([...props.input.value, addedChip])
              )}
              onRequestDelete={(deletedChip) => {
                let values = (props.input.value || []).filter(v => v.id !== deletedChip);
                props.input.onChange(values);
              }}
              floatingLabelText={label}
              floatingLabelFixed
              openOnFocus
              fullWidth
              disabled={is_loading}
              errorText={error}
              menuStyle={styles.menuStyle}
            />
          )}
        />

        <select
          name={`${questionNamePrefix + field}[]`}
          multiple
          value={value.map(opt => opt.id)}
          style={styles.skillChip}
          disabled={is_loading}
          onChange={(e) => { this.onSelectSkills(parseInt(e.target.value, 10) || e.target.value); }}
        >
          { options.map(opt => <option value={opt.id} key={opt.id}>{opt.title}</option>) }
        </select>
      </div>
    );
  }
} 

MultiSelectSkillsField.propTypes = propTypes;