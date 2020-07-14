import * as Cars from './car';
import * as Drivers from './driver';
import * as Store from './store';
import * as Admin from './admin';

// The top-level state object
export interface ApplicationState {
    cars: Cars.CarState;
    drivers: Drivers.DriverState;
    admin: Admin.AdminState;
    isLoggedIn: boolean;
    store: Store.StoreState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    cars: Cars.reducer,
    drivers: Drivers.reducer,
    store: Store.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
