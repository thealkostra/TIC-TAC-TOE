import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from "./store";

export interface ICoord{
  x:number,
  y:number,
  title?:string,
}

interface IVictory{
  victory: boolean,
  line:number|null,
  startCol:number|null,
  startRow: number|null,
  finishCol: number|null,
  finishRow: number|null,
}

interface IinitialState{
    gameOn: boolean,
    field: string[][],

    victory: IVictory,
    help:string,
    room: number|null;
    step:boolean;
    myStep: ICoord|null;
    nameUser:string;
    currentUser:string|null;
    closeSocket: boolean;
}

const initialState:IinitialState = {
  gameOn: false,
  field: [],
  victory: {victory:false, line: null, startCol:null, startRow:null, finishCol:null, finishRow:null},
  help:"Control: Mouse",
  step:false,
  room: null,
  myStep: null,
  nameUser:"Player",
  currentUser: null,
  closeSocket: false,
};



export const allSlice = createSlice({
  name: 'all',
  initialState,
  reducers: {
    // изменение имени пользователя
    setNameUser: (state, action:PayloadAction<string>) =>{
      state.nameUser = action.payload;
    },
    setCurrentUser: (state, action:PayloadAction<string>) =>{
      state.currentUser = action.payload;
    },
    setMyStep:(state, action:PayloadAction<ICoord|null> )=>{
      state.myStep = action.payload;
    },
    setStep: (state, action:PayloadAction<boolean>)=>{
      state.step = action.payload;
    },
    setCloseSocket: (state, action:PayloadAction<boolean>)=>{
      state.closeSocket = action.payload;
    },
    setRoom: (state, action:PayloadAction<number|null>)=>{
      state.room = action.payload;
    },
    changeGameOn: (state, action:PayloadAction<boolean>) =>{
      state.gameOn = action.payload;
    },
    setField: (state, action:PayloadAction<string[][]>)=>{
      state.field = action.payload;
    },
    setVictory: (state, action:PayloadAction<IVictory> )=>{
        state.victory = action.payload;
    },
    setHelp: (state, action:PayloadAction<string>) =>{
        state.help = action.payload;
    }
  },
});

export const {  changeGameOn,
                setCloseSocket, 
                setNameUser,
                setCurrentUser,
                setMyStep,
                setStep,
                setRoom,
                setField,
                setVictory,
                setHelp
              } = allSlice.actions;

export const selectGameon = (state: RootState) => state.all.gameOn;
export const selectField = (state:RootState) => state.all.field;
export const selectVictory = (state:RootState) =>state.all.victory;
export const selectHelp = (state:RootState) => state.all.help;
export const selectRoom = (state:RootState) =>state.all.room;
export const selectMyStep = (state:RootState) =>state.all.myStep;
export const selectStep = (state:RootState) =>state.all.step;
export const selectUser = (state:RootState) =>state.all.nameUser;
export const selectCurrentUser = (state:RootState) =>state.all.currentUser;
export const selectCloseSocket = (state:RootState)=> state.all.closeSocket;
export default allSlice.reducer;
