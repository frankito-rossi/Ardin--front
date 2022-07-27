import React, {useState} from 'react';
import { Table, Button } from 'reactstrap';
import { Loading } from './LoadingComponent';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
import Modal from 'react-bootstrap/Modal';
import {Link} from 'react-router-dom';
import { Label, Col, Row } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';

const columns = [
  {
    dataField: "personaNombres",
    text: "Nombres",
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
    dataField: "nota",
    text: "Detalle",
    sort: true,
    filter: textFilter()
  },
  {
    dataField: "fecha",
    text: "Fecha",
    sort: true,
    filter: textFilter()
  },
];


function RenderNotas({notas, personas, isLoading, errMess, removeNota, postNota}) {
  const [showOptions, setShowOptions] = useState(false);
  const [_id, set_id] = useState(0);
  const [persona, setPersona] = useState(0);

  const handleCloseOptions = () => setShowOptions(false);
  const handleShow = () => setShowOptions(true);

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      console.log(row);
      setShowOptions(true);
      set_id(row._id);
      setPersona(row.persona);
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

      notas.map((nota) => {
        personas.map((persona) => {
          if( persona._id === nota.persona)
          {  nota.personaNombres = persona.nombres;
            nota.personaApellidos = persona.apellidos;}
        })
      })

      return(
        <div>
        <BootstrapTable
        bootstrap4
        keyField="id"
        data={notas}
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
            <Button className="m-1" color="danger" onClick={() => removeNota(persona, _id)}>
              Remover Nota
            </Button>
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

function VerNotas(props) {
    return(
        <div className="container">
            <div className="row align-items-start">
                <div className="col-12 col-md m-1">
                <h1>Notas</h1>
                    <RenderNotas notas={props.notas}
                    personas={props.personas}
                    errMess={props.notasErrMess}
                    removeNota={props.removeNota}
                    postNota={props.postNota}
                    />
                </div>
            </div>
        </div>
    );
}

export default VerNotas;
