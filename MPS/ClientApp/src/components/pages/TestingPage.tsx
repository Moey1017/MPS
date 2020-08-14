import { useEffect, useState, FC } from 'react';
import * as React from 'react';
import { Props } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../../reduxStore/index';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';
import * as CarStore from '../../reduxStore/car';
import * as Store from '../../reduxStore/store';
import { LoadingScreen } from '../others/Screens';
import { MpsHeader } from '../others/MpsHeader';
import {
    HubConnectionBuilder,
    HubConnectionState,
    HubConnection,
} from '@aspnet/signalr';
import * as SignalR from '@aspnet/signalr';

type storeProps = CarStore.CarState
    & Store.StoreState
    & typeof CarStore.actionCreators
    & typeof Store.actionCreators
    & any;
const TestingPage2: FC<storeProps> = (props) => {

    const [registration, setRegistration] = useState("");
    const [scan, setScan] = useState("");
    const [connection, setConnection] = useState();

    // on submmit, create outbound order
    const addInbound = (e: any) => {
        e.preventDefault();
        console.log(registration);
        //this.props.createInbound(this.state.registration);
    }

    const scanLicencePlate = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log(scan);
    }

    const confirm = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        alert("Confirm");

    }

    useEffect(() => {
        //set up SignalR Connection
        const setUpSignalRConnection = async () => {
            const hubConnection = new HubConnectionBuilder()
                .withUrl('https://192.168.20.216:5001/socket/control-system',
                    { skipNegotiation: true, transport: SignalR.HttpTransportType.WebSockets }) 
                .withAutomaticReconnect()
                .build();

            // Starts the SignalR connection
            hubConnection.start().then(a => {
                // Once started, invokes the functions
                if (hubConnection.connectionId) {
                    console.log(hubConnection.connectionId);
                    //hubConnection.invoke("ScanLicensePlate", scan);
                }
            }).catch(error => { console.log('Error while establishing connection :('); });
        }

        setUpSignalRConnection();
    });



    return (
        <div className="mpsContainer">
            <MpsHeader />

            <Link className="btn btn-danger position-absolute cus_btn" to='/'>
                Back
                </Link>

            <div className="text-center">
                <h1 className="display-1">Testing Form</h1>
            </div>


            <div className="d-flex flex-column align-items-center">
                <Form onSubmit={addInbound}>

                    <FormGroup>
                        <Label className="d-block">Licence plate</Label>
                        <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car registration" name="registration" value={registration} onChange={(e) => { setRegistration(e.target.value); }}></Input>
                    </FormGroup>

                    <Button className="btn btn-success cus_btn-ls" type="submit">
                        Add Licence plate
                        </Button>
                </Form>

                <div className="p-5 testing_section2">
                    <Form onSubmit={scanLicencePlate}>

                        <FormGroup>
                            <Label className="d-block">Scan Car Registration</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Scan car registration" name="scan" value={scan} onChange={(e) => { setScan(e.target.value); }}></Input>
                        </FormGroup>

                        <Button className="btn btn-success cus_btn-ls" type="submit">
                            Scan
                        </Button>
                    </Form>

                    <Button className="mt-2 btn btn-success cus_btn-ls" type="submit" onClick={confirm}>
                        Confirm
                        </Button>
                </div>
            </div>
        </div>
    );
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
    mapDispatchToProps,
)(TestingPage2);