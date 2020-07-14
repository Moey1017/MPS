import { Car } from '../reduxStore/car';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { history } from '../index';
import axios from 'axios';

// Another DB, to connect with the existing DB system 
export interface StoreState {
    readonly pallets: Pallet[];
    readonly isLoading: boolean;
}

export interface Pallet {
    readonly palletId: string;
    readonly car_reg: string | null; // change from Car Model to CarReg
}

////System loading State, not in DB
//export interface currentState {
//    readonly fetching: boolean;
//    // system status?? Enum? 
//}


// Action name 
const REQUEST_STORE_STATE = 'REQUEST_STORE_STATE';
const RECEIVE_STORE_STATE = 'RECEIVE_STORE_STATE';
const STORING_CAR = 'STORING_CAR';
const STORED_CAR = 'STORED_CAR';

//Types
interface RequestStoreStateAction {
    type: typeof REQUEST_STORE_STATE;
}

interface ReceiveStoreStateAction {
    type: typeof RECEIVE_STORE_STATE;
    pallets: Pallet[];
}

interface StoringCarAction {
    type: typeof STORING_CAR;
    pallets: Pallet;
}

interface StoredCarAction {
    type: typeof STORED_CAR;
    pallets: Pallet;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
// Aggregate all actions together and to ensure will only receive these actions 
type StoreAction = RequestStoreStateAction | ReceiveStoreStateAction | StoringCarAction | StoredCarAction;

export const actionCreators = {
    requestStoreState: () : AppThunkAction<StoreAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.cars) {
            dispatch({ type: REQUEST_STORE_STATE });
            axios.get('api/store/get-store-state')
                .then(res => {
                    if (res.data) {
                        dispatch({ type: RECEIVE_STORE_STATE, pallets: res.data })
                    } else {
                        console.log("requestStoreState did not receive any data.");
                    }
                }).catch(error => {
                    console.log("requestStoreState caught an error.");
                    console.log(error);
                    //TODO:Create Dispatch type if error 
                })
        }
    },
    storeCar: (): AppThunkAction<StoreAction> => (dispatch) => {

    },
    retrieveCar: (): AppThunkAction<StoreAction> => (dispatch) => {

    }
}

const unloadedStoreState: StoreState = {
    pallets: [], isLoading: false
};

export const reducer: Reducer<StoreState> = (state: StoreState | undefined, incomingAction: StoreAction): StoreState => {
    if (state === undefined) {
        return unloadedStoreState;
    }

    const action = incomingAction as StoreAction; // to ensure will only receive these actions 
    switch (action.type) {
        case REQUEST_STORE_STATE:
            return {
                ...state,
                isLoading: true
            }
        case RECEIVE_STORE_STATE:
            return {
                ...state,
                pallets: action.pallets,
                isLoading: false
            }
        default:
            return {
                ...state
            }
    } 

}

