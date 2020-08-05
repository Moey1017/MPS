"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var axios_1 = require("axios");
// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
//Action names 
var REQUEST_CAR_LIST = 'REQUEST_CAR_LIST';
var RECEIVE_CAR_LIST = 'RECEIVE_CAR_LIST';
var INSERTING_CAR = 'INSERTING_CAR';
var INSERTED_CAR = 'INSERTED_CAR';
var DELETE_CAR = 'DELETE_CAR';
var UPDATE_CAR = 'UPDATE_CAR';
var FETCHING_CAR = 'FETCHING_CAR';
var FETCHED_CAR = 'FETCHED_CAR';
// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
exports.actionCreators = {
    requestCarList: function () { return function (dispatch, getState) {
        // Only load data if it's something we don't already have (and are not already loading)
        var appState = getState();
        if (appState && appState.cars) {
            dispatch({ type: REQUEST_CAR_LIST });
            axios_1.default.get('api/car/get-cars')
                .then(function (res) {
                if (res.data) {
                    dispatch({ type: RECEIVE_CAR_LIST, cars: res.data });
                }
                else {
                    console.log("requestCarList did not receive any data.");
                }
            }).catch(function (error) {
                console.log("requestCarList caught an error.");
                console.log(error);
                //TODO:Create Dispatch type if error 
            });
        }
    }; },
    insertCar: function (carFromClient) { return function (dispatch, getState) {
        dispatch({ type: INSERTING_CAR, car: carFromClient });
        axios_1.default.post('api/car/insert-car', carFromClient)
            .then(function (res) {
            console.log(res);
            if (res.status === 201 && res.data == true) {
                dispatch({ type: INSERTED_CAR, car: carFromClient }); // driver: data(driverFromDb From DBS)???
                console.log("Car Added.");
                index_1.history.push('/admin-view-cars'); //redirect back to view all drivers 
            }
            else {
                console.log("Something went wrong");
            }
        }).catch(function (error) {
            console.log("insertCar caught an error.");
            console.log(error);
            //TODO:Create Dispatch type if error 
        });
    }; },
    deleteCar: function (carIdToDelete) { return function (dispatch, getState) {
        axios_1.default.delete('api/car/delete-car' + carIdToDelete)
            .then(function (res) {
            if (res.status === 204) {
                dispatch({ type: DELETE_CAR, carId: carIdToDelete });
                console.log('Car Deleted.');
            }
            else {
                console.log('Car Delete Failed.');
            }
        })
            .catch(function (error) {
            console.log("deleteCar caught an error./Failed to delete.");
            console.log(error);
        });
    }; },
    fetchCar: function (carRegToGet) { return function (dispatch) {
        dispatch({ type: FETCHING_CAR, carReg: carRegToGet });
        axios_1.default.get('api/car/get-car-byReg' + carRegToGet)
            .then(function (res) {
            if (res.data !== '') {
                dispatch({ type: FETCHED_CAR, car: res.data });
            }
            else {
                console.log("fetchCar do not receive any data.");
            }
        }).catch(function (error) {
            console.log("fetchCar caught an error.");
            console.log(error);
            //TODO:Create Dispatch type if error 
        });
    }; },
    updateCar: function (newCar) { return function (dispatch) {
        axios_1.default.put('api/car/update-car', newCar)
            .then(function (res) {
            if (res.status === 202) {
                dispatch({ type: UPDATE_CAR, car: newCar });
                console.log("Car updated.");
                index_1.history.push('/admin-view-cars'); //redirect back to view all cars 
            }
            else
                console.log("Update Car failed.");
        }).catch(function (error) {
            console.log("updateCar caught an error.");
            console.log(error);
            //TODO:Create Dispatch type when get status code 404
        });
    }; }
};
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
var unloadedCarState = {
    cars: [], car: { registration: '', make: '', model: '', colour: '' }, isLoading: false
}; // change: cars:[] -> cars: tempCarList, for testing 
exports.reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedCarState;
    }
    var action = incomingAction; // to ensure will only receive these actions 
    switch (action.type) {
        case REQUEST_CAR_LIST:
            return __assign(__assign({}, state), { isLoading: true });
        case RECEIVE_CAR_LIST:
            return __assign(__assign({}, state), { cars: action.cars, isLoading: false });
        case INSERTED_CAR:
            return __assign(__assign({}, state), { isLoading: true });
        case INSERTING_CAR:
            return __assign(__assign({}, state), { cars: __spreadArrays(state.cars, [action.car]), isLoading: false });
        case DELETE_CAR:
            return __assign(__assign({}, state), { cars: __spreadArrays(state.cars.filter(function (car) { return car.registration !== action.carId; })) });
        case UPDATE_CAR:
            return __assign(__assign({}, state), state.cars.map(function (c) {
                if (c.registration === action.car.registration)
                    return action.car;
                return c;
            }));
        case FETCHING_CAR:
            return __assign(__assign({}, state), { isLoading: true });
        case FETCHED_CAR:
            return __assign(__assign({}, state), { car: action.car, isLoading: false });
        default:
            return __assign({}, state);
    }
};
//# sourceMappingURL=car.js.map