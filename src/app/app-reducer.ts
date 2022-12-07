import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {authAPI, StatusCode} from "../api/todolists-api";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {addTaskAC} from "../features/TodolistsList/tasks-reducer";
import {AxiosError} from "axios";

const initialState: InitialStateType = {
    isInitialized:false,
    status: 'idle',
    error: null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return {...state}
    }
}


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    isInitialized:boolean
}

export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setInitialized = (isInitialized: boolean) => ({type: 'APP/SET-INITIALIZED', isInitialized} as const)


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res=>{
            if (res.data.resultCode === StatusCode.Ok){
                dispatch(setIsLoggedInAC({value: true}))
            }else {
                handleServerAppError(res.data, dispatch);

            }})
        .catch((error:AxiosError) => {
            handleServerNetworkError(error, dispatch)
        })
        .finally(()=>{
            dispatch(setInitialized(true))
        })

}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetInitializedActionType = ReturnType<typeof setInitialized>


type ActionsType =
    | SetAppErrorActionType
    | SetAppStatusActionType
|SetInitializedActionType
