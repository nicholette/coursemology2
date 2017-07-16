import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import TextField from 'lib/components/redux-form/TextField';
import { questionNamePrefix, questionIdPrefix } from '../constants';
import { questionShape } from '../propTypes';

const propTypes = {
  placeholder: PropTypes.string,
  field: PropTypes.string.isRequired,
  validate: PropTypes.array,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  type: PropTypes.string,
  is_loading: PropTypes.bool,
}

export default class InputField extends Component {
  render() {
    const { placeholder, field, validate, label, required,
            type, is_loading } = this.props;

    return (
      <div title={placeholder}>
        <Field
          name={ questionNamePrefix + field }
          id={ questionIdPrefix + field}
          validate={validate}
          floatingLabelText={(required ? '* ' : '') + label}
          floatingLabelFixed
          fullWidth
          type={type}
          component={TextField}
          disabled={is_loading}
        />
      </div>
    );
  }
} 

InputField.propTypes = propTypes;