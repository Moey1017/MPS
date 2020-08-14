import * as React from 'react';
import { Link } from 'react-router-dom';
import { MpsHeader } from '../../others/MpsHeader';


export default class AdminOptions extends React.Component<{}>
{
    render() {
        return (
            <div className="mpsContainer">
                <MpsHeader />

                <Link className="btn btn-danger cus_btn" to='/admin-login'>
                    Back
                </Link>

                <div className="central_container admin_option">

                    <div className="text-center">
                        <h1 className="display-1">Choose Options</h1>
                    </div>

                    <div className="row flex-column">

                        <div className="button_section1">

                            <Link className="btn btn-primary cus-btn" to='/admin-view-drivers'>
                                View Drivers
                        </Link>

                            <Link className="btn btn-primary cus-btn" to='/admin-view-cars'>
                                View Cars
                        </Link>

                        </div>

                        <div className="button_section2">
                            <Link className="btn btn-primary cus-btn" to='/admin-register-driver'>
                                Register Driver
                        </Link>

                            <Link className="btn btn-primary cus-btn" to='/admin-register-car'>
                                Register Car
                        </Link>
                        </div>

                    </div>
                </div>


            </div>
        );
    }
}

