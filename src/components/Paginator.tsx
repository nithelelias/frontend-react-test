import React, { ReactNode, useRef } from "react";

interface PaginatorProps {
    max: number;
    selected: number;
    onchange: (value: number) => void
};

interface GroupNumButtons {
    max: number;
    selected: number;
    onchange: (value: number) => void
}


function GroupNumButtons(props: GroupNumButtons) {



    try {  
        ///
        const max = props.max && !isNaN(props.max) ? props.max : 1;
        const selected = props.selected && !isNaN(props.selected) ? props.selected : 1;
        /////
        const buttonProbableSize: number = 48;
        const maxButtonsCapacity: number = Math.round((window.innerWidth / buttonProbableSize) - 3);
        const maxPerPage = Math.max(3, Math.min(9, maxButtonsCapacity));
        const min = selected <= maxPerPage - 2 ? 0 : selected - 5;
        const total = Math.min(maxPerPage, max - min);
        const list = new Array(total).fill(0);
        return (
            <div className=' valign'>
                {list.map((empty, index) => {
                    let num = 1 + min + index;
                    return <button key={index} className={'  button-number ' + (props.selected == num ? "active" : "")} onClick={() => props.onchange(num)}>
                        {num}
                    </button>
                })}

            </div>
        );
    } catch (e) {
        console.warn(e);
        return <div className=' valign'></div>;
    }

}
/**
 *  get the children of this element and parsed to the markup required with onclick handler returning the value.
 * @param props 
 * @returns 
 */

function Paginator(props: PaginatorProps) {
    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth
    }); 

    React.useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            });
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    });
    const onchangeChanger = (num: number) => {
        if (num < 1) {
            num = 1;
        }
        if (num > props.max) {
            num = props.max;
        }
        props.onchange(num);
    };
    return (
        <div className='paginator vhalign ' >
            <button className="button-number prev" onClick={() => onchangeChanger(props.selected - 1)} disabled={props.selected == 1} >{"<"}</button>
            <GroupNumButtons max={props.max} selected={props.selected} onchange={(num) => { onchangeChanger(num) }}></GroupNumButtons>
            <button className="button-number after" onClick={() => onchangeChanger(props.selected + 1)} disabled={props.selected == props.max}>{">"}</button>
        </div>
    );
}


export default Paginator;