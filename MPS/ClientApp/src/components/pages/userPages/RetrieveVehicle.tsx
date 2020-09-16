import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FormGroup, Form, Label, Input, FormText, Button } from 'reactstrap';
import * as Store from '../../../reduxStore/store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reduxStore/index';
import { MpsHeader } from '../../others/MpsHeader';

// At runtime, Redux will merge together..., merge everything into this.props
type StoreProps =
    & Store.StoreState // ... state we've requested from the Redux store
    & typeof Store.actionCreators; // ... plus action creators we've requested

class RetrieveVehicle extends React.Component<StoreProps, any>
{
    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        this.ensureDataFetched();
    }

    ensureDataFetched() {
        this.props.requestStoreState();
    }

    render() {
        return (
            <div className="mpsContainer">
                <MpsHeader />

                <Link className="btn btn-danger cus_btn" to='/'>
                    Back
                    </Link>

                <div className="text-center">
                    <h1>Car Store</h1>
                </div>

                <div className="row justify-content-center overflow-auto pallet_container">

                    {this.props.pallets.map((pallet: Store.Pallet) =>
                        <div className="col text-center align-items-center" key={pallet.pallet_id}>
                            <Link to={'/retrieve-confirmation/' + pallet.car_reg}
                                className={(pallet.car_reg === null || pallet.car_reg === undefined) ?
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