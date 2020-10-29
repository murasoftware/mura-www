import {useState,useEffect} from "react";
import CollectionNav from '../../../CollectionNav/CollectionNav';
import ReactMarkdown from "react-markdown";

const DefaultLayout = ({props,collection,link}) => {
  const {nextn} = props;
  const items = collection.get('items');
  const [pos, setPos] = useState(0);
  const [itemsTo,setItemsTo]= useState((pos+nextn > items.length ? items.length : pos+nextn));

  useEffect(()=>{
    setItemsTo((pos+nextn > items.length ? items.length : pos+nextn));
  },[pos]);

  return (
    <div>
      <ul style={{'listStyle': 'none'}}>
        <CurrentItems collection={collection} itemsTo={itemsTo}  setItemsTo={setItemsTo} pos={pos} setPos={setPos} link={link} {...props} />
      </ul>
      <div>
      <CollectionNav collection={collection} itemsTo={itemsTo} setItemsTo={setItemsTo} pos={pos} setPos={setPos} link={link} {...props} />  
      </div>
    </div>
  )
}

const CurrentItems = (props) => {
  const {collection,link,pos,fields,itemsTo} = props;
  let itemsList = [];
  let item = '';
  const Link = link;
  const items = collection.get('items');
  const fieldlist = fields ? fields.toLowerCase().split(",") : [];

  //console.log('layout',props.layout);
  //console.log('fieldlist',fieldlist);

  for(let i = pos;i < itemsTo;i++) {
    item = items[i];
    itemsList.push(
    <li key={item.get('contentid')}>
      {
      fieldlist.map(field => {
        switch(field) {
          case "title":
            return (
              <h1 key={field}>
                <Link href={`/${item.get('filename')}`}>
                  {item.get('title')}
                </Link>
              </h1>
            )
          case "date":
              return (item.get('releasedate') || item.get('lastupdate'));
          case "image":
            return  <CollectImage key={field} imageurl={item.get('images')}/>
          case "summary":
            return <ReactMarkdown source={item.get('summary')} key={field} />
          case "readmore":
            return (<Link key={field} href={`/${item.get('filename')}`}>
              Read More
            </Link>)
          default:
            return <p key={field}>{item.get(field)}</p>
        }        
      })
      }
    </li>
    );
  }

  return itemsList;
}

const CollectImage = (images) => {
  //console.log(images)
  if(images && images.medium){
    return (
    <p><img src={`${images.medium}`}/></p>
    );
  } else {
     return '';
  }
}

export default DefaultLayout;