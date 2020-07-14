import * as React from 'react';
import { Link } from 'react-router-dom';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import * as Store from '../../../reduxStore/store';
import * as CarStore from '../../../reduxStore/car';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reduxStore/index';


// At runtime, Redux will merge together..., merge everything into this.props
type CarAndStoreProps =
    CarStore.CarState // ... state we've requested from the Redux store
    & Store.StoreState
    & typeof CarStore.actionCreators // ... plus action creators we've requested
    & typeof Store.actionCreators;

class StoreConfirmation extends React.Component<CarAndStoreProps, any>
{
    constructor(props: any) {
        super(props);

        this.state = {
            cars: [],
            car: {
                registration: '',
                make: '',
                model: '',
                colour:''
            },
            isLoading: false
            //driverNameList:[]
        }
    }

    componentDidMount() {
        this.ensureCarDataFetched();
    }
    

    componentDidUpdate(prevProps: any) {
        if (prevProps.cars !== this.props.cars) {
            console.log(((this.props.cars['car'])[0]) ? (((this.props.cars['car'])[0]).registration)  : "Retrieving...");
            if (this.props.cars['car'].length !== 0 && this.props.cars['car'].length !== undefined) {
                //console.log(((this.props.cars['car'])[0]).registration);
                //console.log(this.props.cars);
                console.log("Retrieved successfully, setting states...");
                this.setState({
                    cars: this.props.cars,
                    car: ((this.props.cars['car'])[0])
                });
            }
        }
        console.log(this.props);
        console.log(this.props.cars['car'][0]);
        console.log(this.state.car);
    }


    private ensureCarDataFetched() {
        this.props.fetchCar('DUIW567');
    }

    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const carObj = {
            registration: this.props.cars['car'][0].registration,
            //driver: this.state.driver,
            make: this.props.cars['car'][0].make,
            model: this.props.cars['car'][0].model,
            colour: this.props.cars['car'][0].colour
        };

        const car = ((this.props.cars['car'])[0]);// either one
        console.log(car);
    }


    render() {
        let content;
        if (this.props.cars['car'] !== undefined && this.props.cars['car'].length !== 0) {
            //display details here 
            //content = <div>{this.props.cars}</div>
        } else {
            content = <div>Loading...</div>;
        }
        


            return (
                <div className="container mh-100 b-banner-image">
                    <h1 className="display-1 p-center-car">Store Car</h1>

                    <div className="row fixed-bottom justify-content-center cus-margin-l">
                        {content}
                        <form><Button onClick={this.handleSubmit} type="submit">Submit</Button></form>
                       
                    </div>
                </div>
            );
        }
}


function mapStateToProps(state: ApplicationState) {
    return {
        cars: state.cars,
        store:state.store
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        { ...Store.actionCreators, ...CarStore.actionCreators },
        dispatch
    )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StoreConfirmation as any);