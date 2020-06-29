"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var CarStore = require("../../../reduxStore/car");
var Home2 = /** @class */ (function (_super) {
    __extends(Home2, _super);
    function Home2(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    //public componentDidMount() {
    //}
    Home2.prototype.render = function () {
        return (React.createElement("div", { className: "table_container home p-0 m-0" }, this.props.cars.map(function (car) {
            return React.createElement("tr", { key: car.registration },
                React.createElement("td", null, car.registration),
                React.createElement("td", null, car.driver),
                React.createElement("td", null, car.make),
                React.createElement("td", null, car.colour),
                React.createElement("td", null, car.model));
        })));
    };
    return Home2;
}(React.PureComponent));
exports.default = react_redux_1.connect(function (state) { return state.cars; }, CarStore.actionCreators)(Home2);
//# sourceMappingURL=Home2.js.map