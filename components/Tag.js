import React, { PropTypes } from 'react';
import styles from '../styles/tag.module.scss';

const Tag = (props) => {
  return (
    <div className={styles.outter_box}>
      <div className={styles.inner_box}>L</div>
    </div>
  );
};

Tag.propTypes = {};

export default Tag;
