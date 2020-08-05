import * as React from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export class LoadingScreen extends React.Component {
    render() {
        return (
            <div id="loading-bg">
                <div id="loading">
                    <div id="sc1"></div>
                    <div id="sc2"></div>
                    <div id="sc3"></div>
                    <div id="sc4"></div>
                    <div id="sc5"></div>
                </div>
            </div>
        );
    }
}

// In parent component 
//const URLTo = { // make sure all required component's inputs/Props keys&types match
//    title: "Car has been retrieved",
//    url: '/'
//}
//<OkScreen {...URLTo} />

export class OkScreen extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // here
    }

    render() {
        return (
            <div id="popup1" className="overlay">
                <div className="popup">
                    <h2>{this.props.title}</h2>
                    <div className="content">
                        <Button onClick={this.handleSubmit}>OK</Button>
		            </div>
                </div>
            </div>
        );
    }
}