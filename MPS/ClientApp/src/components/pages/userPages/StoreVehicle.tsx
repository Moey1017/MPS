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
import {
    HubConnectionBuilder,
    HubConnectionState,
    HubConnection,
} from '@aspnet/signalr';

type storeProps = CarStore.CarState
    & Store.StoreState
    & typeof CarStore.actionCreators
    & typeof Store.actionCreators;
class StoreConfirmation extends React.Component<storeProps, any>
{
    constructor(props: any) {
        super(props);

        this.state = {
            registration: ""
        }
    }

    componentDidMount() {
        this.props.checkIfStoreHasSpace();
    }

    handleChange = (e: any) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // on submmit, create inbound order
    handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await this.props.createInbound(this.state.registration, true);
        setTimeout(() => {
            if (this.props.signalR_connection) {
                this.props.signalR_connection.send("ScanLicensePlate", this.state.registration);
            } else {
                alert("Server is not connected.");
            }
        }, 1000)
    }


    // display current car 
    // confirm and agree 
    render() {
        let storeButton;
        if (this.props.hasSpace) {
            storeButton = <Button className="btn  btn-success cus_btn-ls" type="submit" onClick={this.handleSubmit}>
                Scan
                        </Button>;
        }
        else {
            storeButton = <Button className="btn  btn-success cus_btn-ls" type="submit" onClick={this.handleSubmit} disabled>
                Scan
                        </Button>;
        }

        let loadingScreen;
        if (this.props.isLoading === true) {
            loadingScreen = <LoadingScreen />
        }

        return (
            <div className="mpsContainer">
                <MpsHeader />

                {loadingScreen}

                <div className="d-flex justify-content-between">
                    <Link className="btn btn-danger cus_btn" to='/'>
                        Back
                </Link>

                    <Button className="btn btn-success cus_btn" onClick={this.handleSubmit} disabled>
                        Next
                </Button>
                </div>

                <div className="text-center">
                    <h1 className="display-1">Car Registration</h1>
                    <h1>Is this your Car?</h1>
                </div>


                <div className="row justify-content-center mb-5 bottom_section">
                    <Form onSubmit={this.handleSubmit}>

                        <FormGroup>
                            <Label className="d-block">Car Registration</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car registration" name="registration" value={this.state.registration} onChange={this.handleChange}></Input>
                        </FormGroup>

                        { /*
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
        ...state.store
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