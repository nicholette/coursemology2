import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import _ from 'lodash';
import rootReducer, { initialStates as defaultInitialStates } from './reducers';

export default ({ scribingAnswer }) => {
  const initialStates = _.merge(defaultInitialStates, scribingAnswer);
  const storeCreator = compose(
    applyMiddleware(thunkMiddleware)
  )(createStore);

  return storeCreator(rootReducer, initialStates);
};
