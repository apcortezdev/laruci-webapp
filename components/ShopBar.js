import { useState } from 'react';
import styles from '../styles/ShopBar.module.scss';
import MainMenu from './MainMenu';
import SearchInput from './utilities/SearchInput';
import ShopNav from './utilities/ShopNav';
import Backdrop from './utilities/Backdrop';

const ShopBar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const toggleMobileMenu = () => {
    setToggleMenu((toggle) => !toggle);
  };

  return (
    <>
      {toggleMenu && <Backdrop onDismiss={toggleMobileMenu} />}
      <div className={styles.shopbar}>
        <div className={styles.shopbar_inner}>
          <span className={styles.mobilenav_area}>
            <button
              className={styles.mobilenav_btn}
              onClick={toggleMobileMenu}
            />
          </span>
          <span className={styles.webnav_area}>
            <ShopNav />
          </span>
          <span className={styles.search_area}>
            <SearchInput />
          </span>
          <span className={styles.user_area}>
            <span className={styles.user_icon} />
            <span className={styles.bag_icon} />
          </span>
        </div>
        <div
          className={[
            styles.mobilenav,
            toggleMenu ? styles.open : styles.close,
          ].join(' ')}
        >
          <MainMenu />
          <ShopNav />
        </div>
      </div>
    </>
  );
};

export default ShopBar;
