import * as ActionTypes from './ActionTypes';

export const Vales = (state = {
      isLoading: true,
      errMess: null,
      vales: []
  }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_VALES:
      return {...state, isLoading: false, errMess: null, vales: action.payload}
    case ActionTypes.VALES_LOADING:
      return {...state, isLoading: true, errMess: null, vales: []}
    case ActionTypes.VALES_FAILED:
      return {...state, isLoading: false, errMess: action.payload, vales: []}
    case ActionTypes.ADD_VALE:
      var vale = action.payload;
      state.vales.push(vale);
        return {...state};
    case ActionTypes.ADD_PAGO:
      let valePago = state.vales.filter((vale) => vale._id === action.payload.valeId)[0];
      console.log(valePago);
      let pago = valePago.pagos.filter((pago) => pago._id === action.payload.pago._id)[0];
      console.log(pago);
      pago.entrega = action.payload.pago.entrega;
      pago.fechaPago = action.payload.pago.fechaPago;
      pago.nota = action.payload.pago.nota;
      pago.pago = action.payload.pago.pago;
      return {...state};
    default:
      return state;
  }
}
