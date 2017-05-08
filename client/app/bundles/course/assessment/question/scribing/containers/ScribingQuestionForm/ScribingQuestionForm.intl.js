import { defineMessages } from 'react-intl';

export default defineMessages({
  titleFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.titleFieldLabel',
    defaultMessage: 'Title',
    description: 'Label for the title input field.',
  },
  descriptionFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.descriptionFieldLabel',
    defaultMessage: 'Description',
    description: 'Label for the description input field.',
  },
  staffOnlyCommentsFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.staffOnlyCommentsFieldLabel',
    defaultMessage: 'Staff only comments',
    description: 'Label for the staff only comments input field.',
  },
  maximumGradeFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.maximumGradeFieldLabel',
    defaultMessage: 'Maximum Grade',
    description: 'Label for the maximum grade input field.',
  },
  skillsFieldLabel: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.skillsFieldLabel',
    defaultMessage: 'Skills',
    description: 'Label for the skills input field.',
  },
  noFileChosenMessage: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.noFileChosenMessage',
    defaultMessage: 'No file chosen',
    description: 'Message to be displayed when no file is chosen for a file input.',
  },
  chooseFileButton: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.chooseFileButton',
    defaultMessage: 'Choose File',
    description: 'Button for adding an image attachment.',
  },
  submitButton: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.submitButton',
    defaultMessage: 'Submit',
    description: 'Button for submitting the form.',
  },
  submitFailureMessage: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.submitFailureMessage',
    defaultMessage: 'An error occurred, please try again.',
  },
  loadingMessage: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.loadingMessage',
    defaultMessage: 'Loading',
    description: 'Text to be displayed when waiting for server response after form submission.',
  },
  resolveErrorsMessage: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.resolveErrorsMessage',
    defaultMessage: 'This form has errors, please resolve before submitting.',
  },
  cannotBeBlankValidationError: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.cannotBeBlankValidationError',
    defaultMessage: 'Cannot be blank.',
  },
  positiveNumberValidationError: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.positiveNumberValidationError',
    defaultMessage: 'Value must be positive.',
  },
  valueMoreThanEqual1000Error: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.valueMoreThan1000Error',
    defaultMessage: 'Value must be less than 1000.',
  },
  lessThanEqualZeroValidationError: {
    id: 'course.assessment.question.scribing.scribingQuestionForm.lessThanEqualZeroValidationError',
    defaultMessage: 'Value must be greater than 0.',
  },
});
