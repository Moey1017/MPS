import * as React from 'react';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import * as Reactstrap from 'react-bootstrap';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import * as DriverStore from '../../../reduxStore/driver';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';

// At runtime, Redux will merge together..., merge everything into this.props
type DriverProps =
    DriverStore.DriverState // ... state we've requested from the Redux store
    & typeof DriverStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ id: string }>; // ... plus incoming routing parameters

class AdminEditDriver extends React.Component<DriverProps, any>
{
    constructor(props: any) {
        super(props);
        this.state = {
            driId: this.props.driver ? this.props.driver.driverId : -1,
            driName: this.props.driver ? this.props.driver.name : '',
            driEmail: this.props.driver ? this.props.driver.email : '',
            driTelNo: this.props.driver ? this.props.driver.telNo : ''
        };

        //this.handleOpenModal = this.handleOpenModal.bind(this);
        //this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentDidMount() {      
        this.props.fetchDriver(parseInt(this.props.match.params.id));
        console.log(this.state);
        console.log(this.props.driver);
    }

    componentWillReceiveProps = (nextProps: any) => {
        console.log("WIll Receive? ");
        console.log(nextProps.driver[0]);
        console.log(this.props.driver);
        //this.setState({
        //    driId: nextProps.driver.driverId,
        //    driName: nextProps.driver.name,
        //    driEmail: nextProps.driver.email,
        //    driTelNo: nextProps.driver.telNo,
        //})
        console.log(this.state);
    }

    handleChange = (e: any) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
        console.log(this.props);
    }

    //handleChange = (e: { target: { name: any; value: any; }; }) => {
    //    this.setState({ [e.target.name]: e.target.value });
    //    console.log(this.state);
    //    console.log(this.props.driver);
    //}

    handleSubmit = (e: any) => {
        e.preventDefault();
        const driverObj = {
            driverId: this.state.driverId,
            name: this.state.name,
            email: this.state.email,
            telNo: this.state.telNo
        };

        // pass in driver object here 
        this.props.updateDriver(driverObj);
    }

    //handleOpenModal() {
    //    this.setState({ showModal: true });
    //}

    //handleCloseModal() {
    //    this.setState({ showModal: false });
    //}

    //showModalBox() {
    //    var toReturn = []
    //    //Need to change the onClick for Link
    //    if (this.state.showModal) {
    //        toReturn.push(
    //            <Reactstrap.Modal.Dialog key="1" className="cus-margin-modal-driver">
    //                <Reactstrap.Modal.Header className="shadow notice" closeButton onClick={this.handleCloseModal}>
    //                    <h1 className="cus-notice-title" >NOTICE</h1>
    //                </Reactstrap.Modal.Header>
    //                <Reactstrap.Modal.Body >
    //                    <h1 className="cus-process">Would you like to add driver?</h1>
    //                </Reactstrap.Modal.Body>

    //                <Reactstrap.Modal.Footer>
    //                    <Link className="btn btn-success" onClick={this.handleCloseModal} to='/admin-options'>Continue</Link>
    //                </Reactstrap.Modal.Footer>
    //            </Reactstrap.Modal.Dialog>
    //        )
    //    }
    //    return toReturn
    //}
    render() {
            return (
                <div className="container mh-100 b-banner-image">
                    <h1 className="display-1 p-center-driver">Register Driver</h1>

                    <div className="row fixed-bottom justify-content-center cus-margin-l">

                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label className="d-block">Name</Label>
                                <Input className="d-block mb-3 cus-input-driver" placeholder="Enter name" name="driName" value={this.state.driName || ''} onChange={this.handleChange}></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label className="d-block">Email</Label>
                                <Input className="d-block mb-3 cus-input-driver" placeholder="Enter email" name="driEmail" value={this.state.driEmail || ''} onChange={this.handleChange}></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label className="d-block">Mobile Number</Label>
                                <Input className="d-block mb-3 cus-input-driver" placeholder="Enter Mobile number" name="driTelNo" value={this.state.driTelNo || ''} onChange={this.handleChange}></Input>
                            </FormGroup>

                            <Link className="btn btn-danger cus-btn mr-5" to='/admin-options'>
                                Back
                            </Link>

                            {/*Link className="btn  btn-success cus-btn" onClick={this.handleOpenModal} to='#'>*/}
                            <Button className="btn  btn-success cus-btn" type="submit">
                                Register
                            </Button>

                        </Form>
                        {/* {this.showModalBox()}  */}
                    </div>
                </div>
            );
    }
}

export default connect(
    (state: ApplicationState) => state.drivers,
    DriverStore.actionCreators
)(AdminEditDriver);

