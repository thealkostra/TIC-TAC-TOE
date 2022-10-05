import * as React from "react";
import "./tile.css";

interface IProps{
    dataTile:string
    col: number,
    row: number,
    HandleClick:Function
}
//отрисосываем ячейку если данные поменялись
export const Tile  = ({row, col,HandleClick,  dataTile}:IProps) =>{
    return (
        <div 
            className={dataTile==="X"?"tile tileX":"tile tileO"}
             onClick = {()=>HandleClick(row, col)} 
        >
            {dataTile}
        </div>
    )
}

const ch = (prevProps:any, nextProps:any)=>{
    return prevProps.dataTile===nextProps.dataTile;
}

export const MemoizedTile =  React.memo(Tile, ch)