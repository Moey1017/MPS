import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as CarStore from '../../../reduxStore/car';
import { ApplicationState } from '../../../reduxStore/index';
import { Button } from 'reactstrap';

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
            <div className="container mh-100 p-3 b-banner-image">
                <Link className="btn btn-danger cus-btn cus-margin-options" to='/admin-options'>
                    Back
                </Link>
                {this.props.isLoading && <span>Loading...</span>}
                <div className="col-12 border p-3 .w-100" >
                    <table id="DT_load" className="table table-striped table-bordered">
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
                                <tr key={car.registration + car.driver}>
                                    <td>{car.registration}</td>
                                    <td>{car.driver}</td>
                                    <td>{car.make}</td>
                                    <td>{car.model}</td>
                                    <td>{car.colour}</td>
                                    <td>
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
                    </table>
                </div>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.cars,
    CarStore.actionCreators
)(AdminViewCars as any);