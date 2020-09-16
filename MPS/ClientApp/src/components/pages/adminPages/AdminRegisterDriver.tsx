import * as React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import * as Reactstrap from 'react-bootstrap';
import * as DriverStore from '../../../reduxStore/driver';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import { MpsHeader } from '../../others/MpsHeader';
import { NoPermission } from '../../others/Screens';
import { bindActionCreators } from 'redux';
import * as AdminStore from '../../../reduxStore/admin';

// At runtime, Redux will merge together..., merge everything into this.props
type DriverProps =
    DriverStore.DriverState // ... state we've requested from the Redux store
    & AdminStore.AdminState
    & typeof AdminStore.actionCreators
    & typeof DriverStore.actionCreators; // ... plus action creators we've requested

class AdminRegisterDriver extends React.Component<DriverProps, any> // first Param is Props, second Param is State
{
    constructor(props: any) {
        super(props);
        this.state = {
            name: '',
            email: '',
            telNo: ''
        };

        //this.handleOpenModal = this.handleOpenModal.bind(this);
        //this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleChange = (e: { target: { name: any; value: any; }; }) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    validateName() {
        return this.state.name.length >= 3;
    }

    validateTel() {
        return this.state.telNo.length >= 3;
    }

    validate() {
        const name = this.state.name;
        const tel_no = this.state.telNo;
        return {
            name: this.validateName(),
            telNo: this.validateTel()
        };
    }

    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formInputState = this.validate();
        if (Object.keys(formInputState).every(index => formInputState[index])) { // check while submitting the form
            const driverObj = {
                driver_id: 0,
                name: this.state.name,
                email: this.state.email,
                tel_no: this.state.telNo
            };
            // pass in driver object here 
            this.props.insertDriver(driverObj);
        } else { // invalid inputs in form
            alert('Form Criteria has not been met!');
            return;
        }
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
        if (this.props.login_id) {
            return (
                <div className="mpsContainer">
                    <MpsHeader />
                    <div className="central_container ">

                        <div className="text-center">
                            <h1>Register Driver</h1>
                        </div>


                        <div className="row justify-content-center">

                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label className="d-block">Name</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter name" name="name" value={this.state.name} onChange={this.handleChange}></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Email</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter email" name="email" value={this.state.email} onChange={this.handleChange}></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Mobile Number</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter Mobile number" name="telNo" value={this.state.telNo} onChange={this.handleChange}></Input>
                                </FormGroup>

                                <div className="form_btn_small">

                                    <Link className="btn btn-danger mr-5 cus_form_btn" to='/admin-options'>
                                        Back
                        </Link>

                                    {/*Link className="btn  btn-success cus-btn" onClick={this.handleOpenModal} to='#'>*/}
                                    <Button className="btn  btn-success cus_form_btn" type="submit" onClick={this.handleSubmit}>
                                        Register
                        </Button>

                                </div>

                            </Form>
                            {/* {this.showModalBox()}  */}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<NoPermission />);
        }

    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.drivers,
        ...state.admin
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        {
            ...AdminStore.actionCreators,
            ...DriverStore.actionCreators
        },
        dispatch
    )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminRegisterDriver as any);