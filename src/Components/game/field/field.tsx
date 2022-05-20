import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectField,  selectStep,   selectVictory,   setMyStep} from "../../../store/allSlice";
import "./field.css"
import  {MemoizedTile}  from "./tile/tile";
import { useRef } from "react";

interface IProps{
    row:string[],
    keyrow:number,
    HandleClick: Function,
    
}





const RenderColumn = ({row,keyrow, HandleClick}:IProps) =>{
    return(
        <div className="col field__col col_view">
            {row.map((tile, key)=>(
                <MemoizedTile 
                    key={key} 
                    row={keyrow} 
                    col = {key} 
                    dataTile = {tile}
                    HandleClick = {HandleClick}
                />
            ))}
        </div>
    )
}
const check = (prevProps:any, nextProps:any)=>{
    return prevProps.row===nextProps.row;
}
const MemoCol =  React.memo(RenderColumn, check);

export const Field = () =>{
    const dispatch = useDispatch();
    const refField:any = useRef();
    const field  = useSelector(selectField);
    const steptmp = useSelector(selectStep); //не меняется при memo поэтому используем useRef
    const step = useRef<boolean>()  //чтобы постоянно иметь актуальное состояние 
    const victory = useSelector(selectVictory);



    const HandleClick = (row:number,col:number) =>{
        if(field[row][col]===""&&step.current){
                dispatch(setMyStep({x: col, y:row}))
        }
    
    }

    useEffect(()=>{
            step.current = steptmp;
    },[steptmp])

    //Draw line victory
     const drawLine = (mode:number, start_row:number, start_col:number, finish_row:number, finish_col:number)=>{
        console.log(mode, start_row, start_col, finish_row, finish_col);
        let unit;
        if(window.innerHeight >= window.innerWidth)
            unit = window.innerHeight / window.innerWidth;
        else
            unit = 1.05;
        unit = window.innerHeight*0.04/unit;

        let cnv:HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
        refField.current.append(cnv);
        let c = cnv.getContext("2d");
        cnv.style.position = "absolute";
        cnv.style.top = "0px";
        cnv.style.left = "0px";
        cnv.width = refField.current.clientWidth+2;
        cnv.height = refField.current.clientHeight+2;
        if(c){
            c.beginPath();
            c.strokeStyle = "red";
            c.lineWidth = 5;
            if(mode===0){
                c.moveTo(start_row*unit, start_col*unit+unit/2);
                c.lineTo(finish_row*unit, finish_col*unit+unit/2);
            }
            if(mode===1){
                c.moveTo(start_row*unit+unit/2, start_col*unit);
                c.lineTo(finish_row*unit+unit/2, finish_col*unit);
            }
            if(mode===2){
                c.moveTo(start_row*unit, start_col*unit);
                c.lineTo(finish_row*unit, finish_col*unit);
            }
            if(mode===3){
                c.moveTo(start_row*unit, start_col*unit+unit);
                c.lineTo(finish_row*unit, finish_col*unit+unit);
            }
            c.stroke();
        }
    }

    useEffect(()=>{
        if(victory.victory&&victory.line!==null&&victory.startCol!==null&&victory.startRow!==null&&victory.finishCol!==null&&victory.finishRow!==null)
            drawLine(victory.line, victory.startCol, victory.startRow, victory.finishCol, victory.finishRow);
    }, [victory.victory])

    return(
        <div ref={refField} className= "field game__field field_view">
            {field.map((row, key)=>(
                <div key={key} className="row">
                    <MemoCol HandleClick={HandleClick} row={row} keyrow = {key} key={key}/>
                </div>
            ))}
        </div>
    )
}