import PropTypes from 'prop-types';
import Footer from './Footer';
import NoticeBar from './NoticeBar';
import ShopBar from './shopbar/ShopBar';
import styles from './Main.module.scss';

const Main = ({ notice, children, background }) => {
  return (
    <>
      <header
        className={[styles.navbar, background || styles.absolute].join(' ')}
      >
        {!!notice && <NoticeBar notice={notice} />}
        <ShopBar background={background} />
      </header>
      <main
        className={[
          styles.maincontent,
          background && styles.margin_top,
          !!notice && styles.maincontent__notice,
        ].join(' ')}
      >
        <div>{children}</div>
        <Footer className={styles.footer} />
      </main>
    </>
  );
};

Main.propTypes = {
  background: PropTypes.bool,
  notice: PropTypes.string,
};

export default Main;
