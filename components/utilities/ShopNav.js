import styles from '../../styles/ShopNav.module.scss';
import Link from 'next/link';

const ShopNav = () => {
  const links = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'Sobre Nós' },
    { id: 'contact', name: 'Contato' },
  ];

  return (
    <nav className={styles.webnav}>
      <ul className={styles.webnav_list}>
        {links.map((link) => (
          <li key={link.id} className={styles.webnav__item}>
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
  );
};

export default ShopNav;
