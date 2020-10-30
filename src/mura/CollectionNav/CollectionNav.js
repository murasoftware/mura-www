import Mura from 'mura.js';
import {useEffect} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const CollectionNav = (props) => {
	const {collection,pos,nextn,setPos,scrollpages,instanceid,itemsTo,setItemsTo} = props;
	const items = collection.get('items');

	if(scrollpages){
		useEffect(()=>{
			if(!Mura.isInNode()){
				const isEndVisible = () => {
					const end=Mura(`div.mura-collection-end[data-instanceid="${instanceid}"]`);
					if(itemsTo  && items.length && Mura.isScrolledIntoView(end.node)){
						if(itemsTo < (items.length)){
							setItemsTo(itemsTo+1);
						}
					} else if(itemsTo < (items.length)){
						setTimeout(isEndVisible,50);
					}
					
				}
				isEndVisible();
			}	
		},[]);

		return (
			<div className="mura-collection-end" data-instanceid={instanceid}/>
		)
	}

	const next = pos+nextn;
	const prev = pos > 0 ? pos-nextn > 0 ? pos-nextn : 0 : 0;
	const itemsOf = pos+nextn > items.length ? items.length: pos+nextn;
	let nav = [];

	if(pos > 0) {
		nav.push (
		  <NavButton key="prev" pos={pos} val={prev} onItemClick={setPos} label="Prev"/>
		)
	  }
	
	  if(next<items.length) {
		nav.push (
		  <NavButton key="next" pos={pos} val={next} onItemClick={setPos} label="Next"/>
		)
	  }
	
	if(nav.length){
		return (
		<div>
			<p>Displaying items {pos+1}-{itemsOf} of {items.length}</p>
			<ul className="pagination">
				{nav}
			</ul>
		</div>
		);
	} else {
		return '';
	}
  }
  
  const NavButton = props => {
	let {val,onItemClick} = props;
  
	const _onClick = () => {
	  onItemClick(val);
	}

	
	return (
	  <li className="page-item">
	  	<a onClick={_onClick} className="page-link"><NavButtonLabel label={props.label} /></a>
	  </li>
	)
  }

  const NavButtonLabel = props => {
	if (props.label == 'Next'){
		return(
			<>
				{props.label} <FontAwesomeIcon icon={faChevronRight} />
		  	</>
		)
	} else {
		return(
			<>
				<FontAwesomeIcon icon={faChevronLeft} /> {props.label}
		  	</>
		)
	}
  }
  
  export default CollectionNav;