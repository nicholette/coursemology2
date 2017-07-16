import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';

import createComponent from 'lib/components/redux-form/createComponent';
import mapError from 'lib/components/redux-form/mapError';

import styles from '../containers/ScribingQuestionForm/ScribingQuestionForm.scss';
import { questionNamePrefix, questionIdPrefix } from '../constants';


const mapProps = props => ({ ...mapError(props) });

const propTypes = {
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  validate: PropTypes.array,
  is_loading: PropTypes.bool,
};

const style = {
  fileInputField: {
    display: 'none',
  },
};

class FileUploadField extends Component {
  renderFileNameLabel(props) {
    if (this.props.fileName) {
      return (<div className={styles.fileLabel}>{ this.props.fileName }</div>);
    } else if (props.meta.touched && props.meta.invalid && props.meta.error) {
      return (
        <div className={styles.fileLabelError}>
          { props.meta.touched && props.meta.invalid && props.meta.error }
        </div>
      );
    }
    return [];
  }

  render() {
    const { field, label, validate, is_loading } = this.props;

    return (
      <Field
        name={questionNamePrefix + field}
        id={questionIdPrefix + field}
        disabled={is_loading}
        validate={validate}
        component={props => (
          <div>
            <RaisedButton
              className={styles.fileInputButton}
              label={label}
              labelPosition="before"
              containerElement="label"
              primary
              disabled={is_loading}
            >
              <input
                id={questionIdPrefix + field}
                type="file"
                accept="image/gif, image/png, image/jpeg, image/pjpeg, application/pdf"
                style={style.fileInputField}
                disabled={is_loading}
                onChange={
                  (e) => {
                    e.preventDefault();
                    props.input.onChange(e.target.files);
                  }
                }
              />
            </RaisedButton>
            { this.renderFileNameLabel(props) }
          </div>)
        }
      />
    );
  }
}

FileUploadField.propTypes = propTypes;

export default createComponent(FileUploadField, mapProps);
