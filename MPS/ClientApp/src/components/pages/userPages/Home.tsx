import * as React from 'react';
import { Link } from 'react-router-dom';
import * as Store from '../../../reduxStore/store';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';

type storeProps = Store.StoreState
    & typeof Store.actionCreators;

class Home extends React.Component<storeProps, any>
{
    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
        this.props.checkIfStoreHasSpace();
    }

    render() {
        let storeButton;
        if (this.props.hasSpace) {
            storeButton = <Link className="btn btn-danger cus-btn mr-5" to='/store-vehicle'>
                Store Vehicle
                        </Link>;
        }
        else {
            storeButton = <Link className="btn btn-danger cus-btn mr-5"
                onClick={() => { alert("Car Space is full"); }} to='/'>
                Store Vehicle
                        </Link>

        }
        return (
            <div className="container mh-100 b-image">


                <div className="row fixed-bottom justify-content-center cus-margin-l">

                    {storeButton}

                    <Link className="btn btn-success cus-btn" to='/retrieve-vehicle'>
                        Retrieve Vehicle
                        </Link>;
                    

                </div>
                <div className="row fixed-bottom justify-content-center cus-margin-m">

                    <Link className="btn btn-secondary mt-2 btn-s " to='/admin-login'>
                        Add/Edit Details
                        </Link>
                </div>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.store,
    Store.actionCreators
)(Home as any);