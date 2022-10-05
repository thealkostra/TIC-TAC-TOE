import { useState } from "react"             
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { changeGameOn, selectCloseSocket, selectCurrentUser, selectMyStep, selectRoom, selectStep, selectUser, selectVictory, setCloseSocket, setCurrentUser, setField, setMyStep, setNameUser, setRoom, setStep, setVictory } from "../../store/allSlice"
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
    const currentUser = useSelector(selectCurrentUser)
    const myStep= useSelector(selectMyStep); ///coordinale step
    const room = useSelector(selectRoom);
    const step = useSelector(selectStep);
    const closeSocket = useSelector(selectCloseSocket);
    const [exitEnemy, setExitEnemy] = useState("");
    const client = useRef<WebSocket>();
    const [intervalPingPong, setintervalPingPong] = useState<NodeJS.Timer>()

// при нажатии на кнопку выхода очищаем поле и переключаем флаг игры
    const HandleBackMenu = ()=>{
        dispatch(setField([]));
        dispatch(changeGameOn(false))        
    }


// соединяемся с сервером
    useEffect(()=>{
        client.current = new WebSocket('ws:/10.7.11.159:8080');
        if(client.current){
            client.current.onopen = () => {
                dispatch(setCloseSocket(false))
                if(client.current){
                    client.current.send(JSON.stringify({action:"join", user: nameUser}));
                }
            }           
        }
        //перекидываемся пакетами чтоб браузер не закрыл сокет по таймауту
        setintervalPingPong(setInterval(pingpong, 5000));        
        return () => {
            if(client.current){
                if(intervalPingPong)
                    clearInterval(intervalPingPong);
                client.current.close()
            }
        }
    },[])
    
    // сообщаем серверу о выходе
    useEffect(()=>{
        if(closeSocket&&client.current){
            client.current.send(JSON.stringify({action:"exit", room: room, user: nameUser}))
        }
    }, [closeSocket])

    const pingpong=()=>{
        if(client.current){
            client.current.send("PING");
        }
    }


// проверяем сообщения от сервера 
    useEffect(()=>{
        if(client.current){
        client.current.onmessage = (message) => {
            if (message.data&&message.data!=="PONG") {
                const parsedData = JSON.parse(message.data);
                switch(parsedData.answer){
                    // при ответе сервера о подключении запоминаем комнату и имя игрока в сторе
                    case "join":{
                        dispatch(setNameUser(parsedData.user));
                        dispatch(setRoom(parsedData.room));
                        break;
                    }
                    // ответ от сервера о входе второго игрока 
                    case "joinpub":{
                        if(parsedData.nextUser===nameUser){
                            dispatch(setStep(true)); 
                        }
                        else{
                            dispatch(setStep(false));
                        }
                        dispatch(setCurrentUser(parsedData.nextUser));//устанавливаем чей ход
                        dispatch(setField(parsedData.field)); //обновляем поле
                        setUser2Ready(true); // устанавливаем , что оба игрока подключились 
                        break;
                    }
                    // при сообщении что ход сделан
                    case "step":{
                        dispatch(setField(parsedData.field)); // обновляем поле
                        dispatch(setCurrentUser(parsedData.nextUser)); //устанавливаем чей ход
                        // если наш ход , то разблокируем действия
                        if(parsedData.nextUser===nameUser){  
                            dispatch(setStep(true));
                        }
                        else{
                            dispatch(setStep(false));
                        }
                        break;
                    }

                    // если победа
                    case "victory":{
                        dispatch(setCurrentUser(parsedData.user));
                        // устанавливаем данные о победе и координаты где выигрыш
                        dispatch(setVictory({victory: true, line: parsedData.coord.line, startCol:parsedData.coord.startCol, startRow: parsedData.coord.startRow, finishCol: parsedData.coord.finishCol, finishRow: parsedData.coord.finishRow}));
                        break;
                    }
                    // если произощел выход противника устанавливаем сообщение о выходе и закрываем сокет
                    case "exit":{
                        setExitEnemy(parsedData.message);
                        dispatch(setCloseSocket(true))
                        break;
                    }
                    default:
                        break;                    
                }
            }
            return false;
        }
        }
    }, [dispatch, nameUser, step])

    // при ходе игрока отправляется сообщение на сокет и отключает действия игрока до хода противника
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
                        <div className="wait">
                            <div className="waitmove"></div>
                        </div>
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