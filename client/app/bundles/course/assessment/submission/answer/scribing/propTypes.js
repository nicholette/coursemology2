import { PropTypes } from 'react';

export const scribbleShape = PropTypes.shape({
  content: PropTypes.string,
});

export const answerShape = PropTypes.shape({
  scribbles: PropTypes.arrayOf(scribbleShape),
  image_path: PropTypes.string,
  user_id: PropTypes.number,
  answer_id: PropTypes.number,
});
