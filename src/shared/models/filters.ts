
export interface Config {
    label: string;
    data: any[];
    filterName: string;
    filterType: string;
    selected: any;
    active: boolean;
}

export interface DataArray {
    text: string;
    value: number;
}

export interface ReviewStatus {
    label: string;
    data: any[];
    selected: number;
}

export interface DeviationStatus {
    label: string;
    data: any[];
    selected: string;
}

export interface Filter {
posted_date: any;
process_status:any;
stext: string;
company_code: any;
rules: any;
toggle: any;
SUBRSTATUSID?: any;
isDeviation?: any;
hml?: any;
documenttype?: any;
vendor?: any;
};
