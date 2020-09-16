import * as React from 'react';
import { Link } from 'react-router-dom';
import { MpsHeader } from '../../others/MpsHeader';
import * as Admin from '../../../reduxStore/admin';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';
import { bindActionCreators } from 'redux';
import { Button, Form } from 'reactstrap';

type AdminProps = Admin.AdminState
    & typeof Admin.actionCreators;


class AdminLogin extends React.Component<AdminProps, any>
{
    constructor(props: AdminProps) {
        super(props);

        this.state = {
            login_id: 'admin',
            password: 'Password1$' //Password1$
        }
    }

    handleChange = (e: any) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formInputState = this.validate();
        if (Object.keys(formInputState).every(index => formInputState[index])) { // check while submitting the form
            this.props.adminLogin(this.state.login_id, this.state.password);
        } else { // invalid inputs in form
            alert('Form Criteria has not been met!');
            return;
        }
    }

    //Validate each section/condition 
    validateLoginId() {
        return this.state.login_id.length >= 2;
    }

    validatePassword() {
        return this.state.password.length >= 6;
    }

    //Validate all the conditions
    validate() {
        const login_id = this.state.login_id;
        const password = this.state.password;
        return {
            login_id: this.validateLoginId(),
            password: this.validatePassword()
        };
    }

    render() {
        return (
            <div className="mpsContainer">
                <MpsHeader />
                <div className="central_container">

                    <Form>
                        <div className="text-center">
                            <h1>Admin Login</h1>
                        </div>

                        <h1 className="d-block">Username </h1>
                        <input className="d-block mb-3 cus-input" placeholder="Enter username" name="login_id" value={this.state.login_id} onChange={this.handleChange}>
                        </input>

                        <h1 className="d-block">Password </h1>
                        <input type="password" className="d-block mb-3 cus-input" placeholder="Enter password" name="password" value={this.state.password} onChange={this.handleChange}>
                        </input>

                        <div className="form_btn_small">
                            <Link className="btn btn-danger cus-btn mr-5" to='/'>
                                Back
                        </Link>

                            <Button className="btn btn-success cus-btn p-0" onClick={this.handleSubmit}>
                                Login
                        </Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.admin
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        { ...Admin.actionCreators },
        dispatch
    )
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminLogin as any);

