import styles from './ShopNav.module.scss';
import Link from 'next/link';

const ShopNav = (props) => {
  const links = [
    { id: '', name: 'Home' },
    { id: 'about', name: 'Sobre Nós' },
    { id: 'contact', name: 'Contato' },
    { id: 'sizes', name: 'Tamanhos' },
  ];

  return (
    <nav className={styles.webnav}>
      <ul className={styles.webnav_list}>
        {links.map((link) => (
          <li
            key={link.id}
            className={[
              styles.webnav__item,
              !!link.id || styles.webnav__item_home,
            ].join(' ')}
          >
            <Link
              href={{
                pathname: `/${link.id}`,
              }}
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
