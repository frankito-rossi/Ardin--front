import React, {useState} from 'react';
import { Button, Label, Col, Row } from 'reactstrap';
import { Loading } from './LoadingComponent';
//import {baseUrl} from '../shared/baseUrl';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
import Modal from 'react-bootstrap/Modal';
import {Link} from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
const max = (numb) => (val) => !(val) || (val <= numb)
const min = (numb) => (val) => val && (val >= numb);
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

function booleanFormatter(cell, row) {
  if(cell){
    return (
      <span> Sí </span>
    );
  }
  else {
    return (
      <span> No </span>
    );
  }
}
function priceFormatter(cell, row) {
  if(cell){
    return (
      <span>$ { Math.round(cell * 100) / 100 }</span>
    );
  } else {
    return (
      <span></span>
    );
  }
}

const rowDebe = (row, rowIndex) => {
  const style = {};
  if (row.debe) {
    style.backgroundColor = '#7a1b0c';
    style.color = 'white';
  } else {
    style.backgroundColor = '#e0d8b0';
    style.color = 'black';
  }
  return style;
};

const columns = [
  {
    dataField: "ci",
    text: "CI",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "nombres",
    text: "Nombre",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "apellidos",
    text: "Apellidos",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "direccion",
    text: "Direccion",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "localidad",
    text: "Localidad",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "telefono",
    text: "Telefono",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "fechaNacimiento",
    text: "Fecha de Nacimiento",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "bienes",
    text: "Bienes",
    sort: true,
    formatter: booleanFormatter
  }
];

function RenderPersona({items, isLoading, errMess, postNota, postPersona, postVale}) {
  const [showOptions, setShowOptions] = useState(false);
  const [showNotas, setShowNotas] = useState(false);
  const [showVales, setShowVales] = useState(false);
  const [showPersona, setShowPersona] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [_id, set_id] = useState(0);

  function handleShowNotas(breakpoint) {
  setFullscreen(breakpoint);
  setShowNotas(true);
  }
  function handleShowVales(breakpoint) {
  setFullscreen(breakpoint);
  setShowVales(true);
  }
  function handleShowPersona(breakpoint) {
  setFullscreen(breakpoint);
  setShowPersona(true);
  }

  const handleCloseOptions = () => setShowOptions(false);
  const handleCloseNotas = () => setShowNotas(false);
  const handleCloseVales = () => setShowVales(false);
  const handleClosePersona = () => setShowPersona(false);
  const handleShow = () => setShowOptions(true);

  const handleSubmitNota = (values) => {
    setShowNotas(false);
    postNota(_id, values.nota);
  }
  const handleSubmitPersona = (values) => {
    setShowPersona(false);
    postPersona(values);
  }
  const handleSubmitVales = (values) => {
    setShowVales(false);
    postVale(_id, values);
  }

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      console.log(row);
      setShowOptions(true);
      set_id(row._id);
      console.log(_id);
    }
  }

  if(isLoading){
    return(
      <Loading />
    );
  } else if(errMess){
    return(
      <h4>{errMess}</h4>
    );
  }
    else{


      return(
        <div>
        <h1>Personas</h1>
        <BootstrapTable
        bootstrap4
        keyField="id"
        data={items}
        columns={columns}
        filter= { filterFactory() }
        rowEvents= { rowEvents }
        rowStyle={ rowDebe }
        pagination={paginationFactory({ sizePerPage: 5 })}
      />

      <div class="gap-2">
          <Button  color="success" size="lg" onClick={handleShowPersona}>
            Agregar persona
          </Button>

          <Link to={`/vales`}>
            <Button className="m-3" color="warning" size="lg">
              Ver Vales
            </Button>
          </Link>

          <Link to={`/notas`}>
            <Button color="warning" size="lg">
              Ver Notas
            </Button>
          </Link>
      </div>

      <Modal show={showOptions} onHide={handleCloseOptions} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Que accion desea realizar ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="gap-2">
            <h4>Notas</h4>
            <Button className="m-2" color="success" size="lg" onClick={handleShowNotas}>
            Agregar Nota
            </Button>
            <Link to={`/notas/${_id}`}>
              <Button className="m-2" color="warning" size="lg">
                Ver Notas
              </Button>
            </Link>
          </div>
          <div class="gap-2">
            <h4>Vales</h4>
            <Button className="m-2" color="success" size="lg" onClick={handleShowVales}>
            Agregar Vale
            </Button>
            <Link to={`/vales/${_id}`}>
              <Button className="m-2" color="warning" size="lg">
                Ver Vales
              </Button>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    //  AGREGAR NOTAS
      <Modal show={showNotas} fullscreen={fullscreen} onHide={() => setShowNotas(false)}>
        <Modal.Header closeButton>
          <Modal.Title>AGREGAR UNA NUEVA NOTA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LocalForm onSubmit={(values) => handleSubmitNota(values)}>
          <Label htmlfor="nota" md={2}>Detalle</Label>
          <Col md={10}>
            <Control.textarea model=".nota" id="nota" name="nota"
                  rows="6"
                  className="form-control"
                  />
          </Col>
          <Col md={{size:10}}>
              <Button type="submit" color="success">
                Agregar
              </Button>
            </Col>
          </LocalForm>
        </Modal.Body>
      </Modal>
    //  AGREGAR VALES
      <Modal show={showVales} fullscreen={fullscreen} onHide={() => setShowVales(false)}>
        <Modal.Header closeButton>
          <Modal.Title>AGREGAR UN NUEVO VALE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <LocalForm onSubmit={(values) => handleSubmitVales(values)}>
              <Row className="form-group">
                  <Label htmlFor="numeroFactura" md={1}>Numero Facutura</Label>
                  <Col md={3}>
                      <Control.text model=".numeroFactura" id="numeroFactura" name="numeroFactura"
                          placeholder="Numero Factura"
                          className="form-control"
                          validators={{
                              required, isNumber
                          }}
                           />
                      <Errors
                          className="text-danger"
                          model=".numeroFactura"
                          show="touched"
                          messages={{
                              required: 'Necesario ',
                              isNumber: 'Todos los digitos deben ser numero '
                          }}
                       />
                  </Col>
                  <Label htmlFor="numeroConforme" md={1}>Numero Conforme</Label>
                  <Col md={3}>
                      <Control.text model=".numeroConforme" id="numeroConforme" name="numeroConforme"
                          placeholder="Numero Conforme"
                          className="form-control"
                          validators={{
                              required, isNumber
                          }}
                           />
                      <Errors
                          className="text-danger"
                          model=".numeroConforme"
                          show="touched"
                          messages={{
                              required: 'Necesario ',
                              isNumber: 'Todos los digitos deben ser numero '
                          }}
                       />
                  </Col>
              </Row>
              <Row className="form-group">
                  <Label htmlFor="importe" md={1}>Importe</Label>
                  <Col md={3}>
                      <Control.text model=".importe" id="importe" name="importe"
                          placeholder="Importe"
                          className="form-control"
                          validators={{
                              required, isNumber
                          }}
                           />
                      <Errors
                          className="text-danger"
                          model=".importe"
                          show="touched"
                          messages={{
                              required: 'Necesario ',
                              isNumber: 'Todos los digitos deben ser numero '
                          }}
                       />
                  </Col>
                  <Label htmlFor="cantidadCuotas" md={1}>Cantidad deCuotas</Label>
                  <Col md={3}>
                      <Control.text model=".cantidadCuotas" id="cantidadCuotas" name="cantidadCuotas"
                          placeholder="Cantidad Cuotas"
                          className="form-control"
                          validators={{
                              required, isNumber
                          }}
                           />
                      <Errors
                          className="text-danger"
                          model=".cantidadCuotas"
                          show="touched"
                          messages={{
                              required: 'Necesario ',
                              isNumber: 'Todos los digitos deben ser numero '
                          }}
                       />
                  </Col>
              </Row>
              <Row className="form-group">
                  <Label htmlFor="interes" md={1}>Tasa Interes Anual</Label>
                  <Col md={3}>
                      <Control.text model=".interes" id="interes" name="interes"
                          placeholder="Interes"
                          className="form-control"
                          validators={{
                              required, isNumber
                          }}
                           />
                      <Errors
                          className="text-danger"
                          model=".interes"
                          show="touched"
                          messages={{
                              required: 'Necesario ',
                              isNumber: 'Todos los digitos deben ser numero '
                          }}
                       />
                  </Col>
                  <Label htmlFor="mora" md={1}>Tasa mora</Label>
                  <Col md={3}>
                      <Control.text model=".mora" id="mora" name="mora"
                          placeholder="Tasa Mora"
                          className="form-control"
                          validators={{
                              required, isNumber
                          }}
                           />
                      <Errors
                          className="text-danger"
                          model=".mora"
                          show="touched"
                          messages={{
                              required: 'Necesario ',
                              isNumber: 'Todos los digitos deben ser numero '
                          }}
                       />
                  </Col>
              </Row>
              <Row className="form-group">
                  <Label htmlFor="entregaInicial" md={1}>Entrega Inicial</Label>
                  <Col md={3}>
                      <Control.text model=".entregaInicial" id="entregaInicial" name="entregaInicial"
                          placeholder="Entrega Inicial"
                          className="form-control"
                          validators={{
                              required, isNumber
                          }}
                           />
                      <Errors
                          className="text-danger"
                          model=".entregaInicial"
                          show="touched"
                          messages={{
                              required: 'Necesario ',
                              isNumber: 'Todos los digitos deben ser numero '
                          }}
                       />
                  </Col>
              </Row>
              <Label htmlfor="detalle" md={2}>Detalle</Label>
              <Col md={10}>
                <Control.textarea model=".detalle" id="detalle" name="detalle"
                      rows="6"
                      className="form-control"
                      />
              </Col>
              <Col md={{size:10}}>
                <Button type="submit" color="success">
                  Agregar
                </Button>
              </Col>
          </LocalForm>
        </Modal.Body>
      </Modal>

    //  AGREGAR PERSONA
      <Modal show={showPersona} fullscreen={fullscreen} onHide={() => setShowPersona(false)}>
        <Modal.Header closeButton>
          <Modal.Title>AGREGAR UNA NUEVA PERSONA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LocalForm onSubmit={(values) => handleSubmitPersona(values)}>
          <Row className="form-group">
              <Label htmlFor="ci" md={1}>CI</Label>
              <Col md={3}>
                  <Control.text model=".ci" id="ci" name="ci"
                      placeholder="CI sin guion"
                      className="form-control"
                      validators={{
                          required, minLength: minLength(8), maxLength: maxLength(8), isNumber
                      }}
                       />
                  <Errors
                      className="text-danger"
                      model=".ci"
                      show="touched"
                      messages={{
                          required: 'Necesario ',
                          minLength: 'Debe ingresar 8 digitos ',
                          maxLength: 'Debe ingresar 8 digitos ',
                          isNumber: 'Todos los digitos deben ser numero '
                      }}
                   />
              </Col>
          </Row>
          <Row className="form-group">
              <Label htmlFor="apellidos" md={1}>Apellidos</Label>
              <Col md={3}>
                  <Control.text model=".apellidos" id="apellidos" name="apellidos"
                      placeholder="Apellidos"
                      className="form-control"
                      validators={{
                          required
                      }}
                       />
                  <Errors
                      className="text-danger"
                      model=".apellidos"
                      show="touched"
                      messages={{
                          required: 'Necesario ',
                      }}
                   />
              </Col>
              <Label htmlFor="nombres" md={1}>Nombres</Label>
              <Col md={3}>
                  <Control.text model=".nombres" id="nombres" name="nombres"
                      placeholder="Nombres"
                      className="form-control"
                      validators={{
                          required
                      }}
                       />
                  <Errors
                      className="text-danger"
                      model=".nombres"
                      show="touched"
                      messages={{
                          required: 'Necesario ',
                      }}
                   />
              </Col>
          </Row>
          <Row className="form-group">
              <Label htmlFor="direccion" md={1}>Direccion</Label>
              <Col md={3}>
                  <Control.text model=".direccion" id="direccion" name="direccion"
                      placeholder="Direccion"
                      className="form-control"
                      validators={{
                          required
                      }}
                       />
                  <Errors
                      className="text-danger"
                      model=".direccion"
                      show="touched"
                      messages={{
                          required: 'Necesario ',
                      }}
                   />
              </Col>
              <Label htmlFor="localidad" md={1}>Localidad</Label>
              <Col md={3}>
                  <Control.text model=".localidad" id="localidad" name="localidad"
                      placeholder="Localidad"
                      className="form-control"
                      validators={{
                          required
                      }}
                       />
                  <Errors
                      className="text-danger"
                      model=".localidad"
                      show="touched"
                      messages={{
                          required: 'Necesario ',
                      }}
                   />
              </Col>
          </Row>
          <Row className="form-group">
              <Label htmlFor="telefono" md={1}>Telefono</Label>
              <Col md={2}>
                  <Control.text model=".telefono" id="telefono" name="telefono"
                      placeholder="Telefono"
                      className="form-control"
                      validators={{
                          required, minLength: minLength(8), maxLength: maxLength(9), isNumber
                      }}
                       />
                  <Errors
                      className="text-danger"
                      model=".telefono"
                      show="touched"
                      messages={{
                          required: 'Necesario ',
                          minLength: 'Debe ingresar 8 o 9 digitos ',
                          maxLength: 'Debe ingresar 8 o 9 digitos ',
                          isNumber: 'Todos los digitos deben ser numero '

                      }}
                   />
              </Col>
              <Label htmlFor="fechaNacimientoDia" md={1}>Dia de Nacimiento</Label>
              <Col md={1}>
                  <Control.text model=".fechaNacimientoDia" id="fechaNacimientoDia" name="fechaNacimientoDia"
                      placeholder="Dia"
                      className="form-control"
                      validators={{
                           min: min(1), max: max(31), isNumber
                      }}
                       />
                  <Errors
                      className="text-danger"
                      model=".fechaNacimiento"
                      show="touched"
                      messages={{
                        min: 'Debe ser al menos 1',
                        max: 'Debe ser como mucho 31 ',
                        isNumber: 'Debe ser numero '
                      }}
                   />
              </Col>
              <Label htmlFor="fechaNacimientoMes" md={1}>Mes de Nacimiento</Label>
              <Col md={1}>
                  <Control.text model=".fechaNacimientoMes" id="fechaNacimientoMes" name="fechaNacimientoMes"
                      placeholder="Mes"
                      className="form-control"
                      validators={{
                          required, min: min(1), max: max(12), isNumber
                      }}
                       />
                  <Errors
                      className="text-danger"
                      model=".fechaNacimientoMes"
                      show="touched"
                      messages={{
                        required: 'Necesario ',
                        min: 'Debe ser al menos 1',
                        max: 'Debe ser como mucho 12 ',
                        isNumber: 'Debe ser numero '
                      }}
                   />
              </Col>
              <Label htmlFor="fechaNacimientoAno" md={1}>Año de Nacimiento</Label>
              <Col md={1}>
                  <Control.text model=".fechaNacimientoAno" id="fechaNacimientoAno" name="fechaNacimientoAno"
                      placeholder="Año"
                      className="form-control"
                      validators={{
                          isNumber
                      }}
                       />
                  <Errors
                      className="text-danger"
                      model=".fechaNacimiento"
                      show="touched"
                      messages={{
                        isNumber: 'Debe ser un numero '
                      }}
                   />
              </Col>
              <Col md={{size:8, offset: 2}}>
                <div className="form-check">
                  <Label check>
                      <Control.checkbox model=".bienes" id="bienes" name="bienes"
                          className="form-check-input"
                           /> {' '}
                      <strong>Tiene bienes?</strong>
                  </Label>
                </div>
              </Col>
          </Row>
          <Col md={{size:10}}>
              <Button type="submit" color="success">
                Agregar
              </Button>
            </Col>
          </LocalForm>
        </Modal.Body>
      </Modal>

        </div>
      );}

}

function Home(props) {
    return(
        <div className="container">
            <div className="row align-items-start">
                <div className="col-12 col-md m-1">
                    <RenderPersona items={props.personas}
                    isLoading={props.personasLoading}
                    errMess={props.personasErrMess}
                    postNota={props.postNota}
                    postPersona={props.postPersona}
                    postVale={props.postVale}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
