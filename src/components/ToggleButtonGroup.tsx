 
interface ToggleButtonProps {
    children: Array<JSX.Element>;
    selected: string;
    onchange: (value: string) => void
}

/**
 *  get the children of this element and parsed to the markup required with onclick handler returning the value.
 * @param props 
 * @returns 
 */

function ToggleButtonGroup(props: ToggleButtonProps) {

    return (
        <div className='toggle-button-wrapper valign'>
            {props.children.map((option, index) =>
                <button key={index} className={'button ' + (props.selected === option.props.value ? "active" : "")} onClick={() => props.onchange(option.props.value)}>{option.props.children}</button>)}

        </div>
    );
}


export default ToggleButtonGroup;