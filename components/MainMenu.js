import Link from 'next/link';
import styles from './MainMenu.module.scss';

const MainMenu = (props) => {
  const links = [
    { id: 'sutias', name: 'Sutiãs' },
    { id: 'calcinhas', name: 'Calcinhas' },
    { id: 'conjuntos', name: 'Conjuntos' },
    { id: 'pijamas', name: 'Pijamas' },
    { id: 'cuecas', name: 'Cuecas' },
    { id: 'acessorios', name: 'Acessórios' },
  ];

  return (
    <div className={styles.mainmenu}>
      <ul className={styles.mainmenu_list}>
        {links.map((link) => (
          <li key={link.id}>
            <Link
              href={{
                pathname: `/${link.id}`,
                // query: { category: link.id },
              }}
              passHref
            >
              <a onClick={props.onMobileClick && props.onMobileClick}>{link.name.toLowerCase()}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainMenu;
