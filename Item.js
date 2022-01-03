
import React from 'react';
import './style.css'

function Item(props){
    // console.log('props: ',props);
    let {icon,title,color,pack,delay,transition,maxAmount,titleStyle,descriptionStyle,barStyle} = props;
    if(!color) color = Math.floor(Math.random()*16777215).toString(16);
    const colorDivStyle = {transitionProperty:'width',width:`${pack*100.0/maxAmount}%`,backgroundColor:color,transitionDuration:transition+'ms',transitionDelay:delay+'ms' };
    return(
        <div className='itemContainer'>
            {icon && <div className='icon'></div>}
            {title && <div className='title' style={{...titleStyle}}>{title}</div>}
            <div className='bar' style={barStyle}>
                <div className='colorDiv' style={colorDivStyle}>
                &nbsp;
                </div>
            </div>
            <div className='pack' style={descriptionStyle}>{pack}</div>
        </div>
    );
}

export default Item;
