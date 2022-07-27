import * as ActionTypes from './ActionTypes';
//import { DISHES } from '../shared/dishes';
import { baseUrl } from '../shared/baseUrl'


///////// --- PERSONAS --- ///////////

export const fetchPersonas = () => (dispatch) => {
  dispatch(personasLoading(true));

  return fetch(baseUrl + 'personas')
    .then(response => {
      if(response.ok){
        return response;
      }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
    },
    error => {
      var errmess = new Error(error.message);
      throw errmess;
    })
    .then(response => response.json())
    .then(personas => dispatch(addPersonas(personas)))
    .catch(error => dispatch(personasFailed(error.message)));
}

export const personasLoading = () => ({
  type: ActionTypes.PERSONAS_LOADING
});

export const personasFailed = (errmess) => ({
  type: ActionTypes.PERSONAS_FAILED,
  payload: errmess
})

export const addPersonas = (personas) => ({
  type: ActionTypes.ADD_PERSONAS,
  payload: personas
});

export const addPersona = (persona) => ({
  type: ActionTypes.ADD_PERSONA,
  payload: persona
});

export const postPersona = (persona) => dispatch => {

  const newPersona = {
    ci: persona.ci,
    apellidos: persona.apellidos,
    nombres: persona.nombres,
    direccion: persona.direccion,
    localidad: persona.localidad,
    telefono: persona.telefono,
    fechaNacimiento: new Date(persona.fechaNacimientoAno, persona.fechaNacimientoMes - 1,  persona.fechaNacimientoDia).toLocaleDateString(),
    notas: [],
    vales: []
  }
  if(persona.bienes) {
    newPersona.bienes = true;
  } else {
    newPersona.bienes = false;
  }

  return fetch(baseUrl + 'personas', {
    method: 'POST',
    body: JSON.stringify(newPersona),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(response => {
      if(response.ok){
        return response
      }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
    }, error => {
      var errmess = new Error(error.message);
      throw errmess;
    })
    .then(response => response.json())
    .then(response => dispatch(addPersona(newPersona)))
    .catch(error => {console.log('Post comments', error.message)
      alert('La nota no ha podido ser ingresada. Error: ' + error.message)})
}

///////// --- NOTAS --- ///////////

export const fetchNotas = () => (dispatch) => {
  dispatch(notasLoading(true));

  return fetch(baseUrl + 'notas')
    .then(response => {
      if(response.ok){
        return response;
      }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
    },
    error => {
      var errmess = new Error(error.message);
      throw errmess;
    })
    .then(response => response.json())
    .then(notas => dispatch(addNotas(notas)))
    .catch(error => dispatch(notasFailed(error.message)));
}

export const notasLoading = () => ({
  type: ActionTypes.NOTAS_LOADING
});

export const notasFailed = (errmess) => ({
  type: ActionTypes.NOTAS_FAILED,
  payload: errmess
})

export const addNotas = (notas) => ({
  type: ActionTypes.ADD_NOTAS,
  payload: notas
});

export const addNota = (nota) => ({
  type: ActionTypes.ADD_NOTA,
  payload: nota
});

export const deleteNota = (notaId) => ({
  type: ActionTypes.DELETE_NOTA,
  payload: notaId
});

export const removerNotaDePersona = (personaId, notaId) => ({
  type: ActionTypes.REMOVERNOTADE_PERSONA,
  payload: [personaId, notaId]
})

export const postNota = (personaId,  nota) => dispatch => {
  const newNota = {
    persona: personaId,
    nota: nota
  }
  newNota.fecha = new Date().toLocaleDateString();

  return fetch(baseUrl + 'notas', {
    method: 'POST',
    body: JSON.stringify(newNota),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(response => {
      if(response.ok){
        return response
      }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
    }, error => {
      var errmess = new Error(error.message);
      throw errmess;
    })
    .then(response => response.json())
    .then(response => { newNota._id = response.notas[response.notas.length - 1]; dispatch(addNota(newNota))})
    .catch(error => {console.log('Post comments', error.message)
      alert('La nota no ha podido ser ingresada. Error: ' + error.message)})
}

export const removeNota = (personaId, notaId) => dispatch => {

  return fetch(baseUrl + 'notas/' + `${notaId}` , {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(response => {
      if(response.ok){
        return response
      }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
    }, error => {
      var errmess = new Error(error.message);
      throw errmess;
    })
    .then(response => response.json())
    .then(response => { dispatch(deleteNota(notaId)); dispatch(removerNotaDePersona(personaId, notaId))})
    .catch(error => {console.log('Delete Nota x', error.message)
      alert('La nota no ha podido ser Borrada. Error: ' + error.message)})
  }

///////// --- VALES --- ///////////

export const fetchVales = () => (dispatch) => {
  dispatch(valesLoading(true));

  return fetch(baseUrl + 'vales')
    .then(response => {
      if(response.ok){
        return response;
      }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
    },
    error => {
      var errmess = new Error(error.message);
      throw errmess;
    })
    .then(response => response.json())
    .then(vales => dispatch(addVales(vales)))
    .catch(error => dispatch(valesFailed(error.message)));
}

export const valesLoading = () => ({
  type: ActionTypes.VALES_LOADING
});

  export const valesFailed = (errmess) => ({
  type: ActionTypes.VALES_FAILED,
  payload: errmess
})

export const addVales = (vales) => ({
  type: ActionTypes.ADD_VALES,
  payload: vales
});

export const addVale = (vale) => ({
  type: ActionTypes.ADD_VALE,
  payload: vale
});

export const postVale = (personaId, vale) => dispatch => {
  const newVale = {
    numeroFactura: vale.numeroFactura,
    numeroConforme: vale.numeroConforme,
    importe: vale.importe,
    cantidadCuotas: vale.cantidadCuotas,
    entregaInicial: vale.entregaInicial,
    detalle: vale.detalle,
    persona: personaId,
    pagos: [],
    interes: vale.interes,
    mora: vale.mora
  }

  let interes = newVale.interes;
  let deuda = newVale.importe - newVale.entregaInicial;

  let capitalFinal = deuda * ((1 + (interes/100)) ** newVale.cantidadCuotas);

  let importe = capitalFinal / newVale.cantidadCuotas;

  let date = Date.now();
  newVale.fechaEmision = new Date().toLocaleDateString();
  if(new Date(date).getMonth() == 11){
    newVale.fechaPrimerVencimiento = new Date(new Date(date).getFullYear()+1, 0, new Date(date).getDate(), new Date(date).getHours()).toLocaleDateString();
  } else {
    newVale.fechaPrimerVencimiento = new Date(new Date(date).getFullYear(), new Date(date).getMonth()+1, new Date(date).getDate(), new Date(date).getHours()).toLocaleDateString();
  }

  for( let i = 1; i <= newVale.cantidadCuotas; i++){
    //Creamos los "pagos"
    if(new Date(date).getMonth() == 11){
      date = new Date(new Date(date).getFullYear()+1, 0, new Date(date).getDate());
    } else {
      date = new Date(new Date(date).getFullYear(), new Date(date).getMonth()+1, new Date(date).getDate());
    }

    let newPago = {
      importe: importe,
      fechaVencimiento: date.toLocaleDateString()
    }
    newVale.pagos.push(newPago);
  }

  console.log(newVale);
  return fetch(baseUrl + 'vales', {
    method: 'POST',
    body: JSON.stringify(newVale),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(response => {
      if(response.ok){
        return response
      }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
    }, error => {
      var errmess = new Error(error.message);
      throw errmess;
    })
    .then(response => response.json())
    .then(response => { newVale._id = response.vales[response.vales.length - 1]; dispatch(addVale(newVale))})
    .catch(error => {console.log('Post Vale', error.message)
      alert('El vale no ha podido ser ingresado. Error: ' + error.message)})
}

export const addPago = (payload) => ({
  type: ActionTypes.ADD_PAGO,
  payload: payload
});

export const postPago = (valeId, pago) => dispatch => {
  const newPago = {
    entrega: pago.entrega,
    importe: pago.importe,
    nota: pago.nota,
    pago: true,
    _id: pago._id
  }

  let date = Date.now();
  newPago.fechaPago = new Date().toLocaleDateString();

  const payload = {
    valeId: valeId,
    pago: newPago
  }
  console.log(newPago);
  return fetch(baseUrl + 'vales/' + `${valeId}`  , {
    method: 'PUT',
    body: JSON.stringify(newPago),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(response => {
      if(response.ok){
        return response
      }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
    }, error => {
      var errmess = new Error(error.message);
      throw errmess;
    })
    .then(response => response.json())
    .then(response => { dispatch(addPago(payload))})
    .catch(error => {console.log('Post Pago', error.message)
      alert('El pago no ha podido ser ingresado. Error: ' + error.message)})
}
