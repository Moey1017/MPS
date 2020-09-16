import * as React from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';
import * as CarStore from '../../../reduxStore/car';
import * as Store from '../../../reduxStore/store';
import { LoadingScreen } from '../../others/Screens';
import { MpsHeader } from '../../others/MpsHeader';

type carProps = CarStore.CarState
    & Store.StoreState
    & typeof CarStore.actionCreators
    & typeof Store.actionCreators
    & RouteComponentProps<{ car_reg: string }>;

class RetrieveConfirmation extends React.Component<carProps, any>
{
    componentDidMount() {
        this.props.fetchCar(this.props.match.params.car_reg);
    }

    // on submmit, create outbound order
    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        this.props.createOutbound(this.props.match.params.car_reg);
    }

    handleOk = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (this.props.signalR_connection) {
            this.props.signalR_connection.send("ConfirmCarExited");
            this.props.retrieveCar(this.props.car.registration);
        } else {
            alert("Server is not connected.");
        }
        //this.props.retrieveCar(this.props.car.registration);
    }

    render() {

        let screen;
        if (this.props.isLoading === true)
            screen = <LoadingScreen />

        if (this.props.outbound_order !== null) {
            if (this.props.outbound_order.status === 'ACCEPTED') {
                // Ok screen, when ok is presssed, retrieve sucess and return to main page 
                screen = <div id="popup1" className="overlay">
                    <div className="popup">
                        <h2>Only press Ok when the car has been completed retrieved. Have a nice day!</h2>
                        <div className="content">
                            <Button onClick={this.handleOk}>OK</Button>
                        </div>
                    </div>
                </div>
            }
        }

        return (
            <div className="mpsContainer">
                <MpsHeader />
                {screen}

                <div className="central_container retrieve_confirmation">

                    <div>

                        <div className="text-center">
                            <h1>Retrieve Vehicle</h1>
                        </div>

                        <div className="row justify-content-center">

                            <Form>
                                <FormGroup>
                                    <Label className="d-block">Car Registration</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car registration" name="registration" value={this.props.match.params.car_reg} disabled></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Make</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter make" name="make" value={this.props.car.make} disabled></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Model</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car model" name="model" value={this.props.car.model} disabled></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Colour</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car colour" name="colour" value={this.props.car.colour} disabled></Input>
                                </FormGroup>

                                <div className="button_section">
                                    <Link className="btn btn-danger mr-5 cus_form_btn" to='/retrieve-vehicle'>
                                        Back
                        </Link>

                                    <Button className="btn btn-success cus_form_btn" type="submit" onClick={this.handleSubmit}>
                                        Confirm Retrieve
                        </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.cars,
        ...state.store
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