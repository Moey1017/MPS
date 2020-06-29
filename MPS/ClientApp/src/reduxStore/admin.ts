// Admin system DB (Registered CarRegList, Registered Drivers, Admin State)
export interface AdminState {
    readonly loginId: string;
    readonly isAdminLoggedIn: boolean;
}