import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../store/allSlice"
import "./victory.css"
export const Victory = () =>{
    const user = useSelector(selectCurrentUser)
    return(
        <div className="victory_view">
            <span>{user}</span>
            Victory !!!
        </div>
    )
}