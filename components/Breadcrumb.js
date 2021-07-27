import styles from './Breadcrumb.module.scss';
import Link from 'next/link';
import PropTypes from 'prop-types';

const Breadcrumb = ({ query, current }) => {
  const queryPage = query;

  let html_list = [
    <span key={'/'} className={styles.breadcrumb_item}>
      <Link href={'/'}>início</Link>
    </span>,
  ];

  queryPage.slice(0, -1).forEach((page) => {
    html_list.push(
      <span key={`/loja/${page}`} className={styles.breadcrumb_item}>
        {' > '}
        <Link href={`/loja/${page}`}>{page}</Link>
      </span>
    );
  });

  html_list.push(
    <span key={current} className={styles.breadcrumb_current}>{' > ' + current}</span>
  );

  return <span className={styles.breadcrumb}>{html_list}</span>;
};

Breadcrumb.propTypes = {
  query: PropTypes.array,
  current: PropTypes.string,
};

export default Breadcrumb;
