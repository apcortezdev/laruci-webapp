import Link from 'next/link';
import styles from '../../styles/Logo.module.scss';

const Header = () => {
  return (
    <div className={styles.logobox}>
      <Link href="/">
        <a>
          <div className={styles.logobox_img} />
        </a>
      </Link>
    </div>
  );
};

export default Header;
