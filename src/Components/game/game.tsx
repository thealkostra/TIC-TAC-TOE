import { useState } from "react"             
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { changeGameOn, selectCloseSocket, selectMyStep, selectRoom, selectStep, selectUser, selectVictory, setCloseSocket, setCurrentUser, setField, setMyStep, setNameUser, setRoom, setStep, setVictory } from "../../store/allSlice"
import { Field } from "./field/field"
import "./game.css"
import { Help } from "./help/help"
import { Menu } from "./menu/menu"
import { Victory } from "./victory"



export const Game = () =>{
    const dispatch = useDispatch();
    const victory = useSelector(selectVictory);
    const [User2Ready, setUser2Ready] = useState(false);
    const nameUser = useSelector(selectUser);
    const myStep= useSelector(selectMyStep); ///coordinale step
    const room = useSelector(selectRoom);
    const step = useSelector(selectStep);
    const closeSocket = useSelector(selectCloseSocket);
    const [exitEnemy, setExitEnemy] = useState("");
    const client = useRef<WebSocket>();


    const HandleBackMenu = ()=>{
        dispatch(setField([]));
        dispatch(changeGameOn(false))        
    }



    useEffect(()=>{
        client.current = new WebSocket('ws:/localhost:8080');
        if(client.current){
            client.current.onopen = () => {
                dispatch(setCloseSocket(false))
                if(client.current){
                    client.current.send(JSON.stringify({action:"join", user: nameUser}));
                }
            }           
        }
        return () => {
            if(client.current){
                client.current.close()
            }
        }
    },[dispatch])
    
    useEffect(()=>{
        if(closeSocket&&client.current){
            client.current.send(JSON.stringify({action:"exit", room: room, user: nameUser}))
        }
    }, [closeSocket])

    useEffect(()=>{
        if(client.current){
        client.current.onmessage = (message) => {
            if (message.data) {
                const parsedData = JSON.parse(message.data);
                switch(parsedData.answer){
                    case "join":{
                        dispatch(setNameUser(parsedData.user));
                        dispatch(setRoom(parsedData.room));
                        break;
                    }
                    case "joinpub":{
                        if(parsedData.nextUser===nameUser){
                            dispatch(setStep(true)); 
                        }
                        else{
                            dispatch(setStep(false));
                        }
                        dispatch(setCurrentUser(parsedData.nextUser))
                        dispatch(setField(parsedData.field));
                        setUser2Ready(true);
                        break;
                    }
                    case "step":{
                        dispatch(setField(parsedData.field));
                        dispatch(setCurrentUser(parsedData.nextUser))

                        if(parsedData.nextUser===nameUser){  
                            dispatch(setStep(true));
                        }
                        else{
                            dispatch(setStep(false));
                        }
                        break;
                    }
                    case "victory":{
                        dispatch(setCurrentUser(parsedData.user))
                        dispatch(setVictory({victory: true, line: parsedData.coord.line, startCol:parsedData.coord.startCol, startRow: parsedData.coord.startRow, finishCol: parsedData.coord.finishCol, finishRow: parsedData.coord.finishRow}));
                        break;
                    }
                    case "exit":{
                        setExitEnemy(parsedData.message);
                        dispatch(setCloseSocket(true))
                        break;
                    }
                    default:
                        break;                    
                }
            }
        }
        }
    }, [dispatch, nameUser, step])

    useEffect(()=>{
        if(myStep&&client.current&&step){
            client.current.send(JSON.stringify({action:"step", room: room, user: nameUser, col: myStep?.x, row: myStep?.y}))
            dispatch(setMyStep(null));
        }
    }, [dispatch, myStep])    
    return(
        <>
            <div className="game">
                <Field/>
                {victory.victory&&(<Victory/>)}
                <Menu/>
            </div>
            <Help/>
            {!User2Ready&&(
                <div className="backform">
                    <div className="popup">
                        Wait to second Player
                        <button onClick = {HandleBackMenu} >Back to menu</button>
                    </div>
                </div>
            )}
            {exitEnemy!==""&&(
                <div className="backform">
                    <div className="popup">
                        {exitEnemy}
                        <button onClick = {HandleBackMenu} >Back to menu</button>
                    </div>
                </div>
            )}
        </>
    )
}