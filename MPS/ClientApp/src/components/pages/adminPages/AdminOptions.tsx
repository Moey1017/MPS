import * as React from 'react';
import { Link } from 'react-router-dom';


export default class AdminOptions extends React.Component<{}>
{
    render() {
        return (
                <div className="container mh-100 b-banner-image">


                <Link className="btn btn-danger cus-btn cus-margin-options" to='/admin-login'>
                    Back
                </Link>

                <h1 className="display-1 p-center-options">Choose option</h1>

                <div className="row fixed-bottom justify-content-center cus-margin-l">

                    <form>

                        <Link className="btn btn-primary cus-btn mr-5" to='/admin-view-drivers'>
                            View Drivers
                        </Link>

                        <Link className="btn btn-primary cus-btn mr-5" to='/admin-view-cars'>
                            View Cars
                        </Link>

                        <br />

                        <Link className="btn btn-primary cus-btn mr-5 mt-3" to='/admin-register-driver'>
                            Register Driver
                        </Link>

                        <Link className="btn btn-primary cus-btn mr-5 mt-3" to='/admin-register-car'>
                            Register Car
                        </Link>

                    </form>

                </div>
            </div>
        );
    }
}

