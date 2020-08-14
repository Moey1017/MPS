import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as CarStore from '../../../reduxStore/car';
import { ApplicationState } from '../../../reduxStore/index';
import { Button, Table } from 'reactstrap';
import { MpsHeader } from '../../others/MpsHeader';

// At runtime, Redux will merge together..., merge everything into this.props
type CarProps =
    CarStore.CarState // ... state we've requested from the Redux store
    & typeof CarStore.actionCreators; // ... plus action creators we've requested

class AdminViewCars extends React.PureComponent<CarProps>
{
    public componentDidMount() {
        this.ensureCarDataFetched();
    }

    // getting all data here
    private ensureCarDataFetched() {
        this.props.requestCarList();
    }

    render() {
        return (
            <div className="mpsContainer">
                <MpsHeader />
                <Link className="btn btn-danger cus_btn" to='/admin-options'>
                    Back
                </Link>

                <div className="central_container table_container">

                    <div className="text-center">
                        <h1 className="m-0">Cars</h1>
                    </div>

                    <div className="row justify-content-center p-3 w-100">
                        {this.props.isLoading && <span>Loading...</span>}
                        <Table id="DT_load" className="table table-striped table-bordered cus_tb">
                            <thead>
                                <tr>
                                    <th>Registration</th>
                                    <th>Driver</th>
                                    <th>Make</th>
                                    <th>Model</th>
                                    <th>Colour</th>
                                    <th></th>
                                </tr>
                                {this.props.cars.map((car: CarStore.Car) =>
                                    <tr key={car.registration}>
                                        <td>{car.registration}</td>
                                        <td>{car.driver ? car.driver : "N/A"}</td>
                                        <td>{car.make}</td>
                                        <td>{car.model}</td>
                                        <td>{car.colour}</td>
                                        <td className="table_panel">
                                            <Link className="btn btn-success btn-sm text-white" to={"/admin-edit-car/" + car.registration}>
                                                Edit
                                        </Link>
                                            <Button className="btn btn-danger btn-sm" onClick={() => this.props.deleteCar(car.registration)}>
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
    }
}

export default connect(
    (state: ApplicationState) => state.cars,
    CarStore.actionCreators
)(AdminViewCars as any);