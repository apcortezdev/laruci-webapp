import Link from 'next/link';
import styles from './Admin.module.scss';

const Admin = (props) => {
  if (!props.children) {
    return <p>Loading</p>;
  }
  return (
    <div className={styles.main}>
      <div className={styles.main_menu}>
        <ul>
          <li>
            <div className={styles.dropdown}>
              <span>Site</span>
              <div className={styles.dropdown_content}>
                <Link href={{ pathname: '/admin/banners/' }} passHref>
                  <a>Banners</a>
                </Link>
                <Link href={{ pathname: '/admin/banners/' }} passHref>
                  <a>Aviso</a>
                </Link>
                <Link href={{ pathname: '/admin/contato/' }} passHref>
                  <a>Contato</a>
                </Link>
              </div>
            </div>
          </li>
          <li>
            <div className={styles.dropdown}>
              <span>Produtos</span>
              <div className={styles.dropdown_content}>
                <Link href={{ pathname: '/admin/banners/' }} passHref>
                  <a>Produtos</a>
                </Link>
                <Link href={{ pathname: '/admin/banners/' }} passHref>
                  <a>Categorias</a>
                </Link>
                <Link href={{ pathname: '/admin/banners/' }} passHref>
                  <a>Cores</a>
                </Link>
                <Link href={{ pathname: '/admin/banners/' }} passHref>
                  <a>Tamanhos</a>
                </Link>
                <Link href={{ pathname: '/admin/banners/' }} passHref>
                  <a>Frete</a>
                </Link>
              </div>
            </div>
          </li>
          <li>
            <div className={styles.dropdown}>
              <span>Vendas</span>
              <div className={styles.dropdown_content}>
                <Link href={{ pathname: '/admin/banners/' }} passHref>
                  <a>Resumo</a>
                </Link>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div>{props.children}</div>
    </div>
  );
};

export default Admin;
