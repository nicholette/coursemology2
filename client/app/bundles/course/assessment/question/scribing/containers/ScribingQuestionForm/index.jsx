import React, { PropTypes } from 'react';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { reduxForm, Field, Form } from 'redux-form';
import TextField from 'lib/components/redux-form/TextField';
import SelectField from 'lib/components/redux-form/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import MaterialSummernote from 'lib/components/MaterialSummernote';
import ChipInput from 'lib/components/ChipInput';

import styles from './ScribingQuestionForm.scss';
import translations from './ScribingQuestionForm.intl';

import { fetchScribingQuestion, onChangeScribingQuestion, updateSkills, createScribingQuestion, updateScribingQuestion } from '../../actions/scribingQuestionActionCreators';

import { formNames } from '../../constants';
import formTranslations from 'lib/translations/form';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.shape({
    question: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      staff_only_comments: PropTypes.string,
      maximum_grade: PropTypes.number,
      weight: PropTypes.number,
      skills_ids: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
      })),
      skills: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        course_id: PropTypes.number,
        description: PropTypes.string,
        creator_id: PropTypes.number,
        updater_id: PropTypes.number,
        created_at: PropTypes.date,
        updated_at: PropTypes.date,
      })),
      error: PropTypes.shape({
        title: PropTypes.string,
        skills_id: PropTypes.string,
        maximum_grade: PropTypes.number,
      }),
      published_assessment: PropTypes.bool,
      attempt_limit: PropTypes.number,
    }),
    is_loading: PropTypes.bool,
  }).isRequired,
  formValues: PropTypes.object,
  scribingId: PropTypes.string,
  intl: intlShape.isRequired,
};

// const validate = (values) => {
//   // const errors = {};

//   // const requiredFields = ['maximum_grade'];
//   // requiredFields.forEach((field) => {
//   //   if (!values[field]) {
//   //     errors[field] = formTranslations.required;
//   //   }
//   // });

//   // return errors;
// };


// function validation(data, pathOfKeysToData, intl) {
//   const errors = [];
//   const questionErrors = {};
//   let hasError = false;

//   // Check maximum grade
//   const maximumGrade = data.maximum_grade;
//   if (!maximumGrade) {
//     questionErrors.maximum_grade =
//       intl.formatMessage(translations.cannotBeBlankValidationError);
//     hasError = true;
//   } else if (maximumGrade < 0) {
//     questionErrors.maximum_grade =
//       intl.formatMessage(translations.positiveNumberValidationError);
//     hasError = true;
//   }

//   // Check attempt_limit
//   const value = data.attempt_limit;
//   if (value && value <= 0) {
//     questionErrors.attempt_limit =
//       intl.formatMessage(translations.lessThanEqualZeroValidationError);
//     hasError = true;
//   }

//   if (hasError) {
//     errors.push({
//       path: pathOfKeysToData.concat(['error']),
//       error: questionErrors,
//     });
//   }

//   return errors;
// }

class ScribingQuestionForm extends React.Component {
  static getInputName(field) {
    return `question_scribing.${field}`;
  }

  static getInputId(field) {
    return `question_scribing_${field}`;
  }

  static convertNull(value) {
    return value === null ? '' : value;
  }

  componentDidMount() {
    const { dispatch, scribingId } = this.props;
    if (scribingId) {
      dispatch(fetchScribingQuestion(scribingId));
    }
    this.summernoteEditors = $('#scribing-question-form .note-editor .note-editable');
  }

  componentWillReceiveProps(nextProps) {
    this.summernoteEditors.attr('contenteditable', !nextProps.data.is_loading);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data.is_loading !== nextProps.data.is_loading;
  }

  handleCreateQuestion = (data) => {
    const { dispatch } = this.props;
    return dispatch(
      createScribingQuestion(data)
    );
  }

  handleUpdateQuestion = (data) => {
    const { dispatch, scribingId } = this.props;
    return dispatch(
      updateScribingQuestion(scribingId, data)
    );
  }

  onSelectSkills = (id) => {
    const currentSkills = this.props.data.question.skill_ids;
    const currentSkillsWithoutId = currentSkills.filterNot(v => v.id === id);

    if (currentSkills.size === currentSkillsWithoutId.size) {
      // id is for a new skill to be added
      const newSkill = this.props.data.question.skills
        .filter(v => v.id === id).first();

      if (newSkill) {
        this.props.actions.updateSkills(currentSkills.push(newSkill));
      }
    } else {
      // id is for a selected skill to be removed
      this.props.actions.updateSkills(currentSkillsWithoutId);
    }
  }

  // validationCheck() {
  //   const { data, intl } = this.props;
  //   const question = data.question;
  //   const errors = validation(question, ['question'], intl);

  //   this.props.actions.setValidationErrors(errors);

  //   return errors.length === 0;
  // }

  summernoteHandler(field) {
    return e => (this.props.form[field] = e === '' ? null : e);
  }

  submitButtonText() {
    if (this.props.data.is_loading) {
      return this.props.intl.formatMessage(translations.loadingMessage);
    }

    return this.props.intl.formatMessage(translations.submitButton);
  }

  renderInputField(label, field, required, validate, type, value, error = null, placeholder = null) {
    return (<Field
      name={ScribingQuestionForm.getInputName(field)}
      id={ScribingQuestionForm.getInputId(field)}
      validate={validate}
      floatingLabelText={(required ? '* ' : '') + label}
      floatingLabelFixed
      fullWidth
      component={TextField}
    />);
  }

  renderSummernoteField(label, field, validate, value) {
    return (
      <Field
        name={ScribingQuestionForm.getInputName(field)}
        id={ScribingQuestionForm.getInputId(field)}
        validate={validate}
        component={(props) => {
          return (
            <MaterialSummernote
              field={field}
              label={label}
              value={value}
              disabled={this.props.data.is_loading}
              name={ScribingQuestionForm.getInputName(field)}
              inputId={ScribingQuestionForm.getInputId(field)}
              onChange={props.input.onChange}
            />
          )
        }}
      />
    );
  }

  renderMultiSelectSkillsField(label, field, value, options, error) {
    return (
      <div key={field}>
        <Field
          name={ScribingQuestionForm.getInputName(field)}
          id={ScribingQuestionForm.getInputId(field)}
          component={(props) => {
            return (
              <ChipInput
                id={ScribingQuestionForm.getInputId(field)}
                value={value}
                dataSource={options}
                dataSourceConfig={{ value: 'id', text: 'title' }}
                onRequestAdd={(chip) => { this.onSelectSkills(chip.id); }}
                onRequestDelete={this.onSelectSkills}
                floatingLabelText={label}
                floatingLabelFixed
                openOnFocus
                fullWidth
                disabled={this.props.data.is_loading}
                errorText={error}
                menuStyle={{ maxHeight: '80vh', overflowY: 'scroll' }}
              />
            )
          }}
        />

        <select
          name={`${ScribingQuestionForm.getInputName(field)}[]`}
          multiple
          value={value.map(opt => opt.id)}
          style={{ display: 'none' }}
          disabled={this.props.data.is_loading}
          onChange={(e) => { this.onSelectSkills(parseInt(e.target.value, 10) || e.target.value); }}
        >
          { options.map(opt => <option value={opt.id} key={opt.id}>{opt.title}</option>) }
        </select>
      </div>
    );
  }

  render() {
    const { handleSubmit, formValues, submitting,
            invalid, submitFail,
            intl, scribingId } = this.props;
    const question = this.props.data.question;
    const formData = this.props.data.form_data;
    const showAttemptLimit = true;
    const onSubmit = scribingId ? this.handleUpdateQuestion : this.handleCreateQuestion;

    const skillsOptions = question.skills;
    const skillsValues = question.skill_ids;

    // Field level validations
    const required = value => value ? undefined : intl.formatMessage(translations.cannotBeBlankValidationError);
    const lessThan1000 = value => value && value >= 1000 ? 
      intl.formatMessage(translations.valueMoreThanEqual1000Error) :
      undefined;
    
    const nonNegative = value => value && value < 0 ? 
      intl.formatMessage(translations.positiveNumberValidationError) :
      undefined;

    return (
      <div>
        {
          this.props.data.save_errors ?
            <div className="alert alert-danger">
              {
                this.props.data.save_errors.map((errorMessage, index) => <div key={index}>{errorMessage}</div>)
              }
            </div>
            :
            null
        }
        <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className={styles.inputContainer}>
            <div className={styles.titleInput}>
              {
                this.renderInputField(
                  this.props.intl.formatMessage(translations.titleFieldLabel),
                  'title', false, [], 'text', question.title || '',
                  this.props.data.question.error && this.props.data.question.error.title)
              }
            </div>
            <div className={styles.descriptionInput}>
              {
                this.renderSummernoteField(
                  this.props.intl.formatMessage(translations.descriptionFieldLabel),
                  'description', [], question.description || '')
              }
            </div>
            <div className={styles.staffCommentsInput}>
              {
                this.renderSummernoteField(
                  this.props.intl.formatMessage(translations.staffOnlyCommentsFieldLabel),
                  'staff_only_comments', [], question.staff_only_comments || '')
             }
            </div>
            <div className={styles.skillsInput}>
              {
                this.renderMultiSelectSkillsField(
                  this.props.intl.formatMessage(translations.skillsFieldLabel),
                  'skill_ids', skillsValues, skillsOptions,
                  this.props.data.question.error && this.props.data.question.error.skill_ids)
              }
            </div>
            <div className={styles.maximumGradeInput}>
              {
                this.renderInputField(
                  this.props.intl.formatMessage(translations.maximumGradeFieldLabel),
                  'maximum_grade', true, [ required, lessThan1000, nonNegative ], 'number',
                  ScribingQuestionForm.convertNull(question.maximum_grade),
                  this.props.data.question.error && this.props.data.question.error.maximum_grade)
              }
            </div>
            {
              showAttemptLimit ?
                <div className={styles.attemptLimitInput}>
                  {
                    this.renderInputField(
                      this.props.intl.formatMessage(translations.attemptLimitFieldLabel),
                      'attempt_limit', false, [ nonNegative ], 'number',
                      ScribingQuestionForm.convertNull(question.attempt_limit),
                      this.props.data.question.error && this.props.data.question.error.attempt_limit,
                      this.props.intl.formatMessage(translations.attemptLimitPlaceholderMessage))
                  }
                </div>
                :
                null
            }
          </div>
          
          <RaisedButton
            className={styles.submitButton}
            label={'Submit'}
            labelPosition="before"
            primary
            id="scribing-question-form-submit"
            type="submit"
            disabled={this.props.data.is_loading || submitting}
            icon={this.props.data.is_loading ? <i className="fa fa-spinner fa-lg fa-spin" /> : null}
          />
        </Form>
      </div>
    );
  }
}

ScribingQuestionForm.propTypes = propTypes;

export default reduxForm({
  form: formNames.SCRIBING_QUESTION,
  enableReinitialize: true,
})(injectIntl(ScribingQuestionForm));

