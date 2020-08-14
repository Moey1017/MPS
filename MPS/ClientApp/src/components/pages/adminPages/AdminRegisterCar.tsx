import * as React from 'react';
import { Link } from 'react-router-dom';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import * as DriverStore from '../../../reduxStore/driver';
import * as CarStore from '../../../reduxStore/car';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reduxStore/index';
import { MpsHeader } from '../../others/MpsHeader';


// At runtime, Redux will merge together..., merge everything into this.props
type CarPropsAndDriverState =
    CarStore.CarState // ... state we've requested from the Redux store
    & DriverStore.DriverState
    & typeof CarStore.actionCreators // ... plus action creators we've requested
    & typeof DriverStore.actionCreators;

class AdminRegisterCar extends React.Component<CarPropsAndDriverState, any>
{
    constructor(props: any) {
        super(props);

        this.state = {
            registration: '',
            driver: '',
            make: '',
            model: '',
            colour: '',
            drivers: [],
            //driverNameList:[]
        }
    }

    componentDidMount() {

        setTimeout(() => {
            this.ensureDataFetched();
            //this.getDriverNameList();
        }, 200)

    }

    private ensureDataFetched() {
        //if (this.props.drivers.length === 0 || this.props.drivers.length === undefined) { // check if drivers have been loaded into redux store
        //    this.props.requestDriverList();
        //    this.setState({
        //        drivers: this.props.drivers,
        //        isLoading: false
        //    })
        //}
    }

    // this is not working bcuz it doenst know what is this.props.drivers 
    //private getDriverNameList() {
    //    this.setState({
    //        // driverNameList: this.props.drivers.map(d => { return d.driverName })
    //        drivers: this.props.drivers
    //    })
    //}

    private createDropDown() {
        return (
            <DropDownListComponent id="ddlelement" dataSource={this.state.drivers} placeholder="Select a driver" />
        );
    }

    handleChange = (e: { target: { name: any; value: any; }; }) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const carObj = {
            registration: this.state.registration,
            make: this.state.make,
            model: this.state.model,
            colour: this.state.colour
            //driver: this.state.driver,
        };

        // Calling action cretor to insert a driver object here  
        this.props.insertCar(carObj);
    }


    render() {
        if (this.state.isLoading) {
            return (<span>Loading</span>);
        }
        else {
            return (
                <div className="mpsContainer">
                    <MpsHeader />

                    <div className="central_container">

                        <div className="text-center">
                            <h1 className="display-1">Register Car</h1>
                        </div>

                        <div className="row justify-content-center">

                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label className="d-block">Select A Driver</Label>
                                    {/*this.createDropDown()*/}
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Registration</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car registration" name="registration" value={this.state.registration} onChange={this.handleChange}></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Make</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter make" name="make" value={this.state.make} onChange={this.handleChange}></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Model</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car model" name="model" value={this.state.model} onChange={this.handleChange}></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="d-block">Car Colour</Label>
                                    <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car colour" name="colour" value={this.state.colour} onChange={this.handleChange}></Input>
                                </FormGroup>

                                <Link className="btn btn-danger cus_btn mr-5" to='/admin-options'>
                                    Back
                        </Link>

                                <Button className="btn  btn-success cus_btn" type="submit" onClick={this.handleSubmit}>
                                    Register
                        </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        carProps: state.cars,
        driverProps: state.drivers
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        { ...CarStore.actionCreators, ...DriverStore.actionCreators, },
        dispatch
    )
}

export default connect(
    //(state: ApplicationState) => ({ cars:state.cars }),
    mapStateToProps,
    mapDispatchToProps
)(AdminRegisterCar as any);