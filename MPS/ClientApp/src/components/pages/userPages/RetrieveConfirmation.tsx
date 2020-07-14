import * as React from 'react';
import { Link } from 'react-router-dom';
import * as CarStore from '../../../reduxStore/car';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';
import { RouteComponentProps } from 'react-router';

type carProps = CarStore.CarState
    & typeof CarStore.actionCreators
    & RouteComponentProps<{ car_reg: string }>;

class RetrieveConfirmation extends React.Component<carProps>
{
    componentDidMount() {
        this.props.fetchCar(this.props.match.params.car_reg);// fetch car is working 
        console.log(this.props.car);
    }

    componentDidUpdate() {
        console.log(this.props.car); 
        console.log(this.props);
        
    }



    // on submmit, create outbound order

    // display current car 
    // confirm and agree 
    render() {
        return (
            <div>Hello</div>
        );
    }

}



export default connect(
    (state: ApplicationState) => state.cars,
    CarStore.actionCreators
)(RetrieveConfirmation as any);