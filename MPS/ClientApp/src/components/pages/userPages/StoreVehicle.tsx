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
import {
    HubConnectionBuilder,
    HubConnectionState,
    HubConnection,
} from '@aspnet/signalr';

type storeProps = CarStore.CarState
    & Store.StoreState
    & typeof CarStore.actionCreators
    & typeof Store.actionCreators
    & any;
class StoreConfirmation extends React.Component<storeProps, any>
{
    constructor(props: any) {
        super(props);

        this.state = {
            registration: ""
        }
    }

    componentWillMount() {
        this.props.checkIfStoreHasSpace();
    }

    //set up SignalR Connection
    //setUpSignalRConnection = async () => {
    //    const connection = new HubConnectionBuilder()
    //        .withUrl('http://localhost:5001/storeHub')
    //        .withAutomaticReconnect()
    //        .build();
    //}



    handleChange = (e: any) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // on submmit, create outbound order
    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        this.props.createInbound(this.state.registration);
        //this.props.storeCar(this.state.registration);
        // pass in car to be stored here
    }


    // display current car 
    // confirm and agree 
    render() {
        let storeButton;
        if (this.props.storeProps.hasSpace) {
            storeButton = <Button className="btn  btn-success cus-btn" type="submit" onClick={this.handleSubmit}>
                Scan Car Reg
                        </Button>;
        }
        else {
            storeButton = <Button className="btn  btn-success cus-btn" type="submit" onClick={this.handleSubmit} disabled>
                Scan Car Reg
                        </Button>;
        }

        let loadingScreen;
        if (this.props.storeProps.isLoading === true) {
            loadingScreen = <LoadingScreen />
        }

        return (
            <div className="container mh-100 b-banner-image">

                {loadingScreen}

                <Link className="btn btn-danger cus-btn mt-5 float-right" to='/'>
                    Back
                </Link>

                <h1 className="display-1 p-center-car">Is this your Car?</h1>
                <h1 className="display-1 p-center-car">Scan Car Registration</h1>

                <div className="row fixed-bottom justify-content-center cus-margin-l">
                    <Form onSubmit={this.handleSubmit}>

                        <FormGroup>
                            <Label className="d-block">Car Registration</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car registration" name="registration" value={this.state.registration} onChange={this.handleChange}></Input>
                        </FormGroup>

                        { /*
                        <FormGroup>
                            <Label className="d-block">Car Make</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter make" name="make" value={this.props.carProps.car.make} disabled></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label className="d-block">Car Model</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car model" name="model" value={this.props.carProps.car.model} disabled></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label className="d-block">Car Colour</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car colour" name="colour" value={this.props.carProps.car.colour} disabled></Input>
                        </FormGroup>

                        <Link className="btn btn-danger cus-btn mr-5" to='/'>
                            Back
                        </Link>
                        */}

                        {storeButton}
                    </Form>

                </div>
            </div>
        );
    }

}

function mapStateToProps(state: ApplicationState) {
    return {
        storeProps: state.store
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        { ...Store.actionCreators },
        dispatch
    )
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StoreConfirmation as any);