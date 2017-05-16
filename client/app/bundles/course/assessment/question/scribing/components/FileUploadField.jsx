import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import styles from '../containers/ScribingQuestionForm/ScribingQuestionForm.scss';
import { questionNamePrefix, questionIdPrefix } from '../constants';
import { questionShape } from '../propTypes';

const propTypes = {
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  is_loading: PropTypes.bool,
}

const style = {
  fileInputField: {
    display: `none`,
  }
}

export default class FileUploadField extends Component {
  render() {
    const { field, label, is_loading } = this.props;

    return (
      <Field
        name={ questionNamePrefix + field }
        id={ questionIdPrefix + field }
        disabled={is_loading}
        component={props => (
          <RaisedButton
            className={styles.fileInputButton}
            label={ label }
            labelPosition="before"
            containerElement="label"
            primary
            disabled={is_loading}
          >
            <input
            id={ questionIdPrefix + field }
            type="file"
            accept="image/gif, image/png, image/jpeg, image/pjpeg, application/pdf"
            style={style.fileInputField}
            disabled={is_loading}
            onChange={
              ( e ) => {
                e.preventDefault();
                props.input.onChange(e.target.files);
              }
            }
            />
          </RaisedButton>
        )}
      />
    );
  }
} 

FileUploadField.propTypes = propTypes;