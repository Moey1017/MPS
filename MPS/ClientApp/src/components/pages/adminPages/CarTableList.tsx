import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as CarStore from '../../../reduxStore/car';
import { ApplicationState } from '../../../reduxStore/index';

export default class CarTableList extends React.Component<any, any>{
    constructor(props: any) {
        super(props);

        this.state = {
        };
    }
    render() {
        return (
            <div className="post_table_row">

                <span className="user_icon"><img src="https://simpleicon.com/wp-content/uploads/user1-256x256.png" alt="user_icon" /></span>
                <div className="post_table_row_footer">
                    <div className="edit_delete">

                    </div>
                    <ul>

                    </ul>
                </div>
            </div>
        );
    }
}