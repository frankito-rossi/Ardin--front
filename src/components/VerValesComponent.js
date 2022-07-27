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
    dataField: "personaNombres",
    text: "Nombre",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "personaApellidos",
    text: "Apellidos",
    sort: true,
    filter: textFilter()
  },
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
    dataField: "proximoVencimiento",
    text: "Proximo Vencimiento",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "detalle",
    text: "Detalle",
    sort: true,
    filter: textFilter()
  },
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

function RenderVales({vales, personas, isLoading, errMess, postPago, postVale}) {
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
//    postVale(persona._id, values);
  }

  function handleShowPago(breakpoint) {
  setShowPago(true);
  }

  const handleClosePago = () => setShowPago(false);
  const handleCloseOptions = () => setShowOptions(false);
  const handleShow = () => setShowOptions(true);

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      setShowOptions(true);
      setRow(row);
      set_id(row._id);
    }
  }

  const rowEventsPagos = {
    onClick: (e, row, rowIndex) => {
      setRow(row);
      handleShowPago();
      handleCloseOptions();
    }
  }

  const expandRow = {
  renderer: row => (
    <div>
      <p>Telefono: {row.personaTelefono}</p>
      <p>Direccion: {row.personaDireccion}</p>
      <p>Localidad: {row.personaLocalidad}</p>
    </div>
  ),
  showExpandColumn: true
};

  const handleSubmitPago = (values) => {
    setShowPago(false);
    let pago = {
      entrega: values.entrega,
      importe:  row.importe,
      nota: values.nota,
      _id: row._id
    }
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
      if(!pagos){
        pagos = vales;
      }
      vales.map((vale) => {
        personas.personas.map((persona) => {
          if( persona._id === vale.persona)
          {  vale.personaNombres = persona.nombres;
            vale.personaApellidos = persona.apellidos;
            vale.personaTelefono = persona.telefono;
            vale.personaDireccion = persona.direccion;
            vale.personaLocalidad = persona.localidad;
          }
        })
        let proxVenc = vale.pagos.filter((pago) => !pago.pago)[0];
        if(proxVenc){
          vale.proximoVencimiento = vale.pagos.filter((pago) => !pago.pago)[0].fechaVencimiento;
        }
      })

      return(
        <div>

        <BootstrapTable
        bootstrap4
        keyField="id"
        data={vales}
        columns={columns}
        filter= { filterFactory() }
        rowEvents= { rowEvents }
        rowStyle={ rowDebe }
        expandRow={ expandRow }
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
          rowStyle={ rowDebe }
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

      <div class="gap-2">
        <Link to={`/home`}>
          <Button color="primary" size="lg">
            Atras
          </Button>
        </Link>
      </div>
        </div>
      );}

}

function VerVales(props) {
    return(
        <div className="container">
            <div className="row align-items-start">
                <div className="col-12 col-md m-1">
                <h1>Vales</h1>
                    <RenderVales vales={props.vales}
                    personas={props.personas}
                    errMess={props.valesErrMess}
                    postPago={props.postPago}
                    postVale={props.postVale}
                    />
                </div>
            </div>
        </div>
    );
}

export default VerVales;
