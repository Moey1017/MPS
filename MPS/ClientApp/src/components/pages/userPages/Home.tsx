import * as React from 'react';
import { Link } from 'react-router-dom';
import * as Store from '../../../reduxStore/store';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';
import * as Rs from 'reactstrap';
import { MpsHeader } from '../../others/MpsHeader';

type storeProps = Store.StoreState
    & typeof Store.actionCreators;

class Home2 extends React.Component<storeProps, any>
{
    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        this.props.checkIfStoreHasSpace();
        if (this.props.signalR_connection === null || this.props.signalR_connection === undefined) {
            this.props.setUpSignalRConnection();
        }
    }

    render() {
        let storeButton;
        if (this.props.hasSpace) {
            storeButton = <Link className="btn btn-danger cus_btn" to='/store-vehicle'>
                Store Vehicle
                        </Link>
        }
        else {
            storeButton = <Link className="btn btn-danger cus_btn"
                onClick={() => { alert("Car Space is full"); }} to='/'>
                Store Vehicle
                        </Link>

        }
        return (
            <div className="home">
                <MpsHeader />

                <div className="home_content">

                    <div className="home_btn_sec">
                        <div className="d-flex flex-row">

                            <div className="d-flex m-auto home_btn_div">
                                {storeButton}

                                <Link className="btn btn-success cus_btn" to='/retrieve-vehicle'>
                                    Retrieve Vehicle
                                </Link>
                            </div>


                        </div>
                        <div className="d-flex">

                            <Link className="btn btn-secondary m-auto" to='/admin-login'>
                                Admin Log In
                        </Link>

                        </div>
                    </div>
                </div>
                <Link className="btn btn-secondary m-auto position-absolute bot_btn" to='/test'>
                    Testing Form
                        </Link>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.store,
    Store.actionCreators
)(Home2 as any);