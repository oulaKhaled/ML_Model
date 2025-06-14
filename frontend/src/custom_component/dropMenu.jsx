import { useState,useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';

function CustomizeDropMenu(props){
   const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filteredItems =props.new_f.filter(item => {
    const terms = props.value.split(",");
    const lastTerm = terms[terms.length - 1].trim().toLowerCase();
    return lastTerm && item.toLowerCase().startsWith(lastTerm);
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!filteredItems.length) return;

      if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        props.onSearch(filteredItems[highlightedIndex]);
        props.setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredItems, highlightedIndex]);
   return(
  
<Dropdown.Menu show   id="my_dropmenu">

{ 
  props.new_f.filter(item => {
    
const terms = props.value.split(","); 
const lastTerm = terms[terms.length - 1].trim().toLowerCase(); 
const symptom = item.toLowerCase();

return lastTerm && (symptom.startsWith(lastTerm) || symptom.startsWith(lastTerm));
})
.map((f,index)=>(
<div>
<Dropdown.Item  style={{cursor:"pointer",textAlign:"start",margin:"2px 0", backgroundColor: index === highlightedIndex ? "#e0f3ff" : "transparent",}} 
onClick={()=>{
  props.onSearch(f);
   props.setOpen(false)}}><h5>{f}</h5></Dropdown.Item>

</div>
))


}


</Dropdown.Menu>


   
   
   
   )
   
}

export default CustomizeDropMenu