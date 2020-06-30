import * as React from 'react';
import { Link } from 'react-router-dom';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import * as DriverStore from '../../../reduxStore/driver';
import * as CarStore from '../../../reduxStore/car';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reduxStore/index';


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
            isLoading: false
            //driverNameList:[]
        }
    }

    componentDidMount() {
        
        setTimeout(() => {
            this.setState({ isLoading: true })
            this.ensureCarDataFetched();
            //this.getDriverNameList();
            this.setState({isLoading:false})
        }, 200)
        
    }

    private ensureCarDataFetched() {
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
            driver: this.state.driver,
            make: this.state.make,
            model: this.state.model,
            colour: this.state.colour
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
                <div className="container mh-100 b-banner-image">
                    <h1 className="display-1 p-center-car">Register Car</h1>

                    <div className="row fixed-bottom justify-content-center cus-margin-l">

                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label className="d-block">Select A Driver</Label>
                                {this.createDropDown()}
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
                                <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car model" name="make" value={this.state.model} onChange={this.handleChange}></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label className="d-block">Car Colour</Label>
                                <Input className="d-block mb-3 cus-input-driver" placeholder="Enter car colour" name="make" value={this.state.colour} onChange={this.handleChange}></Input>
                            </FormGroup>

                            <Link className="btn btn-danger cus-btn mr-5" to='/admin-options'>
                                Back
                        </Link>

                            {/*Link className="btn  btn-success cus-btn" onClick={this.handleOpenModal} to='#'>*/}
                            <Button className="btn  btn-success cus-btn" type="submit" onClick={this.handleSubmit}>
                                Register
                        </Button>
                        </Form>
                    </div>
                </div>
            );
        }
    }
}


function mapStateToProps(state : any) {
    return {
        
        //drivers: state.drivers,
        cars: state.cars
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        { ...DriverStore.actionCreators, ...CarStore.actionCreators },
        dispatch
    )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminRegisterCar);