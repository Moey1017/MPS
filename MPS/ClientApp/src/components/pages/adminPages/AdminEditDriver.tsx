import * as React from 'react';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import * as DriverStore from '../../../reduxStore/driver';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';
import { MpsHeader } from '../../others/MpsHeader';
import { NoPermission } from '../../others/Screens';
import { bindActionCreators } from 'redux';
import * as AdminStore from '../../../reduxStore/admin';

// At runtime, Redux will merge together..., merge everything into this.props
type DriverAndAdminProps =
    DriverStore.DriverState // ... state we've requested from the Redux store
    & AdminStore.AdminState
    & typeof DriverStore.actionCreators // ... plus action creators we've requested
    & typeof AdminStore.actionCreators
    & RouteComponentProps<{ id: string }>; // ... plus incoming routing parameters

class AdminEditDriver extends React.Component<DriverAndAdminProps, any>
{
    constructor(props: any) {
        super(props);
        // later when register and udpate page are combined together into one page
        this.state = {
            driId: this.props.driver ? this.props.driver.driver_id : -1,
            driName: this.props.driver ? this.props.driver.name : '',
            driEmail: this.props.driver ? this.props.driver.email : '',
            driTelNo: this.props.driver ? this.props.driver.tel_no : ''
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.fetchDriver(parseInt(this.props.match.params.id));
            this.setState({
                driId: this.props.driver.driver_id,
                driName: this.props.driver.name,
                driEmail: this.props.driver.email,
                driTelNo: this.props.driver.tel_no
            })
        }, 500)
    }

    // States update late, need this to update component 
    componentDidUpdate(prevProps: any) {
        if (this.props.driver !== prevProps.driver) {
            this.setState({
                driId: this.props.driver.driver_id,
                driName: this.props.driver.name,
                driEmail: this.props.driver.email,
                driTelNo: this.props.driver.tel_no
            })
        }
    }

    handleChange = (e: any) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        const formInputState = this.validate();
        if (Object.keys(formInputState).every(index => formInputState[index])) { // check while submitting the form
            const driverObj = {
                driver_id: this.state.driId,
                name: this.state.driName,
                email: this.state.driEmail,
                tel_no: this.state.driTelNo
            };
            // pass in driver object here 
            this.props.updateDriver(driverObj);
        } else { // invalid inputs in form
            alert('Form Criteria has not been met!');
            return;
        }
    }

    validateName() {
        return this.state.driName.length >= 3;
    }

    validateTel() {
        return this.state.driTelNo.length >= 3;
    }

    validate() {
        const name = this.state.driName;
        const tel_no = this.state.driTelNo;
        return {
            name: this.validateName(),
            tel_no: this.validateTel()
        };
    }

    render() {
        if (this.props.login_id) {
            return (
                <div className="mpsContainer">
                    <MpsHeader />
                    <div className="central_container ">

                        <div className="text-center">
                            <h1>Update Driver</h1>
                        </div>

                        <div className="row justify-content-center">

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

                                <Link className="btn btn-danger mr-5 cus_form_btn" to='/admin-view-drivers'>
                                    Back
                            </Link>

                                {/*Link className="btn  btn-success cus-btn" onClick={this.handleOpenModal} to='#'>*/}
                                <Button className="btn btn-success cus_form_btn" type="submit">
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
)(AdminEditDriver as any);

