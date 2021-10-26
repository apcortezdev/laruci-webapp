import PropTypes from 'prop-types';
import Footer from '../Footer';
import NoticeBar from '../NoticeBar';
import ShopBar from '../shopbar/ShopBar';
import styles from './styles.module.scss';

const Main = ({ categoryList, notice, children, isTransparent, transparency, footerLinks }) => {
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
          <ShopBar isTransparent={isTransparent} categoryList={categoryList}/>
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
        <Footer facebookLink={footerLinks.facebook} instagramLink={footerLinks.instagram} whatsappLink={footerLinks.whatsapp}/>
      </main>
    </>
  );
};

Main.propTypes = {
  categoryList: PropTypes.array.isRequired,
  footerLinks: PropTypes.object.isRequired,
  isTransparent: PropTypes.bool,
  notice: PropTypes.string,
  transparency: PropTypes.number,
};

export default Main;
