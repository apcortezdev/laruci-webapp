import Link from 'next/link';
import styles from '../styles/ShopBar.module.scss';

const ShopBar = (props) => {
  const links = [
    { id: 'home', name: 'Home' },
    { id: 'contact', name: 'Contato' },
  ];

  return (
    <div className={styles.shopbar}>
      <div className={styles.shopbar_inner}>
        <nav>
          <ul className={styles.shopbar_nav}>
            {links.map((link) => (
              <li key={link.id} className={styles.shopbar_nav__item}>
                <Link
                  href={{
                    pathname: '/',
                    query: { id: link.id },
                  }}
                >
                  {link.name.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <span>
          <input type="text" />
        </span>
      </div>
    </div>
  );
};

export default ShopBar;
