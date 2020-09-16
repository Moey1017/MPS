import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FormGroup, Form, Label, Input, FormText, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as Store from '../../../reduxStore/store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reduxStore/index';
import { MpsHeader } from '../../others/MpsHeader';
import * as AdminStore from '../../../reduxStore/admin';
import { NoPermission } from '../../others/Screens';

// At runtime, Redux will merge together..., merge everything into this.props
type Props =
    & Store.StoreState // ... state we've requested from the Redux store
    & AdminStore.AdminState
    & typeof Store.actionCreators // ... plus action creators we've requested
    & typeof AdminStore.actionCreators;

class AdminViewStore extends React.Component<Props, any>
{
    constructor(props: any) {
        super(props);

        this.state = {
            infoModal: false,
            pallet_id: "",
            car_reg: ""
        }

        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.ensureDataFetched();
    }

    ensureDataFetched() {
        this.props.requestStoreState();
    }

    toggle = (e: any) => {
        e.preventDefault();
        this.setState({ infoModal: !this.state.infoModal })
    }

    validatePalletId() {
        return this.state.pallet_id >= 1;
    }

    validate() {
        const pallet_id = this.state.pallet_id;
        return {
            pallet_id: this.validatePalletId()
        }
    }

    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formInputState = this.validate();
        if (Object.keys(formInputState).every(index => formInputState[index])) { // check while submitting the form
            this.setState({ infoModal: false });
            const pallet: Store.Pallet = {
                pallet_id: this.state.pallet_id,
                car_reg: this.state.car_reg
            };
            if (this.state.car_reg.length === 0) {
                pallet.car_reg = null;
            }
            this.props.registerPallet(pallet);
            this.setState({
                pallet_id: "",
                car_reg: ""
            });
        } else {
            alert('Form Criteria has not been met!');
            return;
        }
        
    }

    handleChange = (e: { target: { name: any; value: any; }; }) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        if (this.props.login_id) {
            return (
                <div className="mpsContainer">
                    <MpsHeader />

                    <Link className="btn btn-danger cus_btn" to='/admin-options'>
                        Back
                    </Link>

                    <div>
                        <Modal isOpen={this.state.infoModal} toggle={this.toggle}>
                            <ModalHeader toggle={this.toggle}>Register Pallet</ModalHeader>
                            <ModalBody>
                                <Form id="pallet_form" onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Label className="d-block">Pallet ID</Label>
                                        <Input className="d-block mb-3 cus-input-driver" placeholder="Enter pallet Id" name="pallet_id" value={this.state.pallet_id || ""} onChange={this.handleChange}></Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label className="d-block">Car Registration</Label>
                                        <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car registration" name="car_reg" value={this.state.car_reg || ""} onChange={this.handleChange}></Input>
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" type="submit" form="pallet_form">Register Pallet</Button>
                            </ModalFooter>
                        </Modal>
                    </div>


                    <div className="central_container table_container">

                        <div className="text-center">
                            <h1 className="m-0">Pallets</h1>
                        </div>

                        <div className="row justify-content-center p-3 w-100 overflow-auto scrolling_table">
                            <Table id="DT_load" className="table table-striped table-bordered cus_tb">
                                <thead>
                                    <tr>
                                        <th>Pallet Id</th>
                                        <th>Car Registration</th>
                                        <th>
                                            <Button className="btn btn-secondary btn-sm text-white full_width_btn" onClick={this.toggle}>Add</Button>
                                        </th>
                                    </tr>
                                    {this.props.pallets.map((pallet: Store.Pallet) =>
                                        <tr key={pallet.pallet_id}>
                                            <td>{pallet.pallet_id}</td>
                                            <td>{pallet.car_reg ? pallet.car_reg : "N/A"}</td>
                                            <td className="single_button_panel">
                                                <Button className="btn btn-danger btn-sm full_width_btn" onClick={() => { this.props.removePallet(pallet.pallet_id) }}>
                                                    Delete
                                        </Button>
                                            </td>
                                        </tr>
                                    )}
                                </thead>
                            </Table>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (<NoPermission />);
        }

    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.store,
        ...state.admin
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        {
            ...Store.actionCreators,
            ...AdminStore.actionCreators
        },
        dispatch
    )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminViewStore as any);