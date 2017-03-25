import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

export default ({ scribingQuestion }) => {
  const initialStates = scribingQuestion;
  const storeCreator = compose(
    applyMiddleware(thunkMiddleware)
  )(createStore);

  // For testing: print state in console `window.store.getState()`
  window.store = storeCreator(rootReducer, initialStates);

  return storeCreator(rootReducer, initialStates);
};