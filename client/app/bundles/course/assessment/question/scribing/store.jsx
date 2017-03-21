import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer, { initialStates as defaultInitialStates } from './reducers';

export default (props) => {
  const initialStates = defaultInitialStates.mergeDeep({ scribingQuestion: props });
  const storeCreator = compose(
    applyMiddleware(thunkMiddleware)
  )(createStore);

  return storeCreator(rootReducer, initialStates);
};
