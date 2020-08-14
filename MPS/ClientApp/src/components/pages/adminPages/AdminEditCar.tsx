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

// At runtime, Redux will merge together..., merge everything into this.props
type CarPropsAndDriverState =
    CarStore.CarState // ... state we've requested from the Redux store
    & DriverStore.DriverState
    & typeof CarStore.actionCreators // ... plus action creators we've requested
    & typeof DriverStore.actionCreators
    & RouteComponentProps<{ carReg: string }>
    & any; // ... plus incoming routing parameters

class AdminEditCar extends React.Component<CarPropsAndDriverState, any>
{
    constructor(props: any) {
        super(props);

        this.state = {
            registration: '',
            driver: '',
            make: '',
            model: '',
            colour: '',
            driverNameList:[]
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.ensureDataFetched();
        }, 200)
    }

    //getting all necessary data 
    private ensureDataFetched() {
        this.props.fetchCar(this.props.carReg);
        this.setState({
            registration: this.props.carProps['car'].registration,
            make: this.props.carProps['car'].make,
            model: this.props.carProps['car'].model,
            colour: this.props.carProps['car'].colour
        })
        //if (this.state.driverNameList.length === 0) { // check if drivers have been loaded into redux store
        //    this.props.requestDriverList();
        //}
        //this.getDriverNameList();
    }

    // get all drivers'name into an array 
    //private getDriverNameList() {
    //    this.setState({
    //        driverNameList: this.props.drivers.map(d => { return d.name })
    //    })
    //}

    //private createDropDown() {
    //    return (
    //        <DropDownListComponent id="ddlelement" dataSource={this.state.driverNameList} placeholder="Select a driver" />
    //    );
    //}

    // States update late, need this to update component 
    componentDidUpdate(prevProps: any) {
        if (this.props.carProps !== prevProps.carProps) {
            this.setState({
                registration: this.props.carProps['car'].registration,
                make: this.props.carProps['car'].make,
                model: this.props.carProps['car'].model,
                colour: this.props.carProps['car'].colour
            })
        }
    }

    handleChange = (e: { target: { name: any; value: any; }; }) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const newCarObj = {
            registration: this.state.registration,
            make: this.state.make,
            model: this.state.model,
            colour: this.state.colour
            //driver: this.state.driver,
        };
        this.props.updateCar(newCarObj);
    }


    render() {
        return (
            <div className="mpsContainer">
                <MpsHeader />
                <div className="central_container ">
                    <div className="text-center">
                        <h1 className="display-1">Update Car</h1>
                    </div>

                <div className="row justify-content-center">

                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label className="d-block">Select A Driver</Label>
                            {/*this.createDropDown()*/}
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

                        <Link className="btn btn-danger cus_btn mr-5" to='/admin-view-cars'>
                            Back
                        </Link>

                        <Button className="btn btn-success cus_btn" type="submit" onClick={this.handleSubmit}>
                            Update
                        </Button>

                    </Form>
                        </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: ApplicationState, ownProps: CarPropsAndDriverState) {
    return {
        carProps: state.cars, 
        driverProps: state.drivers,
        carReg: ownProps.match.params.id
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
)(AdminEditCar as any);
