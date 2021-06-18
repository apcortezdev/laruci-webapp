import styles from '../../styles/ShopNav.module.scss';
import Link from 'next/link';

const ShopNav = (props) => {
  const links = [
    { id: '', name: 'Home' },
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
                pathname: `/${link.id}`,
              }}
              passHref
            >
              <a onClick={props.onMobileClick && props.onMobileClick}>
                {link.name.toUpperCase()}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ShopNav;
