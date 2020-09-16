import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { history } from '../index';
import axios from 'axios';
import * as Bcrypt from 'bcryptjs';

// Admin system DB (Registered CarRegList, Registered Drivers, Admin State)
export interface AdminState {
    readonly login_id: string | null;
    readonly access_level: number | null;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

//Action names
const AUTH_FAILED = 'AUTH_FAILED';
const AUTH_ADMIN = 'AUTH_ADMIN';
const LOGOUT = 'LOGOUT';


// Types of actions 
interface AuthorizeAdminAction {
    type: typeof AUTH_ADMIN
    login_id: string,
    access_level: number | null
}

interface LogOutAction {
    type: typeof LOGOUT
}

interface AuthFailedAction {
    type: typeof AUTH_FAILED
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
// Aggregate all actions together and to ensure will only receive these actions 
type AdminAction = AuthorizeAdminAction | LogOutAction | AuthFailedAction;



// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    adminLogin: (login_id: string, password: string): AppThunkAction<AdminAction> => (dispatch) => {
        // Only load data if it's something we don't already have (and are not already loading)
        axios.get('api/admin/auth-admin' + login_id)
            .then(res => {
                if (res.data !== "") {
                    if (Bcrypt.compareSync(password, res.data.password)) {
                        dispatch({ type: AUTH_ADMIN, login_id: res.data.login_id, access_level: null });
                        history.push('admin-options');
                    }
                    else {
                        dispatch({ type: AUTH_FAILED });
                        alert("Incorrect Credentitial. Please try again.");
                    }
                }
                else {
                    dispatch({ type: AUTH_FAILED });
                    alert("Incorrect Credentitial. Please try again.");
                }
            }).catch(err => { console.log("Something went wrong while logging in. Please try again later.");})
    }, 
    logout: (): AppThunkAction<AdminAction> => (dispatch) => {
        dispatch({ type: LOGOUT });
        history.push('/');
    }
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedAdminState: AdminState = {
    login_id: null, access_level: null
};

export const reducer: Reducer<AdminState> = (state: AdminState | undefined, incomingAction: Action): AdminState => {
    if (state === undefined) {
        return unloadedAdminState;
    }

    const action = incomingAction as AdminAction; // to ensure will only receive these actions 
    switch (action.type) {
        case AUTH_ADMIN:
            return {
                ...state,
                login_id: action.login_id,
                access_level: action.access_level
            }
        case AUTH_FAILED:
            return {
                ...state,
                login_id: null,
                access_level: null
            }
        case LOGOUT:
            return {
                ...state,
                login_id: null,
                access_level: null
            }
        default:
            return {
                ...state
            };
    }
};