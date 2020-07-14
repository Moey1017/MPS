import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import * as Store from '../../../reduxStore/store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reduxStore/index';

// At runtime, Redux will merge together..., merge everything into this.props
type StoreProps =
    & Store.StoreState // ... state we've requested from the Redux store
    & typeof Store.actionCreators; // ... plus action creators we've requested

class RetrieveVehicle extends React.Component<StoreProps,any>
{
    constructor(props: any) {
        super(props);

        this.state = {
            car_reg: '',
            driver: '',
            model: '',
            make: '',
            colour: ''
        }
    }
    
    componentDidMount() {
        this.ensureDataFetched();
    }

    ensureDataFetched() {
        this.props.requestStoreState();
    }

    render() {
        return (
            <div className="container mh-100 b-banner-image">
                <div className="row cus-margin-home">
                    <Link className="btn btn-danger cus-btn mt-5 float-right" to='/'>
                        Back
                    </Link>
                </div>
                <div className="row retrieve-vehicle-title">
                    <h1 className="display-1 p-center">Retrieve Vehicle</h1>
                </div>
                <div className="row">
                    
                    {this.props.pallets.map((pallet: Store.Pallet) => 
                        <div className="column" key={pallet.palletId}>
                            <Link to={'/retrieve-confirmation/' + pallet.car_reg} onClick={() => { console.log(pallet.palletId); console.log(pallet.car_reg) }} className={(pallet.car_reg === null || pallet.car_reg === undefined) ?
                                "btn btn-dark cus-btn-retrieve mb-2 mr-2" :
                                "btn btn-reg cus-btn-retrieve mb-2 mr-2"}>
                                {(pallet.car_reg === null || pallet.car_reg === undefined) ? "EMPTY" : pallet.car_reg}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

// Cant use for some reason 
//function mapStateToProps(state: ApplicationState) {
//    return {
//        store: state.store
//    }
//}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        { ...Store.actionCreators },
        dispatch
    )
}

export default connect(
    (state: ApplicationState) => state.store,
    mapDispatchToProps
)(RetrieveVehicle as any);