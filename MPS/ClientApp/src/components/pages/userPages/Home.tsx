import * as React from 'react';
import { Link } from 'react-router-dom';
import * as Store from '../../../reduxStore/store';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../reduxStore/index';
import * as Rs from 'reactstrap';

type storeProps = Store.StoreState
    & typeof Store.actionCreators;

class Home2 extends React.Component<storeProps, any>
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
            storeButton = <Link className="btn btn-danger home_btn" to='/store-vehicle'>
                Store Vehicle
                        </Link>
        }
        else {
            storeButton = <Link className="btn btn-danger home_btn"
                onClick={() => { alert("Car Space is full"); }} to='/'>
                Store Vehicle
                        </Link>

        }
        return (
            <div className="home">
                <div className="mpsHeader">
                    <div className="header_title">MOFFET PARKING SOLUTIONS</div>
                    <div className="header_img"><img src="https://moffett-parkingsolutions.com/wp-content/uploads/2020/05/moffett-parking-solutions.png" alt="mps_header_logo" /></div>
                </div>

                <div className="home_content">

                    <div className="home_btn_sec">
                        <div className="d-flex flex-row">

                            <div className="d-flex m-auto home_btn_div">
                                {storeButton}

                                <Link className="btn btn-success home_btn" to='/retrieve-vehicle'>
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
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.store,
    Store.actionCreators
)(Home2 as any);