import { useEffect, useState, FC } from 'react';
import * as React from 'react';
import { Props } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../../reduxStore/index';
import { bindActionCreators } from 'redux';
import * as Store from '../../reduxStore/store';
import { MpsHeader } from '../others/MpsHeader';
import {
    HubConnectionBuilder,
    HubConnectionState,
    HubConnection,
} from '@aspnet/signalr';

type storeProps = Store.StoreState & typeof Store.actionCreators;
const TestingPage2: FC<storeProps> = (props) => {

    const [registration, setRegistration] = useState("");
    const [scan, setScan] = useState("");
    const [retrieve, setRetrieve] = useState("");
    const [hubConnection, setHubConnection] = useState<HubConnection>();

    const setUpSignalRConnection = async () => {
        //set up SignalR Connection
        const connection = new HubConnectionBuilder()
            .withUrl('https://192.168.20.216:5006/socket/control-system')
            .withAutomaticReconnect()
            .build();

        //hubConnection.on('', (message) => {});

        // Starts the SignalR connection
        connection.start().then(() => {
            if (connection.connectionId) {
                console.log("Connection has been set up, ID:" + connection.connectionId)
            }
        }).catch(error => { console.log('Error while establishing connection :('); });

        setHubConnection(connection);
    }

    useEffect(() => {
        setUpSignalRConnection();
    }, []);

    // on submit, create outbound order
    const createInbound = (e: any) => {
        e.preventDefault();
        props.createInbound(registration, false);
        setScan("");
    }

    // on submit, scan licence plate and open the barrier 
    const scanLicencePlate = (e: any) => {
        e.preventDefault();
        if (hubConnection) {
            hubConnection.send("ScanLicensePlate", scan);
            console.log("send");
            //hubConnection.invoke("ScanLicensePlate", scan);
        } else {
            alert("Server is not Connected");
        }
    }

    // on submit, close the barrier
    const confirm = (e: any) => {
        e.preventDefault();
        if (hubConnection) {
            hubConnection.send("ConfirmCarOnInput", scan);
        } else {
            alert("Server is not Connected");
        }
        setRegistration("");
    }

    const createOutbound = (e: any) => {
        e.preventDefault();
        props.createOutbound2(retrieve);
        setRetrieve(""); 
    }

    const confirmExit = (e: any) => {
        e.preventDefault();
        if (hubConnection) {
            hubConnection.send("ConfirmCarExited");
        } else {
            alert("Server is not Connected");
        }
    }

    return (
        <div className="mpsContainer">
            <MpsHeader />

            <Link className="btn btn-danger position-absolute cus_btn" to='/'>
                Back
                </Link>

            <div className="central_container">

                <div className="text-center">
                    <h1 className="display-1">Testing Form</h1>
                </div>

                <div className="d-flex">

                    <div className="d-flex flex-column align-items-center">
                        <Form>
                            <FormGroup>
                                <Label className="d-block">Licence plate</Label>
                                <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car registration" name="registration" value={registration} onChange={(e) => { setRegistration(e.target.value); }}></Input>
                            </FormGroup>

                            <Button className="btn btn-success cus_btn-ls" type="submit" onClick={createInbound}>
                                Add Licence plate
                        </Button>
                        </Form>

                        <div className="p-3 testing_section2">
                            <Form>

                                <FormGroup>
                                    <Label className="d-block">Scan Car Registration</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Scan car registration" name="scan" value={scan} onChange={(e) => { setScan(e.target.value); }}></Input>
                                </FormGroup>

                                <Button className="btn btn-success cus_btn-ls" type="submit" onClick={scanLicencePlate}>
                                    Scan
                        </Button>
                            </Form>

                            <Button className="mt-2 btn btn-success cus_btn-ls" type="submit" onClick={confirm}>
                                Confirm
                        </Button>
                        </div>
                    </div>

                    <div >
                        <Form className="d-flex flex-column align-items-center">
                            <FormGroup>
                                <Label className="d-block">Exit Panel</Label>
                                <Input className="d-block mb-3 cus-input-driver" placeholder="Scan car registration" name="scan" value={retrieve} onChange={(e) => { setRetrieve(e.target.value); }}></Input>
                            </FormGroup>

                            <Button className="btn btn-success cus_btn-ls" type="submit" onClick={createOutbound}>
                                Request
                        </Button>

                            <Button className="mt-2 btn btn-success cus_btn-ls" type="submit" onClick={confirmExit}>
                                Confirm Exited
                        </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
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
    mapDispatchToProps,
)(TestingPage2);