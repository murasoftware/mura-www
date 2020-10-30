import React from 'react';
import styles from './Example.module.scss';

function Example({myvar}) {
  // console.log("Component -> Text: ", props);

  return (
    <div>
        <h3 className={styles.label}>{myvar || 'Enter example variable in configurator'}</h3>
    </div>
  );
}

export default Example;