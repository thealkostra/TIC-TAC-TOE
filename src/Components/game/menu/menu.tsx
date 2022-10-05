
import { useDispatch, useSelector } from "react-redux"
import { changeGameOn, selectCloseSocket, selectCurrentUser, selectUser, selectVictory, setCloseSocket, setField, setHelp} from "../../../store/allSlice";

import "./menu.css"

export const Menu = () =>{
    const dispatch = useDispatch();
    const viktory = useSelector(selectVictory);
    const closeSocket = useSelector(selectCloseSocket);
    const currentUser = useSelector(selectCurrentUser);
    const nameUser = useSelector(selectUser)

    // при наведении на кнопку меняем надпись помощи
    const mouseHover = (str:string) =>{
        dispatch(setHelp(str));
    }

    const HandleClick = () =>{
        if(!closeSocket){
            //если выходим первыми то - закрываем сокет, очищаем поле и переключаем флаг игры
            dispatch(setCloseSocket(true))
            dispatch(setField([]));
            dispatch(changeGameOn(false))
        }
        else{
            //если выходим вторыми , то сокет уже закрыт
            dispatch(setField([]));
            dispatch(changeGameOn(false))
        }
    }
// при уходе курсора с кнопки меняем надпись помощи
    const mouseBlur = () =>{
        dispatch(setHelp( "Control: Mouse"));
    }

    return (
        <ul className="menu menu__game menu_view">
            <li 
                className = "btn back"
                onMouseOver = {()=>mouseHover("Back to menu")}
                onMouseOut = {mouseBlur}
                onClick = {HandleClick}
            ></li>
            {!viktory.victory&&(<li className="infoplayer">
                <span>{nameUser===currentUser||!currentUser?"Your turn":`${currentUser} turn`}</span>
            </li>
            )}
        </ul>
    )
}