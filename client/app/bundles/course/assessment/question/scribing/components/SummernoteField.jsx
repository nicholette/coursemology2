import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import MaterialSummernote from 'lib/components/redux-form/RichTextField';
import { questionNamePrefix, questionIdPrefix } from '../constants';

const propTypes = {
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  validate: PropTypes.array,
  is_loading: PropTypes.bool,
}

export default class SummernoteField extends Component {
  render() {
    const { label, field, validate } = this.props;
    return (
       <Field
        name={ questionNamePrefix + field }
        id={ questionIdPrefix + field}
        label={ label }
        validate={validate}
        component={MaterialSummernote}
      />
    );
  }
}

SummernoteField.propTypes = propTypes;
