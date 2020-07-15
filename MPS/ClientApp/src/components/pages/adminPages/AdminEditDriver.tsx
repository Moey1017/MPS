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
        // later when register and udpate page are combined together into one page
        this.state = {
            driId: this.props.driver ? this.props.driver.driverId : -1,
            driName: this.props.driver ? this.props.driver.name : '',
            driEmail: this.props.driver ? this.props.driver.email : '',
            driTelNo: this.props.driver ? this.props.driver.telNo : ''
        };
    }

    componentDidMount() {    
         setTimeout(() => {
             this.props.fetchDriver(parseInt(this.props.match.params.id));
             this.setState({
                 driId: this.props.driver.driverId,
                 driName: this.props.driver.name,
                 driEmail: this.props.driver.email,
                 driTelNo: this.props.driver.telNo
             })
         }, 500)
    }

    // States update late, need this to update component 
    componentDidUpdate(prevProps:any) {
        if (this.props.driver !== prevProps.driver) {
            this.setState({
                driId: this.props.driver.driverId,
                driName: this.props.driver.name,
                driEmail: this.props.driver.email,
                driTelNo: this.props.driver.telNo
            })
        }
    }

    handleChange = (e: any) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        const driverObj = {
            driverId: this.state.driId,
            name: this.state.driName,
            email: this.state.driEmail,
            telNo: this.state.driTelNo
        };

        // pass in driver object here 
        this.props.updateDriver(driverObj);
    }

    render() {
            return (
                <div className="container mh-100 b-banner-image">
                    <h1 className="display-1 p-center-driver">Edit Driver</h1>

                    <div className="row fixed-bottom justify-content-center cus-margin-l">

                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label className="d-block">Name</Label>
                                <Input className="d-block mb-3 cus-input-driver" placeholder="Enter name" name="driName" value={this.state.driName} onChange={this.handleChange}></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label className="d-block">Email</Label>
                                <Input className="d-block mb-3 cus-input-driver" placeholder="Enter email" name="driEmail" value={this.state.driEmail} onChange={this.handleChange}></Input>
                            </FormGroup>

                            <FormGroup>
                                <Label className="d-block">Mobile Number</Label>
                                <Input className="d-block mb-3 cus-input-driver" placeholder="Enter Mobile number" name="driTelNo" value={this.state.driTelNo} onChange={this.handleChange}></Input>
                            </FormGroup>

                            <Link className="btn btn-danger cus-btn mr-5" to='/admin-view-drivers'>
                                Back
                            </Link>

                            {/*Link className="btn  btn-success cus-btn" onClick={this.handleOpenModal} to='#'>*/}
                            <Button className="btn  btn-success cus-btn" type="submit">
                                Update
                            </Button>

                        </Form>
                    </div>
                </div>
            );
    }
}

export default connect(
    (state: ApplicationState) => state.drivers,
    DriverStore.actionCreators
)(AdminEditDriver);

