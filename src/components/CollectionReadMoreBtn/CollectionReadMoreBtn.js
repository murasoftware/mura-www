import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

const CollectionReadMoreBtn = (props) => {
    return (
        <Link href={props.href} passHref className="stretched-link btn btn-primary" key={props.key}>{props.ctatext}  <FontAwesomeIcon icon={faChevronRight} /></Link>
    )
  }

  export default CollectionReadMoreBtn;