import React from 'react';

function MuraProxiedAssets(props) {
    const { externalModules } = props;
    if (typeof externalModules !== 'undefined') {
       return (
         <div className="mura-proxied-assets">
            {Object.keys(externalModules).map(key => {
                const module = externalModules[key];
                if(module.js && Array.isArray(module.js)){
                    return (
                        module.js.map((item)=>{
                            return  (
                                <script key={item} src={item} defer></script>
                            );
                        })
                    )
                } 
            })}
            {Object.keys(externalModules).map(key => {
                const module = externalModules[key];
                if(module.css && Array.isArray(module.css)){
                    return (
                        module.css.map((item)=>{
                            return  (
                                <link key={item} rel="stylesheet" href={item}/>
                            );
                        })
                    )
                } 
            })}
        </div>
        )
    } else {
        return <div className="mura-proxied-assets"/>;
    }
  }
  
  export default MuraProxiedAssets;