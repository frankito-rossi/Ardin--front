import { Component } from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { fetchPersonas, fetchNotas, fetchVales, postNota, removeNota, postPersona, postVale, postPago } from '../redux/ActionCreators';
import Home from './HomeComponent';
import Notas from './NotasComponent';
import Vales from './ValesComponent';
import VerVales from './VerValesComponent';
import VerNotas from './VerNotasComponent';

const mapStateToProps = state => {
    return {
        personas: state.personas,
        notas: state.notas,
        vales: state.vales
    }
}

const mapDispatchToProps = dispatch => ({
      fetchPersonas: () => {dispatch(fetchPersonas())},
      fetchNotas: () => {dispatch(fetchNotas())},
      fetchVales: () => {dispatch(fetchVales())},
      postNota: (personaId, nota) => dispatch(postNota(personaId, nota)),
      removeNota: (personaId, notaId) => dispatch(removeNota(personaId, notaId)),
      postPersona: (persona) => dispatch(postPersona(persona)),
      postVale: (personaId, vale) => dispatch(postVale(personaId, vale)),
      postPago: (pagoId, entrega) => dispatch(postPago(pagoId, entrega))
  });

function esMenorFechas(f1, f2){
  const [dayf1, monthf1, yearf1] = f1.split('/');
  const [dayf2, monthf2, yearf2] = f2.split('/');
  if(yearf1 < yearf2) {
    return true;
  }
  if((yearf1 <= yearf2) && (monthf1 < monthf2)) {
    return true;
  }
  if((yearf1 <= yearf2) && (monthf1 <= monthf2) && (dayf1 < dayf2 )) {
    return true;
  }
  return false;
}

class Main extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    this.props.fetchPersonas();
    this.props.fetchNotas();
    this.props.fetchVales();
  }

  render() {
    this.props.vales.vales.map((vale) => {
      vale.pagos.map((pago) => {

        const [day, month, year] = pago.fechaVencimiento.split('/');
        var date1 = new Date(year, month, day);
        var date2 = new Date();
        var difference = date1.getTime() - date2.getTime();
        var days = Math.ceil(difference / (1000 * 3600 * 24));

        if(!pago.pago && (days < 0)) {
          pago.debe = true;
          vale.debe = true;
          if(days < -10){
            pago.mora = ((pago.importe*vale.interes / 100 ) * ((days*-1) - 10))
          }
          this.props.personas.personas.map((persona) => {
            if(vale.persona == persona._id)
              persona.debe = true;
          })
        }
      })
    })
    const HomePage = () => {
      return(
        <Home
            personas={this.props.personas.personas}
            personasLoading={this.props.personas.isLoading}
            personasErrMess={this.props.personas.errMess}
            notas={this.props.notas.notas}
            notasLoading={this.props.notas.isLoading}
            notasErrMess={this.props.notas.errMess}
            vales={this.props.vales.vales}
            valeLoading={this.props.vales.isLoading}
            valeErrMess={this.props.vales.errMess}
            postNota={this.props.postNota}
            postPersona={this.props.postPersona}
            postVale={this.props.postVale}
        />
      );
    }

    const NotasWithId = ({match}) => {
      return(
        <Notas persona={this.props.personas.personas.filter((persona) => persona._id === match.params._id)[0]}
          isLoading={this.props.personas.isLoading}
          ErrMess={this.props.personas.errMess}
          notas={this.props.notas.notas.filter((nota) => nota.persona === match.params._id)}
          notasErrMess={this.props.notas.errMess}
          postNota={this.props.postNota}
          removeNota={this.props.removeNota}
          />
      );
    }

    const ValesWithId = ({match}) => {
      return(
        <Vales persona={this.props.personas.personas.filter((persona) => persona._id === match.params._id)[0]}
          isLoading={this.props.personas.isLoading}
          ErrMess={this.props.personas.errMess}
          vales={this.props.vales.vales.filter((vale) => vale.persona === match.params._id)}
          valesErrMess={this.props.vales.errMess}
          postPago={this.props.postPago}
          postVale={this.props.postVale}
          />
      );
    }

    const ValesPage = () => {
      return(
        <VerVales
          isLoading={this.props.personas.isLoading}
          ErrMess={this.props.personas.errMess}
          vales={this.props.vales.vales}
          personas={this.props.personas}
          valesErrMess={this.props.vales.errMess}
          postPago={this.props.postPago}
          />
      );
    }

    const NotasPage = () => {
      return(
        <VerNotas personas={this.props.personas.personas}
                  isLoading={this.props.personas.isLoading}
                  ErrMess={this.props.personas.errMess}
                  notas={this.props.notas.notas}
                  notasErrMess={this.props.notas.errMess}
                  removeNota={this.props.removeNota}
                  />
      );
    }

      return(
        <div>
          <Switch>
            <Route path="/home" component={HomePage} />
            <Route exact path="/notas" component={NotasPage} />
            <Route path="/notas/:_id" component={NotasWithId} />
            <Route exact path="/vales" component={ValesPage} />
            <Route path="/vales/:_id" component={ValesWithId} />
            <Redirect to="/home" />
          </Switch>
        </div>
      );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
