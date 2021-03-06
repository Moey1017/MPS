﻿import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { history } from '../index';
import axios from 'axios';


// In Admin system DB (Registered CarRegList, Registered Drivers, Admin State), Driver Table
export interface DriverState {
    readonly drivers: Driver[];
    readonly driver: Driver; // Hold data when adding new driver and edit driver, is this needed? 
    readonly isLoading: boolean;
}

export interface Driver {
    readonly driver_id: number;
    readonly name: string;
    readonly tel_no: string;
    readonly email: string;
    // carsList : Car[]; ?? 
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

//Action names 
const REQUEST_DRIVER_LIST = 'REQUEST_DRIVER_LIST';
const RECEIVE_DRIVER_LIST = 'RECEIVE_DRIVER_LIST';
const INSERTING_DRIVER = 'INSERTING_DRIVER';
const INSERTED_DRIVER = 'INSERTED_DRIVER';
const DELETE_DRIVER = 'DELETE_DRIVER';
const UPDATE_DRIVER = 'UPDATE_DRIVER';
const FETCHING_DRIVER = 'FETCHING_DRIVER';
const FETCHED_DRIVER = " FETCHED_DRIVER";

// Types 
interface RequestDriversListAction {
    type: typeof REQUEST_DRIVER_LIST;
}

interface ReceiveDriversListAction {
    type: typeof RECEIVE_DRIVER_LIST;
    drivers: Driver[];
}

interface InsertingDriverAction {
    type: typeof INSERTING_DRIVER;
    driver: Driver;
}

interface InsertedDriverAction {
    type: typeof INSERTED_DRIVER;
    driver: Driver;
}

interface DeleteDriverAction {
    type: typeof DELETE_DRIVER;
    driver_id: number;
}

interface UpdateDriverAction {
    type: typeof UPDATE_DRIVER;
    driver: Driver;
}

interface FetchingDriverAction {
    type: typeof FETCHING_DRIVER;
    driver_id: number;
}

interface FetchedDriverAction {
    type: typeof FETCHED_DRIVER;
    driver: Driver;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
// Aggregate all actions together and to ensure will only receive these actions 
type DriverAction = RequestDriversListAction | ReceiveDriversListAction | InsertingDriverAction | InsertedDriverAction |
    DeleteDriverAction | UpdateDriverAction | FetchingDriverAction | FetchedDriverAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    requestDriverList: (): AppThunkAction<DriverAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.drivers) {
            dispatch({ type: REQUEST_DRIVER_LIST });
            axios.get('api/driver/get-drivers')
                .then(res => {
                    if (res.data) {
                        dispatch({ type: RECEIVE_DRIVER_LIST, drivers: res.data })
                    } else {
                        console.log("requestDriverList did not receive any data.");
                    }
                }).catch(error => {
                    console.log("requestDriverList caught an error.");
                    console.log(error);
                    //TODO:Create Dispatch type if error 
                })
        }
    },
    insertDriver: (driverFromClient: Driver): AppThunkAction<DriverAction> => (dispatch) => {
        dispatch({ type: INSERTING_DRIVER, driver: driverFromClient });
        axios.post('api/driver/insert-driver', driverFromClient)
            .then(res => {
                if (res.status === 201 && res.data == true) {
                    dispatch({ type: INSERTED_DRIVER, driver: driverFromClient }); // driver: data(driverFromDb From DBS)???
                    console.log("Driver Added.")
                    history.push('/admin-view-drivers');//redirect back to view all drivers 
                }
                else {
                    console.log("Something went wrong in insertDriver");
                }
            }).catch(error => {
                console.log("requestDriverList caught an error./Failed to insert");
                console.log(error);
                //TODO:Create Dispatch type if error 
            })
        //here
        //TODO:Create Dispatch type if error 
    },
    deleteDriver: (driverIdToDelete: number): AppThunkAction<DriverAction> => (dispatch) => {
        axios.get('api/car/get-car-byDriver' + driverIdToDelete)
            .then(res => {
                if (res.data.length === 0) {
                    axios.delete('api/driver/delete-driver' + driverIdToDelete)
                        .then(res => {
                            if (res.status === 204) {
                                dispatch({ type: DELETE_DRIVER, driver_id: driverIdToDelete });
                                console.log('Driver Deleted.');
                            }
                            else {
                                console.log("Driver Delete Failed.");
                            }
                        })
                        .catch(error => {
                            console.log("deleteDriver caught an error/Failed to delete.");
                            console.log(error);
                        })
                }
                else {
                    alert("Cannot be deleted, car is registered under this driver.");
                }
            }).catch(error => { console.log(error); })
    },
    fetchDriver: (driverIdToGet: number): AppThunkAction<DriverAction> => (dispatch) => {
        dispatch({ type: FETCHING_DRIVER, driver_id: driverIdToGet })
        axios.get('api/driver/get-driver-byID' + driverIdToGet)
            .then(res => {
                if (res.data !== '') {
                    dispatch({ type: FETCHED_DRIVER, driver: res.data });
                } else {
                    console.log("fetchDriver did not receive any data.");
                }
            }).catch(error => {
                console.log("fetchDriver caught an error.");
                console.log(error);
                //TODO:Create Dispatch type when get status code 404
            })
    },
    updateDriver: (newDriver: Driver): AppThunkAction<DriverAction> => (dispatch) => {
        axios.put('api/driver/update-driver', newDriver)
            .then(res => {
                if (res.status === 202) {
                    dispatch({ type: UPDATE_DRIVER, driver: newDriver })
                    console.log("Driver updated.");
                    history.push('/admin-view-drivers');//redirect back to view all drivers 
                }
                else
                    console.log("Update Driver failed.");
            }).catch(error => {
                console.log("updateDriver caught an error.");
                console.log(error);
                //TODO:Create Dispatch type when get status code 404
            })
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedDriverState: DriverState = {
    drivers: [], driver: { driver_id: 0, name: '', tel_no: '', email: '' }, isLoading: false
};

export const reducer: Reducer<DriverState> = (state: DriverState | undefined, incomingAction: Action): DriverState => {
    if (state === undefined) {
        return unloadedDriverState;
    }

    const action = incomingAction as DriverAction; // to ensure will only receive these actions 
    switch (action.type) {
        case REQUEST_DRIVER_LIST:
            return {
                ...state,
                isLoading: true
            };
        case RECEIVE_DRIVER_LIST:
            return {
                ...state,
                drivers: action.drivers,
                isLoading: false
            };
        case INSERTING_DRIVER:
            return {
                ...state,
                isLoading: true
            };
        case INSERTED_DRIVER:
            return {
                ...state,
                drivers: [...state.drivers, action.driver],
                isLoading: false
            };
        case DELETE_DRIVER:
            return {
                ...state,
                drivers: [...state.drivers.filter(driver => { return driver.driver_id !== action.driver_id })]
            };
        case UPDATE_DRIVER:
            return {
                ...state,
                ...state.drivers.map(d => {
                    if (d.driver_id === action.driver.driver_id) return action.driver;
                    return d;
                })
            };
        case FETCHING_DRIVER:
            return {
                ...state,
                isLoading: true,
            };
        case FETCHED_DRIVER:
            return {
                ...state,
                driver: action.driver,
                isLoading: false,
            };
        default:
            return {
                ...state
            };
    }
};
