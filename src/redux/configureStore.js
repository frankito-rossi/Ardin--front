import { createStore, combineReducers, applyMiddleware } from 'redux';
//import { createForms } from 'react-redux-form';
import { Personas } from './personas';
import { Notas } from './notas';
import { Vales } from './vales';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
//import { InitialFeedback } from './forms';

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      personas: Personas,
      notas: Notas,
      vales: Vales,
/*      ...createForms({
          feedback: InitialFeedback
      })*/
    }),
    applyMiddleware(thunk, logger)
  );
  return store;
}
