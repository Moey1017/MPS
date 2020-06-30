import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { history } from '../index';
import axios from 'axios';


// In Admin system DB (Registered CarRegList, Registered Drivers, Admin State), Driver Table
export interface DriverState {
    readonly drivers: Driver[] ;
    readonly driver: Driver; // Hold data when adding new driver and edit driver, is this needed? 
    readonly isLoading: boolean; 
}

export interface Driver {
    readonly driverId: number;
    readonly driverName: string;
    readonly telNo: string;
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
    driverId: number;
}

interface UpdateDriverAction {
    type: typeof UPDATE_DRIVER;
    driver: Driver;
}

interface FetchingDriverAction {
    type: typeof FETCHING_DRIVER;
    driverId: number;
}

interface FetchedDriverAction {
    type: typeof FETCHED_DRIVER;
    driver: Driver;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
// Aggregate all actions together and to ensure will only receive these actions 
type DriverAction = RequestDriversListAction | ReceiveDriversListAction | InsertingDriverAction | InsertedDriverAction | DeleteDriverAction | UpdateDriverAction | FetchingDriverAction | FetchedDriverAction;


//Temp Driver data for testing 
var tempDriver1 = {
    driverId: 1,
    driverName: "11324N",
    telNo: "2323423",
    email:"r232r23"
};
var tempDriver2 = {
    driverId: 2,
    driverName: "21324N",
    telNo: "2323423",
    email: "r232r23"
};
var tempDriver3 = {
    driverId: 3,
    driverName: "31324N",
    telNo: "2323423",
    email: "r232r23"
};

var tempDriversList: Driver[] = [];
tempDriversList.push(tempDriver1); tempDriversList.push(tempDriver2); tempDriversList.push(tempDriver3);


// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    requestDriverList: (): AppThunkAction<DriverAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();

        //if (appState) { console.log(appState); } if (appState.drivers.) { console.log(appState); }
        
        if (appState && appState.drivers) {
            dispatch({ type: REQUEST_DRIVER_LIST });
            //fetch(`driver`) // connect to controller
            //    .then(response => response.json() as Promise<Driver[]>)
            //    .then(data => {
            //        dispatch({ type: RECEIVE_DRIVER_LIST, drivers: data });
            //    });     // above fetch from database and dispatch
            dispatch({ type: RECEIVE_DRIVER_LIST, drivers: tempDriversList }) // for testing use 
        }

    },
    insertDriver: (driverFromClient: Driver): AppThunkAction<DriverAction> => (dispatch) => {
        //TODO : modify into dbs, auto increment driver Id 
        axios.post('api/driver/insert-driver', driverFromClient)
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage)
                    }
                    else {
                        //TODO: get the new driver from the database, dispatch with the driver from database
                        dispatch({ type: INSERTING_DRIVER, driver: driverFromClient });
                        dispatch({ type: INSERTED_DRIVER, driver: driverFromClient }); // driver: data(driverFromDb From DBS)
                        console.log("Driver Added.")
                        history.push('/admin-view-drivers');//redirect back to view all drivers 
                    }
                } else {
                    console.log("something went wrong driver's not added")
                }
            })
        //here

        
        //dispatch({ type: INSERTING_DRIVER, driver: driverFromClient });
        //dispatch({ type: INSERTED_DRIVER, driver: driverFromClient }); // driver: data(driverFromDb From DBS)
        //history.push('/admin-view-drivers');//redirect back to view all drivers 
    },
    deleteDriver: (driverIdToDelete: number): AppThunkAction<DriverAction> => (dispatch) => {
        //TODO : modify into dbs
        dispatch({ type: DELETE_DRIVER, driverId: driverIdToDelete })
    },
    fetchDriver: (driverIdToGet: number): AppThunkAction<DriverAction> => (dispatch) => {
        //TODO : get from dbs and find the driver by ID given 
        dispatch({ type: FETCHING_DRIVER, driverId: driverIdToGet })
        //TODO: get driver from DBS and then dispatch the data 

        //const getDriver = async (
        //    driverIdToGet: number,
        //) => {
        //    const results = tempDriversList.filter(d => d.driverId === driverIdToGet);
        //    return results.length === 0 ? null : results[0];
        //};

        // !!!WARNING FOR TEMP USE ONLY 
        for (let i = 0; i < tempDriversList.length; i++){
            if (tempDriversList[i].driverId === driverIdToGet) {
                dispatch({ type: FETCHED_DRIVER, driver: tempDriversList[i] });
            }
        }
        
    },
    updateDriver: (newDriver: Driver): AppThunkAction<DriverAction> => (dispatch) => {
        //TODO : modify into dbs
        dispatch({ type: UPDATE_DRIVER, driver: newDriver })
        history.push('/admin-view-drivers');//redirect back to view all drivers 
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedDriverState: DriverState = {
    drivers: [], driver: { driverId: 0, driverName: '', telNo: '', email:'' }, isLoading: false
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
                drivers: [...state.drivers.filter(driver => { return driver.driverId !== action.driverId })]
            };
        case UPDATE_DRIVER:
            return {
                ...state,
                ...state.drivers.map(d => {
                    if (d.driverId === action.driver.driverId) return action.driver;
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
                isLoading: false
            };
        default:
            return {
                ...state
            };
    }
};
