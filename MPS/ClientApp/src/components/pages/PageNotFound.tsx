import * as React from 'react';
import { Link } from 'react-router-dom';

export default class PageNotFound extends React.Component<any, any>
{

    render() {
        return (
            <div className="container mh-100 b-image">
                <h1>Ops! This Page Doesn't Exist</h1>
                    <Link className="btn btn-secondary mt-2 btn-s " to='/'>
                        Back To Home
                    </Link>
            </div>
        );
    }
}