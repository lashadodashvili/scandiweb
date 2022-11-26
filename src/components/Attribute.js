import { isTypeNode } from 'graphql';
import React, { useState } from 'react'

export default function Attribute(attributeData) {
    
    const [activeBg, setActiveBg] = useState(-1);
    const [activeBorder, setActiveBorder] = useState(-1);

    const onColorClick = (e,index) => {
        setActiveBorder(index)
       console.log(e)
    
    }
    const onAttributeClick = (e,index) => {
        console.log(e);
        setActiveBg(index)
     
    }
    return (
        <div >

            <h2 className="attribute-name">{attributeData.attributeData?.name}</h2>
            <div style={{ display: "flex" }}>
                {attributeData.attributeData?.items.map((item, index) => {

                    return (
                        <div
                            onClick={(e) => item.value.includes("#") ? onColorClick(e,index) : onAttributeClick(e,index)}
                            key={index}
                            
                            className={`attribute
                            ${activeBorder === index ? 'color-attribute' : ''}
                            ${activeBg === index ? 'bg-attribute' : ''}`}
                            style={{ backgroundColor: !item.value.includes("#") ? "" : item.value }}>
                            <span>{!item.value.includes("#") ? item.value : ''}</span>
                        </div>)
                })}
            </div>

        </div>
    )
}
