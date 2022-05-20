import { useSelector } from "react-redux"
import { selectHelp } from "../../../store/allSlice"
import "./help.css"

export const Help = () =>{
    const help = useSelector(selectHelp);
    return(
        <div className="helppanel game__helppanel helppanel_view">
            {help}
        </div>
    )
}