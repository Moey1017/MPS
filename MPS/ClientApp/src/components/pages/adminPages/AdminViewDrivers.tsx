﻿import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as DriverStore from '../../../reduxStore/driver';
import { ApplicationState } from '../../../reduxStore/index';
import { Button, Table } from 'reactstrap';
import { MpsHeader } from '../../others/MpsHeader';
import { NoPermission } from '../../others/Screens';
import * as AdminStore from '../../../reduxStore/admin';
import { bindActionCreators } from 'redux';

// At runtime, Redux will merge together..., merge everything into this.props
type DriverProps =
    DriverStore.DriverState // ... state we've requested from the Redux store
    & AdminStore.AdminState
    & typeof AdminStore.actionCreators
    & typeof DriverStore.actionCreators; // ... plus action creators we've requested

class AdminViewDrivers extends React.PureComponent<DriverProps>
{
    public componentDidMount() {
        this.ensureDataFetched();
    }

    // getting all data here
    private ensureDataFetched() {
        this.props.requestDriverList();
    }

    render() {
        if (this.props.login_id) {
            return (
                <div className="mpsContainer">
                    <MpsHeader />
                    <Link className="btn btn-danger cus_btn" to='/admin-options'>
                        Back
                </Link>

                    <div className="central_container table_container">

                        <div className="text-center">
                            <h1 className="m-0">Drivers</h1>
                        </div>

                        <div className="row justify-content-center p-3 w-100 overflow-auto scrolling_table">
                            {this.props.isLoading && <span>Loading...</span>}
                            <Table id="DT_load" className="table table-striped table-bordered cus_tb">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Tel No</th>
                                        <th></th>
                                    </tr>
                                    {this.props.drivers.map((driver: DriverStore.Driver) =>
                                        <tr key={driver.driver_id}>
                                            <td>{driver.driver_id}</td>
                                            <td>{driver.name}</td>
                                            <td>{driver.email}</td>
                                            <td>{driver.tel_no}</td>
                                            <td className="table_panel">
                                                <Link className="btn btn-success btn-sm text-white" to={"/admin-edit-driver/" + driver.driver_id}>
                                                    Edit
                                        </Link>
                                                <Button className="btn btn-danger btn-sm" onClick={() => this.props.deleteDriver(driver.driver_id)}>
                                                    Delete
                                        </Button>
                                            </td>
                                        </tr>
                                    )}
                                </thead>
                            </Table>
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
        { ...DriverStore.actionCreators, ...AdminStore.actionCreators },
        dispatch
    )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminViewDrivers as any);
