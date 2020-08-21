import * as React from 'react';
import { Link } from 'react-router-dom';
import { MpsHeader } from '../others/MpsHeader';

export default class PageNotFound extends React.Component<any, any>
{
    render() {
        return (
            <div className="mpsContainer">
                <MpsHeader />
                <div className="central_container">
                    <h1>Ops! This Page Doesn't Exist</h1>
                    <Link className="btn btn-secondary cus_btn " to='/'>
                        Back To Home
                    </Link>
                </div>
            </div>
        );
    }
}