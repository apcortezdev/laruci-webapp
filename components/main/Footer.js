import Link from 'next/link';
import styles from './Footer.module.scss';

const Footer = ({ className }) => {
  return (
    <footer className={[styles.footer, className].join(' ').trim()}>
      <div>
        <p className={styles.logo}>Laruci</p>
        <div
          className={[styles.flex, styles.flex_row, styles.flex_j_center].join(
            ' '
          )}
        >
          <div
            className={[
              styles.flex,
              styles.flex_a_center,
              styles.flex_column,
              styles.marginh3rem,
              styles.section,
            ].join(' ')}
          >
            <p>INFORMAÇÕES</p>
            <p>
              <Link
                href={{
                  pathname: '/loja/sobre',
                }}
              >
                <a className={styles.link}>Quem somos</a>
              </Link>
            </p>
            <p>
              <Link
                href={{
                  pathname: '/loja/contato',
                }}
              >
                <a className={styles.link}>Contato</a>
              </Link>
            </p>
            <p>
              <Link
                href={{
                  pathname: '/loja/medidas',
                }}
              >
                <a className={styles.link}>Medidas</a>
              </Link>
            </p>
          </div>
          <div
            className={[
              styles.flex,
              styles.flex_a_center,
              styles.flex_column,
              styles.marginh3rem,
              styles.section,
            ].join(' ')}
          >
            <p>AJUDA</p>
            <p>
              <Link
                href={{
                  pathname: '/loja/ajuda/devolucoes',
                }}
              >
                <a className={styles.link}>Devoluções</a>
              </Link>
            </p>
            <p>
              <Link
                href={{
                  pathname: '/loja/ajuda/frete',
                }}
              >
                <a className={styles.link}>Frete</a>
              </Link>
            </p>
            <p>
              <Link
                href={{
                  pathname: '/loja/ajuda/pagamento',
                }}
              >
                <a className={styles.link}>Pagamento</a>
              </Link>
            </p>
            <p>
              <Link
                href={{
                  pathname: '/loja/ajuda/politicas',
                }}
              >
                <a className={styles.link}>Politicas do site</a>
              </Link>
            </p>
          </div>
          <div
            className={[
              styles.flex,
              styles.flex_a_center,
              styles.flex_column,
              styles.marginh3rem,
              styles.section,
            ].join(' ')}
          >
            <p>ACESSO</p>
            <p>
              <Link
                href={{
                  pathname: '/loja/sobre',
                }}
              >
                <a className={styles.link}>Devoluções</a>
              </Link>
            </p>
            <p>
              <Link
                href={{
                  pathname: '/loja/contato',
                }}
              >
                <a className={styles.link}>Frete</a>
              </Link>
            </p>
            <p>
              <Link
                href={
                  'https://www.procon.sp.gov.br/'
                }
              >
                <a rel="noreferrer noopener" target={'_blank'}>
                  Procon SP
                </a>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div>
        Preços e consições de pagamento exclusivos para compras pelo site. Todas
        as ofertas são válidas até o término do estoque disponível para vendas
        pela internet. Todas as vendas são sujeitas à análise e confirmação dos
        dados do consumidor.
      </div>
    </footer>
  );
};

export default Footer;
