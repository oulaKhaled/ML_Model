import Button from "react-bootstrap/esm/Button"
import  '../App.css'

function CustomizeButton(props){

    return(

 <Button   id={props.id} onClick={props.onClick} style={props.style}>{props.name}</Button> 

)
}

export default CustomizeButton

