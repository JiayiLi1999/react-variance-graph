
import React from 'react';
import './style.css'

function Item(props){
    // console.log('props: ',props);
    
    return(
        <div className='itemContainer'>
            {props.icon && <div className='icon'></div>}
            {props.title && <div className='title'>{props.title}</div>}
            <div className='bar'>
                <div className='colorDiv' style={{width:`${props.data*100.0/props.maxAmount}%`,backgroundColor:props.color }}>
                &nbsp;
                </div>
            </div>
            <div className='data'>{props.data}</div>
        </div>
    );
}

export default Item;
