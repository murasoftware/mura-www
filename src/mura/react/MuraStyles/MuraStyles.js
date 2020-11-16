import React from 'react';

function MuraStyles(props) {
  const { moduleStyleData } = props;

  if (typeof moduleStyleData !== 'undefined') {
    return (
      <div>
        {Object.keys(moduleStyleData).map(instanceid => {
          const rules = moduleStyleData[instanceid];
          if(!rules.isEditMode){
          return (
            <style
              id={rules.id}
              key={rules.id}
              dangerouslySetInnerHTML={{ __html: rules.cssRules.join('\n') }}
             />
          );
          } else {
            return '';
          }
        })}
      </div>
    );
  } 
    // console.log("DYN IS NOT ARRAY: ");
    return <div />;
  
}

export default MuraStyles;
