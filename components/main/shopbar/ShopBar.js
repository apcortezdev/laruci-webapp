import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import styles from './ShopBar.module.scss';
import MainMenu from '../../MainMenu';
import ShopNav from './ShopNav';
import Backdrop from '../../utilities/Backdrop';
import Link from 'next/link';
import BagContext from '../../../store/bag-context';

const ShopBar = ({ isTransparent }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const bagContext = useContext(BagContext);
  let qtyInBag;
  if (!!bagContext) qtyInBag = bagContext.qtyItemsInBag;

  const toggleMobileMenu = () => {
    setToggleMenu((toggle) => !toggle);
  };

  return (
    <>
      <div
        className={[styles.container, isTransparent ? styles.transparent : ''].join(
          ' '
        ).trim()}
      >
        <div className={styles.shopbar_inner}>
          <span className={styles.mobilenav_area}>
            <button className={styles.mobilenav_btn} onClick={toggleMobileMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                className={styles.icon}
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                />
              </svg>
            </button>
          </span>
          <span className={styles.webnav_area}>
            <ShopNav onMobileClick={false} />
          </span>
          <span className={styles.search_area}>
            <span className={styles.search_area__box}>
              <input className={styles.search_area__input} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                className={styles.icon_search}
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </span>
          </span>
          <span className={styles.user_area}>
            <Link
              href={{
                pathname: '/loja/user',
              }}
            >
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  className={styles.icon}
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              </a>
            </Link>
            <Link
              href={{
                pathname: '/loja/sacola',
              }}
            >
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  className={styles.icon}
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z" />
                </svg>
                <span>{qtyInBag !== 0 ? qtyInBag : ''}</span>                
              </a>
            </Link>
          </span>
        </div>
        <div
          className={[
            styles.mobilenav,
            toggleMenu ? styles.open : styles.close,
          ].join(' ').trim()}
        >
          <ShopNav onMobileClick={toggleMobileMenu} />
          <MainMenu onMobileClick={toggleMobileMenu} />
        </div>
        {toggleMenu && <Backdrop onDismiss={toggleMobileMenu} />}
      </div>
    </>
  );
};

ShopBar.propTypes = {
  isTransparent: PropTypes.bool,
};

export default ShopBar;
