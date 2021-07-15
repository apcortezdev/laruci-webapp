import styles from './ShopNav.module.scss';
import Link from 'next/link';

const ShopNav = (props) => {
  const links = [
    { id: 'sobre', name: 'Sobre Nós' },
    { id: 'contato', name: 'Contato' },
    { id: 'medidas', name: 'Medidas' },
  ];

  return (
    <nav className={styles.container}>
      <Link
        href={{
          pathname: '/',
        }}
      >
        <a className={styles.webnav_logo}>Laruci</a>
      </Link>
      <ul className={styles.webnav_list}>
        {links.map((link) => (
          <li key={link.id} className={styles.webnav__item}>
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
