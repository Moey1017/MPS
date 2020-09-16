import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as OrderStore from '../../../reduxStore/orders';
import { ApplicationState } from '../../../reduxStore/index';
import { Button, Table } from 'reactstrap';
import { MpsHeader } from '../../others/MpsHeader';
import { NoPermission } from '../../others/Screens';
import * as AdminStore from '../../../reduxStore/admin';
import * as Store from '../../../reduxStore/store';
import { bindActionCreators } from 'redux';

// At runtime, Redux will merge together..., merge everything into this.props
type Props =
    Store.StoreState // ... state we've requested from the Redux store
    & AdminStore.AdminState
    & typeof AdminStore.actionCreators
    & typeof Store.actionCreators; // ... plus action creators we've requested

class AdminViewDrivers extends React.PureComponent<Props>
{
    public componentDidMount() {
        this.ensureDataFetched();
    }

    // getting all data here
    private ensureDataFetched() {
        this.props.getStoreHistories();
    }

    render() {
        if (this.props.login_id) {
            return (
                <div className="mpsContainer">
                    <MpsHeader />
                    <Link className="btn btn-danger cus_btn" to='/admin-options'>
                        Back
                </Link>

                    <div className="central_container table_container">

                        <div className="text-center">
                            <h1 className="m-0">View Orders</h1>
                        </div>

                        <div className="row justify-content-center p-3 w-100 overflow-auto scrolling_table">
                            <Table id="DT_load" className="table table-striped table-bordered cus_tb">
                                <thead>
                                    <tr>
                                        <th>History NO</th>
                                        <th>Registration</th>
                                        <th>Activity</th>
                                        <th>Date Time</th>
                                    </tr>
                                    {this.props.store_histories.map((storeHistory: Store.History) =>
                                        <tr key={storeHistory.history_no}>
                                            <td>{storeHistory.history_no}</td>
                                            <td>{storeHistory.registration}</td>
                                            <td>{storeHistory.activity}</td>
                                            <td>{storeHistory.ts}</td>
                                        </tr>
                                    )}
                                </thead>
                            </Table>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<NoPermission />);
        }

    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.store,
        ...state.admin
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators(
        { ...Store.actionCreators, ...AdminStore.actionCreators },
        dispatch
    )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminViewDrivers as any);
