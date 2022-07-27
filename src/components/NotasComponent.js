import React, {useState} from 'react';
import { Table, Button } from 'reactstrap';
import { Loading } from './LoadingComponent';
//import {baseUrl} from '../shared/baseUrl';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
import Modal from 'react-bootstrap/Modal';
import {Link} from 'react-router-dom';
import { Label, Col, Row } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';



const columns = [
  {
    dataField: "fecha",
    text: "Fecha",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "nota",
    text: "Detalle",
    sort: true,
    filter: textFilter()
  }
];


function RenderNotas({items, persona, isLoading, errMess, removeNota, postNota}) {
  const [showOptions, setShowOptions] = useState(false);
  const [_id, set_id] = useState(0);
  const [showNotas, setShowNotas] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  function handleShowNotas(breakpoint) {
  setFullscreen(breakpoint);
  setShowNotas(true);
  }

  const handleCloseNotas = () => setShowNotas(false);

  const handleSubmitNota = (values) => {
    setShowNotas(false);
    postNota(persona._id, values.nota);
  }

  const handleCloseOptions = () => setShowOptions(false);
  const handleShow = () => setShowOptions(true);

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      console.log(row);
      setShowOptions(true);
      set_id(row._id);
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
        <BootstrapTable
        bootstrap4
        keyField="id"
        data={items}
        columns={columns}
        filter= { filterFactory() }
        rowEvents= { rowEvents }
        pagination={paginationFactory({ sizePerPage: 5 })}
      />

      <Modal show={showOptions} onHide={handleCloseOptions} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Que accion desea realizar ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {console.log("_id: ",_id)}
            <Button className="m-1" color="danger" onClick={() => removeNota(persona._id, _id)}>
              Remover Nota
            </Button>
          </Modal.Body>
      </Modal>

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

      <div class="gap-2">
          <Button  color="success" size="lg" onClick={handleShowNotas}>
            Agregar nota
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

function Notas(props) {
    return(
        <div className="container">
            <div className="row align-items-start">
                <div className="col-12 col-md m-1">
                <h1>Notas de: {props.persona.nombres} {props.persona.apellidos}</h1>
                    <RenderNotas items={props.notas}
                    persona={props.persona}
                    errMess={props.notasErrMess}
                    removeNota={props.removeNota}
                    postNota={props.postNota}
                    />
                </div>
            </div>
        </div>
    );
}

export default Notas;
