import { PropTypes } from 'react';

export const answerShape = PropTypes.shape({
  scribbles: PropTypes.arrayOf(scribbleShape),
});

export const scribbleShape = PropTypes.shape({
  content: PropTypes.string,
});