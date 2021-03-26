import React, {useState} from 'react'
import './style.css';


const IconButton =({iconName, title}) => {
    const [isClicked, setClicked] = useState(false)
    return(
        <div onClick={()=>setClicked(true)} className="icon-btn-div">
            <i className={isClicked ? `${iconName} i-after` : `${iconName} icon`} />
            <a className={isClicked ? 'click-btn-after' : 'click-btn'} href="#">{title}</a>
        </div>
    )
}

export default IconButton;