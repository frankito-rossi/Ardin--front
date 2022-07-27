import React, {useState} from 'react';
import { Table, Button, Label, Col, Row } from 'reactstrap';
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

function porcentajeFormatter(cell, row){
  if(cell){
    return (
      <span>{ cell } %</span>
    );
  } else {
    return (
      <span></span>
    );
  }
}

const columns = [
  {
    dataField: "numeroFactura",
    text: "Numero Factura",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "numeroConforme",
    text: "Numero Conforme",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "fechaEmision",
    text: "Fecha Emision",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "importe",
    text: "Importe",
    sort: true,
    filter: textFilter(),
    formatter: priceFormatter
  },
  {
    dataField: "entregaInicial",
    text: "Entrega Inicial",
    sort: true,
    filter: textFilter(),
    formatter: priceFormatter
  },
  {
    dataField: "cantidadCuotas",
    text: "Cantidad Cuotas",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "interes",
    text: "Tasa Interes",
    sort: true,
    filter: textFilter(),
    formatter: porcentajeFormatter
  },
  {
    dataField: "fechaPrimerVencimiento",
    text: "Primer Vencimiento",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "detalle",
    text: "Detalle",
    sort: true,
    filter: textFilter()
  }
];
const columnsPagos = [
  {
    dataField: "entrega",
    text: "Entrega",
    sort: true,
    formatter: priceFormatter
  },
  {
    dataField: "importe",
    text: "Importe",
    sort: true,
    formatter: priceFormatter
  },
  {
    dataField: "fechaPago",
    text: "Fecha Pago",
    sort: true
  },
  {
    dataField: "nota",
    text: "Nota",
    sort: true
  },
  {
    dataField: "pago",
    text: "Pago",
    sort: true,
    formatter: booleanFormatter
  },
  {
    dataField: "mora",
    text: "Mora",
    sort: true,
    formatter: priceFormatter
  },
  {
    dataField: "fechaVencimiento",
    text: "Fecha Vencimiento",
    sort: true
  }
];

function RenderVales({items, persona, isLoading, errMess, postPago, postVale}) {
  const [showOptions, setShowOptions] = useState(false);
  const [row, setRow] = useState(0);
  const [showPago, setShowPago] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [_id, set_id] = useState(0);
  const [showVales, setShowVales] = useState(false);

  function handleShowVales(breakpoint) {
  setFullscreen(breakpoint);
  setShowVales(true);
  }
  const handleCloseVales = () => setShowVales(false);
  const handleSubmitVales = (values) => {
    setShowVales(false);
    postVale(persona._id, values);
  }

  function handleShowPago(breakpoint) {
  setShowPago(true);
  }

  const handleClosePago = () => setShowPago(false);
  const handleCloseOptions = () => setShowOptions(false);
  const handleShow = () => setShowOptions(true);

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      console.log(row);
      setShowOptions(true);
      setRow(row);
      set_id(row._id);
    }
  }

  const rowEventsPagos = {
    onClick: (e, row, rowIndex) => {
      console.log(row);
      setRow(row);
      handleShowPago();
      handleCloseOptions();
    }
  }

  const handleSubmitPago = (values) => {
    setShowPago(false);
    console.log(row);
    let pago = {
      entrega: values.entrega,
      importe:  row.importe,
      nota: values.nota,
      _id: row._id
    }
  //  console.log(pago)
    postPago(_id, pago);
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
      let pagos = row.pagos;
      console.log(pagos)
      if(!pagos){
        pagos = items;
      }
      return(
        <div>
        <BootstrapTable
        bootstrap4
        keyField="id"
        data={items}
        columns={columns}
        filter= { filterFactory() }
        rowEvents= { rowEvents }
        rowStyle={ rowDebe }
        pagination={paginationFactory({ sizePerPage: 10 })}
      />

      <Modal show={showOptions} onHide={handleCloseOptions} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Pagos a realizar</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <BootstrapTable
          bootstrap4
          keyField="id"
          data={pagos}
          columns={columnsPagos}
          filter= { filterFactory() }
          rowEvents= { rowEventsPagos }
          pagination={paginationFactory({ sizePerPage: 10 })}
        />
        </Modal.Body>
      </Modal>

      <Modal show={showPago} fullscreen={fullscreen} onHide={() => setShowPago(false)}>
        <Modal.Header closeButton>
          <Modal.Title>HACER UN PAGO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LocalForm onSubmit={(values) => handleSubmitPago(values)}>
          <Label htmlfor="entrega" md={2}> Entrega </Label>
          <Col md={10}>
            <Control.textarea model=".entrega" id="entrega" name="entrega"
                  rows="1"
                  className="form-control"
                  />
          </Col>
          <Label htmlfor="nota" md={2}> Nota </Label>
          <Col md={10}>
            <Control.textarea model=".nota" id="nota" name="nota"
                  rows="1"
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
                  <Label htmlFor="cantidadCuotas" md={1}>Cantidad de Cuotas</Label>
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

      <div class="gap-2">
          <Button  color="success" size="lg" onClick={handleShowVales}>
            Agregar vale
          </Button>


        <Link to={`/home`}>
          <Button className="m-3" color="primary" size="lg">
            Atras
          </Button>
        </Link>
      </div>
        </div>
      );}

}

function Vales(props) {
    return(
        <div className="container">
            <div className="row align-items-start">
                <div className="col-12 col-md m-1">
                <h1>Vales de: {props.persona.nombres} {props.persona.apellidos}</h1>
                    <RenderVales items={props.vales}
                    persona={props.persona}
                    errMess={props.valesErrMess}
                    postPago={props.postPago}
                    postVale={props.postVale}
                    />
                </div>
            </div>
        </div>
    );
}

export default Vales;
