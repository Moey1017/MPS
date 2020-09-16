import * as React from 'react';
import { Link } from 'react-router-dom';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import * as DriverStore from '../../../reduxStore/driver';
import * as CarStore from '../../../reduxStore/car';
import { ApplicationState } from '../../../reduxStore/index';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';
import { MpsHeader } from '../../others/MpsHeader';
import { NoPermission } from '../../others/Screens';
import * as AdminStore from '../../../reduxStore/admin';

// At runtime, Redux will merge together..., merge everything into this.props
type CarPropsAndDriverState =
    CarStore.CarState // ... state we've requested from the Redux store
    & DriverStore.DriverState
    & AdminStore.AdminState
    & typeof AdminStore.actionCreators
    & typeof CarStore.actionCreators // ... plus action creators we've requested
    & typeof DriverStore.actionCreators
    & RouteComponentProps<{ car_reg: string }>; // ... plus incoming routing parameters

class AdminEditCar extends React.Component<CarPropsAndDriverState, any>
{
    constructor(props: any) {
        super(props);

        this.state = {
            registration: '',
            driver_id: -1,
            make: '',
            model: '',
            colour: ''
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.ensureDataFetched();
        }, 200)
    }

    //getting all necessary data 
    private ensureDataFetched() {
        if (this.props.drivers.length === 0) {
            this.props.requestDriverList();
        }
        this.props.fetchCar(this.props.match.params.car_reg);

        if (this.props.car.driver_id === null) {
            this.setState({
                driver_id: -1
            })
        }
        else {
            this.setState({
                driver_id: this.props.car.driver_id
            })
        }
        this.setState({
            registration: this.props.car.registration,
            make: this.props.car.make,
            model: this.props.car.model,
            colour: this.props.car.colour
        })
    }

    // States update late, need this to update component 
    componentDidUpdate(prevProps: any) {
        if (this.props.car !== prevProps.car) {
            if (this.props.car.driver_id === null) {
                this.setState({
                    driver_id: -1
                })
            }
            else {
                this.setState({
                    driver_id: this.props.car.driver_id
                })
            }
            this.setState({
                registration: this.props.car.registration,
                make: this.props.car.make,
                model: this.props.car.model,
                colour: this.props.car.colour
            })
        }
    }

    handleChange = (e: { target: { name: any; value: any; }; }) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    validateRegistration() {
        return this.state.registration.length >= 3;
    }

    validate() {
        const registration = this.state.registration;
        return {
            registration: this.validateRegistration()
        };
    }

    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formInputState = this.validate();
        if (Object.keys(formInputState).every(index => formInputState[index])) { // check while submitting the form
            const carObj = {
                registration: this.state.registration,
                make: this.state.make,
                model: this.state.model,
                colour: this.state.colour,
                driver_id: this.state.driver_id
            };
            if (this.state.driver_id == -1) {
                carObj.driver_id = null;
            } else {
                carObj.driver_id = parseInt(carObj.driver_id);
            }
            this.props.updateCar(carObj);
        } else { // invalid inputs in form
            alert('Form Criteria has not been met!');
            return;
        }        
    }


    render() {
        if (this.props.login_id) {
            return (
                <div className="mpsContainer">
                    <MpsHeader />
                    <div className="central_container ">
                        <div className="text-center">
                            <h1>Update Car</h1>
                        </div>

                        <div className="row justify-content-center">

                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label className="d-block">Select A Driver</Label>
                                    <select className="d-block mb-3 cus-input-driver" value={this.state.driver_id} name="driver_id" onChange={this.handleChange}>
                                        <option value="-1">None</option>
                                        {this.props.drivers.map(d => { return <option key={d.driver_id} value={d.driver_id}>{d.driver_id} - {d.name}</option> })}
                                    </select>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Registration</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car registration" name="registration" value={this.state.registration || ""} onChange={this.handleChange} disabled></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Make</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter make" name="make" value={this.state.make || ""} onChange={this.handleChange}></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Model</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car model" name="model" value={this.state.model || ""} onChange={this.handleChange}></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Colour</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car colour" name="colour" value={this.state.colour || ""} onChange={this.handleChange}></Input>
                                </FormGroup>

                                <Link className="btn btn-danger mr-5 cus_form_btn" to='/admin-view-cars'>
                                    Back
                        </Link>

                                <Button className="btn btn-success cus_form_btn" type="submit" onClick={this.handleSubmit}>
                                    Update
                        </Button>

                            </Form>
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
        ...state.cars,
        ...state.drivers,
        ...state.admin
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        { ...CarStore.actionCreators, ...DriverStore.actionCreators, ...AdminStore.actionCreators },
        dispatch
    )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminEditCar as any);
