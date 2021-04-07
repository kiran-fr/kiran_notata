import React, {useState} from 'react'
import './style.css';


const IconButton =({iconName, title}) => {
  const [isClicked, setClicked] = useState(false)
  return(
    <div onClick={()=>setClicked(!isClicked)} className="icon-btn-div">
      <i className={isClicked ? `${iconName} i-after` : `${iconName} icon`} />
      <span className={isClicked ? 'click-btn-after' : 'click-btn'} href="">{title}</span>
    </div>
  )
}

export default IconButton;