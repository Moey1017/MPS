// Admin system DB (Registered CarRegList, Registered Drivers, Admin State)
export interface AdminState {
    readonly login_id: string;
    readonly isAdminLoggedIn: boolean;
}