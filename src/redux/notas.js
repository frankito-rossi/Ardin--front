import * as ActionTypes from './ActionTypes';

export const Notas = (state = {
      isLoading: true,
      errMess: null,
      notas: []
  }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_NOTAS:
      return {...state, isLoading: false, errMess: null, notas: action.payload}
    case ActionTypes.NOTAS_LOADING:
      return {...state, isLoading: true, errMess: null, notas: []}
    case ActionTypes.NOTAS_FAILED:
      return {...state, isLoading: false, errMess: action.payload, notas: []}
    case ActionTypes.ADD_NOTA:
      var nota = action.payload;
      state.notas.push(nota);
        return {...state};
    case ActionTypes.DELETE_NOTA:
      var index = state.notas.map(x => {return x._id}).indexOf(action.payload)
      state.notas.splice(index, 1);
      return {...state};
    default:
      return state;
  }
}
