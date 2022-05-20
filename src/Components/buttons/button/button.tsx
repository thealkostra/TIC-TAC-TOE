import { useEffect } from "react";
import { useState } from "react";
import "./button.css";

interface IProps{
    children:any,
    funcExecute: Function,
    value?:number,
    styleclass: string,
}

export const Button = ({children, funcExecute, value, styleclass}:IProps) =>{
    const [child, setChild] = useState()

    useEffect(()=>{
        setChild(children)
    },[children])

    return(
        <div className= {styleclass}
            onClick = {()=>funcExecute(value)}
        >
           {child}
        </div>
    )
}