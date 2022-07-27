import * as ActionTypes from './ActionTypes';

export const Personas = (state = {
      isLoading: true,
      errMess: null,
      personas: []
  }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_PERSONAS:
      return {...state, isLoading: false, errMess: null, personas: action.payload}
    case ActionTypes.PERSONAS_LOADING:
      return {...state, isLoading: true, errMess: null, personas: []}
    case ActionTypes.PERSONAS_FAILED:
      return {...state, isLoading: false, errMess: action.payload, personas: []}
    case ActionTypes.REMOVERNOTADE_PERSONA:
      state.personas.map((persona) => {
          if(persona._id == action.payload[0]){
            var index = persona.notas.map(x => {return x._id}).indexOf(action.payload[1])
            persona.notas.splice(index, 1);
          }

      })
      return {...state}
    case ActionTypes.ADD_PERSONA:
      var persona = action.payload;
      state.personas.push(persona);
        return {...state};
    default:
      return state;
  }
}
