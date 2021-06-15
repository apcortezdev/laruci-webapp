import React, { PropTypes } from 'react';
import Link from 'next/link';
import styles from '../styles/MainMenu.module.scss';

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
    <div className={styles.webmenu}>
      <nav>
        <ul>
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
    </div>
  );
};

MainMenu.propTypes = {};

export default MainMenu;
