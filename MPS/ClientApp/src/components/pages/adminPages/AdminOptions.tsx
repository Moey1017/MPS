import * as React from 'react';
import { Link } from 'react-router-dom';
import { MpsHeader } from '../../others/MpsHeader';
import { NoPermission } from '../../others/Screens';
import { Button } from 'reactstrap';
import * as Admin from '../../../reduxStore/admin';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';
import { bindActionCreators } from 'redux';
const admin = require('../../../assets/admin.png');
const driver = require('../../../assets/driver2.png');
const plus_car = require('../../../assets/plus_car.png');
const car = require('../../../assets/car2.png');
const plus_driver = require('../../../assets/plus_driver.png')
const car_pallets = require('../../../assets/car_pallets.png');
//https://image.flaticon.com/icons/png/512/290/290131.png

type AdminProps = Admin.AdminState
    & typeof Admin.actionCreators;

class AdminOptions extends React.Component<AdminProps>
{
    constructor(props: AdminProps) {
        super(props);
    }

    handleSubmit = () => {
        this.props.logout();
    }

    render() {
        if (this.props.login_id) {
            return (
                <div className="mpsContainer">
                    <MpsHeader />

                    <Button className="btn btn-danger cus_btn" onClick={this.handleSubmit}>
                        Log Out
                </Button>

                    <div className="row flex-column text-center admin_option">
                        <div className="image_options">

                            <Link className="icon_option" to='/admin-view-drivers'>
                                <img src={driver} alt="Driver Table"></img>
                            </Link>

                            <Link className="icon_option" to='/admin-view-cars'>
                                <img src={car} alt="Car Table"></img>
                        </Link>

                            <Link className="icon_option" to='/admin-view-histories'>
                                <img src={admin} alt="Admin"></img>
                        </Link>
                        </div>

                        <div className="image_options">
                            <Link className="icon_option" to='/admin-register-driver'>
                                <img src={plus_driver} alt="Register Driver"></img>
                        </Link>

                            <Link className="icon_option" to='/admin-register-car'>
                                <img src={plus_car} alt="Register Car"></img>
                        </Link>

                            <Link className="icon_option" to='/admin-view-store'>
                                <img src={car_pallets} alt="Car Pallets"></img>
                        </Link>
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
)(AdminOptions as any);

