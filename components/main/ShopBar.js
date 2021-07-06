import { useState } from 'react';
import styles from './ShopBar.module.scss';
import MainMenu from '../MainMenu';
import SearchInput from '../utilities/SearchInput';
import ShopNav from '../utilities/ShopNav';
import Backdrop from '../utilities/Backdrop';
import Link from 'next/link';

const ShopBar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const toggleMobileMenu = () => {
    setToggleMenu((toggle) => !toggle);
  };

  return (
    <>
      <div className={styles.shopbar}>
        <div className={styles.shopbar_inner}>
          <span className={styles.mobilenav_area}>
            <button
              className={styles.mobilenav_btn}
              onClick={toggleMobileMenu}
            />
          </span>
          <span className={styles.webnav_area}>
            <ShopNav onMobileClick={false} />
          </span>
          <span className={styles.search_area}>
            <SearchInput />
          </span>
          <span className={styles.user_area}>
            <Link
              href={{
                pathname: '/user',
                // query: { id: link.id },
              }}
            >
              <span className={styles.user_icon} />
            </Link>
            <Link
              href={{
                pathname: '/bag',
                // query: { id: link.id },
              }}
            >
              <span className={styles.bag_icon} />
            </Link>
          </span>
        </div>
        <div
          className={[
            styles.mobilenav,
            toggleMenu ? styles.open : styles.close,
          ].join(' ')}
        >
          <MainMenu onMobileClick={toggleMobileMenu} />
          <ShopNav onMobileClick={toggleMobileMenu} />
        </div>
        {toggleMenu && <Backdrop onDismiss={toggleMobileMenu} />}
      </div>
    </>
  );
};

export default ShopBar;
