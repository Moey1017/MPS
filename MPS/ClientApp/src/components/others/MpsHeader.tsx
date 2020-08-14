import * as React from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export class MpsHeader extends React.Component {
    render() {
        return (
            <div className="mpsHeader">
                <div className="header_title">MOFFET PARKING SOLUTIONS</div>
                <div className="header_img"><img src="https://moffett-parkingsolutions.com/wp-content/uploads/2020/05/moffett-parking-solutions.png" alt="mps_header_logo" /></div>
            </div>
            );
    }

}