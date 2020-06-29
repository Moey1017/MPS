//System loading State, not in DB 
export interface loadingState {
    readonly fetching: boolean;
    // system status?? Enum? 
}

// Another DB, to connect with the existing DB system 
export interface storeState {
    readonly pallets: palletInStore[];
    readonly storing: boolean;
    readonly retriving: boolean;
}

export interface palletInStore {
    readonly palletId: number;
    readonly carReg: string | null;
}