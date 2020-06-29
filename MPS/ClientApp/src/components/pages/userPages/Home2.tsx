import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as CarStore from '../../../reduxStore/car';
import { ApplicationState } from '../../../reduxStore/index';


// At runtime, Redux will merge together...
type CarProps =
    CarStore.CarState // ... state we've requested from the Redux store
    & typeof CarStore.actionCreators; // ... plus action creators we've requested

class Home2 extends React.PureComponent<CarProps>
{
    constructor(props: any) {
        super(props);

        this.state = {

        }
    }

    //public componentDidMount() {
        
    //}
    render() {
        return (
            <div className="table_container home p-0 m-0">
                
                {this.props.cars.map((car: CarStore.Car) =>
                    <tr key={car.registration}>
                        <td>{car.registration}</td>
                        <td>{car.driver}</td>
                        <td>{car.make}</td>
                        <td>{car.colour}</td>
                        <td>{car.model}</td>
                    </tr>
                )}
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.cars,
    CarStore.actionCreators
)(Home2 as any);