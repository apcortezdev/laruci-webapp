import PropTypes from 'prop-types';
import Footer from './Footer';
import NoticeBar from './NoticeBar';
import ShopBar from './shopbar/ShopBar';
import styles from './Main.module.scss';

const Main = ({ notice, children, isTransparent, transparency }) => {
  return (
    <>
      <header className={styles.navbar}>
        {!!notice && <NoticeBar notice={notice} />}
        <div
          className={isTransparent ? styles.transparent : styles.visible}
          style={
            isTransparent
              ? {
                  backgroundImage:
                    `linear-gradient(to bottom, rgb(32, 34, 36, ${(1 - transparency) * 0.2}) 70%, transparent )`,
                }
              : {}
          }
        >
          <ShopBar isTransparent={isTransparent} />
        </div>
      </header>
      <main
        className={[
          styles.maincontent,
          !!notice ? styles.maincontent__notice : '',
        ]
          .join(' ')
          .trim()}
      >
        <div>{children}</div>
        <Footer className={styles.footer} />
      </main>
    </>
  );
};

Main.propTypes = {
  isTransparent: PropTypes.bool,
  notice: PropTypes.string,
  transparency: PropTypes.number,
};

export default Main;
