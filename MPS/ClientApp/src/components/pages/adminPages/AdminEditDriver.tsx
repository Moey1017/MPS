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
            driverId: null,
            driverName: '',
            email: '',
            tellNo: ''
        };

        //this.handleOpenModal = this.handleOpenModal.bind(this);
        //this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentDidMount() {      
        setTimeout(() => {
            this.props.fetchDriver(parseInt(this.props.match.params.id)); // fetch data 
            this.setState({ // set states 
                driverId: this.props.driver.driverId,
                driverName: this.props.driver.driverName,
                email: this.props.driver.email,
                tellNo: this.props.driver.tellNo
            })
        }, 200);
    }

    handleChange = (e: { target: { name: any; value: any; }; }) => {
        this.setState({ [e.target.name]: e.target.value })
        console.log(this.state);
    }

    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const driverObj = {
            driverId: this.state.driverId,
            driverName: this.state.driverName,
            email: this.state.email,
            tellNo: this.state.tellNo
        };

        // pass in driver object here 
        this.props.updateDriver(driverObj);
        //TODO: Redirct is needed
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
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter name" name="driverName" value={this.state.driverName} onChange={this.handleChange}></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label className="d-block">Email</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter email" name="email" value={this.state.email} onChange={this.handleChange}></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label className="d-block">Mobile Number</Label>
                            <Input className="d-block mb-3 cus-input-driver" placeholder="Enter Mobile number" name="tellNo" value={this.state.tellNo} onChange={this.handleChange}></Input>
                        </FormGroup>

                        <Link className="btn btn-danger cus-btn mr-5" to='/admin-options'>
                            Back
                        </Link>

                        {/*Link className="btn  btn-success cus-btn" onClick={this.handleOpenModal} to='#'>*/}
                        <Button className="btn  btn-success cus-btn" type="submit" onClick={this.handleSubmit}>
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

