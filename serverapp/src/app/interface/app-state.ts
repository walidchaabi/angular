import { DataState } from "../enum/data-state.enum";

export interface AppState<T>{
    datastate:DataState;
    appData?:T;
    error?:string;
}