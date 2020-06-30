import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class RetrieveVehicle extends React.Component<any, any>
{

    constructor(props: any) {
        super(props);

        this.state = {
            retrieveCars: [],
            loading: true
        }
    }

    componentDidMount() {
        this.populateButtons();
    }

    populateButtons() {
        axios.get("api/store/get-store-state").then(result => {
            const response = result.data;
            this.setState({ retrieveCars: response, loading: false })
        })
    }

    data(retrieveCars: any) {
        var result = retrieveCars.map((retrieveCar: any) => (
            retrieveCar.registration
        ))

        return result
    }

    createButtons(retrieveCars: any) {

        return (

            <div className="container mh-100 cus-outer-margin" >
                <div className="row cus-margin-home">
                    <Link className="btn btn-danger cus-btn mt-5 float-right" to='/'>
                        Back
                    </Link>
                </div>
                <div className="row retrieve-vehicle-title">
                    <h1 className="display-1 p-center">Retrieve Vehicle</h1>
                </div>
                <div className="row cus-row cus-row-top">

                    <div className="column">

                        <Link className={this.data(retrieveCars)[0] === null ?
                            "btn btn-dark cus-btn-retrieve mb-2 mr-2" :
                            "btn btn-reg cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>
                            {this.data(retrieveCars)[0] === null ? "EMPTY" : this.data(retrieveCars)[0]}
                        </Link>
                    </div>
                    <div className="column">

                        <Link className={this.data(retrieveCars)[1] === null ?
                            "btn btn-dark cus-btn-retrieve mb-2 mr-2" :
                            "btn btn-reg cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[1] === null ? "EMPTY" : this.data(retrieveCars)[1]}
                        </Link>
                    </div>

                    <div className="column">

                        <Link className={this.data(retrieveCars)[2] === null ?
                            "btn btn-dark cus-btn-retrieve cus-btn-retrieve-margin mb-2 mr-2" :
                            "btn btn-reg-margin cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[2] === null ? "EMPTY" : this.data(retrieveCars)[2]}
                        </Link>
                    </div>
                    <div className="column">

                        <Link className={this.data(retrieveCars)[3] === null ?
                            "btn btn-dark cus-btn-retrieve mb-2 mr-2" :
                            "btn btn-reg cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[3] === null ? "EMPTY" : this.data(retrieveCars)[3]}
                        </Link>
                    </div>
                </div>

                <div className="row cus-row">

                    <div className="column">

                        <Link className={this.data(retrieveCars)[4] === null ?
                            "btn btn-dark cus-btn-retrieve mb-2 mr-2" :
                            "btn btn-reg cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[4] === null ? "EMPTY" : this.data(retrieveCars)[4]}
                        </Link>
                    </div>
                    <div className="column">

                        <Link className={this.data(retrieveCars)[5] === null ?
                            "btn btn-dark cus-btn-retrieve mb-2 mr-2" :
                            "btn btn-reg cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[5] === null ? "EMPTY" : this.data(retrieveCars)[5]}
                        </Link>
                    </div>

                    <div className="column">

                        <Link className={this.data(retrieveCars)[6] === null ?
                            "btn btn-dark cus-btn-retrieve cus-btn-retrieve-margin mb-2 mr-2" :
                            "btn btn-reg-margin cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[6] === null ? "EMPTY" : this.data(retrieveCars)[6]}
                        </Link>
                    </div>
                    <div className="column">

                        <Link className={this.data(retrieveCars)[7] === null ?
                            "btn btn-dark cus-btn-retrieve mb-2 mr-2" :
                            "btn btn-reg cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[7] === null ? "EMPTY" : this.data(retrieveCars)[7]}
                        </Link>
                    </div>
                </div>
                <div className="row cus-row">

                    <div className="column">

                        <Link className={this.data(retrieveCars)[8] === null ?
                            "btn btn-dark cus-btn-retrieve mb-2 mr-2" :
                            "btn btn-reg cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[8] === null ? "EMPTY" : this.data(retrieveCars)[8]}
                        </Link>
                    </div>
                    <div className="column">

                        <Link className={this.data(retrieveCars)[9] === null ?
                            "btn btn-dark cus-btn-retrieve mb-2 mr-2" :
                            "btn btn-reg cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[9] === null ? "EMPTY" : this.data(retrieveCars)[9]}
                        </Link>
                    </div>

                    <div className="column">

                        <Link className={this.data(retrieveCars)[10] === null ?
                            "btn btn-dark cus-btn-retrieve cus-btn-retrieve-margin mb-2 mr-2" :
                            "btn btn-reg-margin cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[10] === null ? "EMPTY" : this.data(retrieveCars)[10]}
                        </Link>
                    </div>
                    <div className="column">

                        <Link className={this.data(retrieveCars)[11] === null ?
                            "btn btn-dark cus-btn-retrieve mb-2 mr-2" :
                            "btn btn-reg cus-btn-retrieve mb-2 mr-2"}
                            to='/retrieve-vehicle'>

                            {this.data(retrieveCars)[11] === null ? "EMPTY" : this.data(retrieveCars)[11]}
                        </Link>
                    </div>
                </div>

            </div>
        );
    }

    render() {
        let content = this.createButtons(this.state.retrieveCars)

        return (
            <div className="container mh-100 b-banner-image">
                <div className="row">
                    {content}
                </div>
            </div>
        );
    }
}
