import styles from './Footer.module.scss';

const Footer = ({ className }) => {
  return (
    <footer className={[styles.footer, className].join(' ')}>
      Powered by <span className={styles.footer_logo}>ME</span>
    </footer>
  );
};

export default Footer;
