import {DataState} from "../enum/data-state.enum"
//* Group all information to show it as the App's state
export interface AppState<T>{
    dataState: DataState //* State of the App(LOADING, LOADED or ERROR)
    appData?: T //? I think, this parameter is when the information was successful retrieved
    error?: string //? Also i think, this parameter is when an error occurred
}