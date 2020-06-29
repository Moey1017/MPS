import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Home extends React.Component<any, any>
{

    render() {
        return (
            <div className="container mh-100 b-image">


                <div className="row fixed-bottom justify-content-center cus-margin-l">

                    <Link className="btn btn-danger cus-btn mr-5" to='/store-vehicle'>
                        Store Vehicle
                        </Link>

                    <Link className="btn btn-success cus-btn" to='/retrieve-vehicle'>
                        Retrieve Vehicle
                        </Link>

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