import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as DriverStore from '../../../reduxStore/driver';
import { ApplicationState } from '../../../reduxStore/index';
import { Button } from 'reactstrap';

// At runtime, Redux will merge together..., merge everything into this.props
type DriverProps =
    DriverStore.DriverState // ... state we've requested from the Redux store
    & typeof DriverStore.actionCreators; // ... plus action creators we've requested

class AdminViewDrivers extends React.PureComponent<DriverProps>
{
    public componentDidMount() {
        this.ensureDataFetched();
        console.log(this.props);
    }

    // getting all data here
    private ensureDataFetched() {
        this.props.requestDriverList();
    }

    render() {
        return (
            <div className="container mh-100 p-3 b-banner-image">
                <Link className="btn btn-danger cus-btn cus-margin-options" to='/admin-options'>
                    Back
                </Link>
                {this.props.isLoading && <span>Loading...</span>}
                <div className="col-12 border p-3 .w-100" >
                    <table id="DT_load" className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Tel No</th>
                                <th></th>
                            </tr>
                            {this.props.drivers.map((driver: DriverStore.Driver) =>
                                <tr key={driver.driverId}>
                                    <td>{driver.driverId}</td>
                                    <td>{driver.name}</td>
                                    <td>{driver.email}</td>
                                    <td>{driver.telNo}</td>   
                                    <td>
                                        <Link className="btn btn-success btn-sm text-white" to={"/admin-edit-driver/" + driver.driverId}>
                                            Edit
                                        </Link>
                                        <Button className="btn btn-danger btn-sm" onClick={() => this.props.deleteDriver(driver.driverId)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        </thead>
                    </table>
                </div>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.drivers,
    DriverStore.actionCreators
)(AdminViewDrivers as any);