import * as React from 'react';
import { Link } from 'react-router-dom';
import { MpsHeader } from '../../others/MpsHeader';

export default class AdminLogin extends React.Component<{}>
{
    render() {
        return (
            <div className="mpsContainer">
                <MpsHeader />
                <div className="central_container">

                    <form>
                        <h1 className="display-1 p-center">Login</h1>

                        <h1 className="d-block">Username </h1>
                        <input className="d-block mb-3 cus-input" placeholder="Enter username">
                        </input>

                        <h1 className="d-block">Password </h1>
                        <input type="password" className="d-block mb-3 cus-input" placeholder="Enter password">
                        </input>


                        <Link className="btn btn-danger cus-btn mr-5" to='/'>
                            Back
                        </Link>

                        <Link className="btn  btn-success cus-btn" to='/admin-options'>
                            Login
                        </Link>

                    </form>

                </div>
            </div>
        );
    }
}
