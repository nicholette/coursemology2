// import React, { PropTypes } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

// import ScribingAnswerForm from './containers/ScribingAnswerForm';
// import * as scribingActions from '../../../actions/scribing';

// import { answerShape } from './propTypes';

// function mapStateToProps({ scribingAnswer, ...state }) {
//   return {
//     ...state,
//     scribingAnswer,
//   };
// }

// const propTypes = {
//   dispatch: PropTypes.func.isRequired,
//   scribingAnswer: PropTypes.shape({
//     answer: answerShape,
//     is_saving: PropTypes.bool,
//     is_saved: PropTypes.bool,
//     is_loading: PropTypes.bool,
//     save_errors: PropTypes.array(PropTypes.string),
//   }),
//   data: answerShape.isRequired,
// };

// const ScribingAnswer = (props) => {
//   const { dispatch, scribingAnswer, data } = props;
//   const actions = bindActionCreators(scribingActions, dispatch);

//   return (
//     <ScribingAnswerForm
//       actions={actions}
//       scribingAnswer={scribingAnswer}
//       data={data}
//     />
//   );
// };

// ScribingAnswer.propTypes = propTypes;

// export default connect(mapStateToProps)(ScribingAnswer);
