import * as React from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';
import * as CarStore from '../../../reduxStore/car';
import * as Store from '../../../reduxStore/store';

type carProps = CarStore.CarState
    & Store.StoreState
    & typeof CarStore.actionCreators
    & typeof Store.actionCreators
    & RouteComponentProps<{ car_reg: string }> // maybe
    & any;

class RetrieveConfirmation extends React.Component<carProps>
{
    componentDidMount() {
        this.props.fetchCar(this.props.match.params.car_reg);
    }

    // on submmit, create outbound order
    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        this.props.retrieveCar(this.props.carsProps.car.registration);
    }

    // display current car 
    // confirm and agree 
    render() {
        return (
            <div className="container mh-100 b-banner-image">
                <h1 className="display-1 p-center-car">Retrieve Car</h1>

                <div className="row fixed-bottom justify-content-center cus-margin-l">

                    <Form onSubmit={this.handleSubmit}>

                        <FormGroup>
                            <Label className="d-block">Car Registration</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car registration" name="registration" value={this.props.carsProps.car.registration} disabled></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label className="d-block">Car Make</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter make" name="make" value={this.props.carsProps.car.make} disabled></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label className="d-block">Car Model</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car model" name="model" value={this.props.carsProps.car.model} disabled></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label className="d-block">Car Colour</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car colour" name="colour" value={this.props.carsProps.car.colour} disabled></Input>
                        </FormGroup>

                        <Link className="btn btn-danger cus-btn mr-5" to='/retrieve-vehicle'>
                            Back
                        </Link>

                        <Button className="btn  btn-success cus-btn" type="submit" onClick={this.handleSubmit}>
                            Confirm Retrieve
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state: ApplicationState) {
    return {
        carsProps: state.cars,
        storeProps: state.store
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        { ...CarStore.actionCreators, ...Store.actionCreators },
        dispatch
    )
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RetrieveConfirmation as any);


//export default connect(
//    (state: ApplicationState) => { return (state.cars, state.store); },
//    mapDispatchToProps
//)(RetrieveConfirmation as any);