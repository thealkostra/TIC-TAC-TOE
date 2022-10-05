import "./app.css";
import { Header } from "./Components/header/header";
import { useDispatch, useSelector } from "react-redux";
import { changeGameOn, selectGameon, selectUser, setCloseSocket, setNameUser, setVictory} from "./store/allSlice";
import { Button } from "./Components/buttons/button/button";
import { Game } from "./Components/game/game";
import { useEffect } from "react";
import { useRef } from "react";

export const App = () => {
    const dispatch = useDispatch();
    const gameOn = useSelector(selectGameon); //флаг начата ли игра
    const appref:any = useRef();
    const nameUser = useSelector(selectUser); // имя игрока из сторе
    let nameTmp:string|null = localStorage.getItem("userName");
    if(nameTmp!==null){
        dispatch(setNameUser(nameTmp));
    }


    //очищаем данные и начинаем игру
    const HandleClickStart = () =>{
        dispatch(setVictory({victory: false, line: null, startCol:null, startRow: null, finishCol: null, finishRow: null}));
        dispatch(setCloseSocket(false));
        dispatch(changeGameOn(true));
    }
// изменение размеров формы - добавляем unit к css, а тот уже сам размеры выставит
    const windowResize = () =>{
        let unit;
        if(window.innerHeight >= window.innerWidth)
            unit = window.innerHeight / window.innerWidth;
        else
            unit = 1.05;
        appref.current.style.setProperty(`--unit`, unit);
    }

// при изменении размеров окна браузера изменяем размеры
    useEffect(()=>{
        windowResize();
        window.addEventListener('resize', windowResize)
        return()=>{
            window.removeEventListener("resize", windowResize)
        }
    })

    const changeName = (e:any) =>{
        localStorage.setItem("userName",e.target.value)
        dispatch(setNameUser(e.target.value));
    }

    return(
        <div ref={appref} className = "App">
            <Header/>
            {!gameOn&&(
                <>
                    <input type="text" value = {nameUser} onChange={changeName}></input>
                    <div className="buttons buttons_size">
                        <Button funcExecute={HandleClickStart} styleclass = "buttons buttons__button button_size-l">START</Button>
                    </div>
                </>
            )}
            {gameOn&&(<Game/>)}
        </div>
    )
} 