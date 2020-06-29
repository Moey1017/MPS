import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { history } from '../index';
import { Driver } from './driver';

// In Admin system DB (Registered CarRegList, Registered Drivers, Admin State), Car table
export interface CarState {
    cars: Car[];
    car: Car;
    isLoading: boolean;
}

export interface Car {
    registration: string;
    driver?: string;
    make: string;
    model: string;
    colour: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

//Action names 
const REQUEST_CAR_LIST = 'REQUEST_CAR_LIST';
const RECEIVE_CAR_LIST = 'RECEIVE_CAR_LIST';
const INSERTING_CAR = 'INSERTING_CAR';
const INSERTED_CAR = 'INSERTED_CAR';
const DELETE_CAR = 'DELETE_CAR';
const UPDATE_CAR = 'UPDATE_CAR';
const FETCHING_CAR = 'FETCHING_CAR';
const FETCHED_CAR = 'FETCHED_CAR';


// Types 
interface RequestCarsListAction {
    type: typeof REQUEST_CAR_LIST;
}

interface ReceiveCarsListAction {
    type: typeof RECEIVE_CAR_LIST;
    cars: Car[];
}

interface InsertingCarAction {
    type: typeof INSERTING_CAR;
    car: Car;
}

interface InsertedCarAction {
    type: typeof INSERTED_CAR;
    car: Car;
}

interface DeleteCarAction {
    type:  typeof DELETE_CAR;
    carId: string;
}

interface UpdateCarAction {
    type: typeof UPDATE_CAR;
    car: Car;
}

interface FetchingCarAction {
    type: typeof FETCHING_CAR;
    carReg: string;
}

interface FetchedCarAction {
    type: typeof FETCHED_CAR;
    car: Car;
}



// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
// Aggregate all actions together and to ensure will only receive these actions 
type CarAction = RequestCarsListAction | ReceiveCarsListAction | InsertingCarAction | InsertedCarAction | DeleteCarAction
    | UpdateCarAction | FetchingCarAction | FetchedCarAction;


//Temp car data for testing 
var tempCar1 = {
    registration: "BqwFWE",
    driver: "11324N",
    make: "Make",
    model: "Model",
    colour: "White"
};
var tempCar2 = {
    registration: "e1ewqWE",
    driver: "1112312324N",
    make: "Make",
    model: "Model",
    colour: "White"
};
var tempCar3 = {
    registration: "qweewWE",
    driver: "1132124N",
    make: "Make",
    model: "Model",
    colour: "White"
};
var tempCarList: Car[] = [];
tempCarList.push(tempCar1); tempCarList.push(tempCar2); tempCarList.push(tempCar3);


// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    requestCarList: (): AppThunkAction<CarAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.cars) {
            dispatch({ type: REQUEST_CAR_LIST });
            //fetch(`car`) // connect to controller
            //    .then(response => response.json() as Promise<Car[]>)
            //    .then(data => {
            //        dispatch({ type: RECEIVE_CAR_LIST, cars: data });
            //    });     // above fetch from database and dispatch 
            dispatch({ type: RECEIVE_CAR_LIST, cars: tempCarList}) // for testing use 
        }
    },
    insertCar: (carFromClient: Car): AppThunkAction<CarAction> => (dispatch, getState) => {
        //TODO : modify into dbs
        dispatch({ type: INSERTING_CAR, car: carFromClient });
        dispatch({ type: INSERTED_CAR, car: carFromClient });// car: data(carFromDb From DBS)
        history.push('/admin-view-cars');//redirect back to view all drivers 
    },
    deleteCar: (carIdToDelete: string): AppThunkAction<CarAction> => (dispatch, getState) => {
        //TODO : modify into dbs
        dispatch({ type: DELETE_CAR, carId: carIdToDelete })
    },
    fetchCar: (carRegToGet: string): AppThunkAction<CarAction> => (dispatch) => {
        //TODO : get from dbs and find the driver by ID given 
        dispatch({ type: FETCHING_CAR, carReg: carRegToGet })
        //TODO: get driver from DBS and then dispatch the data 

        //const getDriver = async (
        //    driverIdToGet: number,
        //) => {
        //    const results = tempDriversList.filter(d => d.driverId === driverIdToGet);
        //    return results.length === 0 ? null : results[0];
        //};

        // !!!WARNING FOR TEMP USE ONLY 
        for (let i = 0; i < tempCarList.length; i++) {
            if (tempCarList[i].registration === carRegToGet) {
                dispatch({ type: FETCHED_CAR, car: tempCarList[i] });
            }
        }

    },
    updateCar: (newCar: Car): AppThunkAction<CarAction> => (dispatch) => {
        //TODO : modify into dbs
        dispatch({ type: UPDATE_CAR, car: newCar })
        history.push('/admin-view-cars');//redirect back to view all drivers 
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedCarState: CarState = {
    cars: [], car: { registration: '', make: '', model: '', colour:'' }, isLoading: false
}; // change: cars:[] -> cars: tempCarList, for testing 

export const reducer: Reducer<CarState> = (state: CarState | undefined, incomingAction: Action): CarState => {
    if (state === undefined) {
        return unloadedCarState;
    }

    const action = incomingAction as CarAction; // to ensure will only receive these actions 
    switch (action.type) {
        case REQUEST_CAR_LIST:
            return {
                ...state,
                isLoading: true
            };
        case RECEIVE_CAR_LIST:
            return {
                ...state,
                cars: action.cars,
                isLoading: false
            };
        case INSERTED_CAR:
            return {
                ...state,
                isLoading: true
            };
        case INSERTING_CAR:
            return {
                ...state,
                cars: [...state.cars, action.car],
                isLoading: false
            };
        case DELETE_CAR:
            return {
                ...state,
                cars: [...state.cars.filter(car => { return car.registration !== action.carId })]
            };
        case UPDATE_CAR:
            return {
                ...state,
                ...state.cars.map(c => {
                    if (c.registration === action.car.registration) return action.car;
                    return c;
                })
            };
        case FETCHING_CAR:
            return {
                ...state,
                isLoading: true,
            };
        case FETCHED_CAR:
            return {
                ...state,
                car: action.car,
                isLoading: false
            };
        default:
            return {
                ...state
            };
    }
};
