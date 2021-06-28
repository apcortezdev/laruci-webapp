import styles from './Footer.module.scss';

const Footer = (props) => {
  return (
    <footer className={styles.footer}>
        Powered by{' '}
        <span className={styles.footer_logo}>
          ME
        </span>
    </footer>
  );
};

export default Footer;
