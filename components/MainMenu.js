import Link from 'next/link';
import styles from '../styles/MainMenu.module.scss';

const MainMenu = () => {
  const links = [
    { id: 'sutias', name: 'Sutiãs' },
    { id: 'calcinhas', name: 'Calcinhas' },
    { id: 'conjuntos', name: 'Conjuntos' },
    { id: 'pijamas', name: 'Pijamas' },
    { id: 'cuecas', name: 'Cuecas' },
    { id: 'acessorios', name: 'Acessórios' },
  ];

  return (
    <nav className={styles.webmenu}>
      <ul className={styles.webmenu_list}>
        {links.map((link) => (
          <li key={link.id}>
            <Link
              href={{
                pathname: '/',
                query: { id: link.id },
              }}
            >
              {link.name.toLowerCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainMenu;
