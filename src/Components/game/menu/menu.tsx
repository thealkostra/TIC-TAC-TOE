
import { useDispatch, useSelector } from "react-redux"
import { changeGameOn, selectCloseSocket, selectCurrentUser, selectUser, selectVictory, setCloseSocket, setField, setHelp} from "../../../store/allSlice";

import "./menu.css"

export const Menu = () =>{
    const dispatch = useDispatch();
    const viktory = useSelector(selectVictory);
    const closeSocket = useSelector(selectCloseSocket);
    const currentUser = useSelector(selectCurrentUser);
    const nameUser = useSelector(selectUser)

    const mouseHover = (str:string) =>{
        dispatch(setHelp(str));
    }

    const HandleClick = () =>{
        if(!closeSocket){
            //if first exit closesocket
            dispatch(setCloseSocket(true))
            dispatch(setField([]));
            dispatch(changeGameOn(false))
        }
        else{
            //second exit
            dispatch(setField([]));
            dispatch(changeGameOn(false))
        }
    }

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