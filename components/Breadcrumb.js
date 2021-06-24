import styles from '../styles/Breadcrumb.module.scss';
import Link from 'next/link';

const Breadcrumb = (props) => {
  const query = props.query;

  let html_list = [
    <span key={'/'} className={styles.breadcrumb_item}>
      <Link href={'/'}>página inicial</Link>
    </span>,
  ];

  for (const key in query) {
    html_list.push(
      <span key={`/${query[key]}`} className={styles.breadcrumb_item}>
        {' > '}
        <Link href={`/${query[key]}`}>{query[key]}</Link>
      </span>
    );
  }

  html_list.pop();
  return <span className={styles.breadcrumb}>{html_list}</span>;
};

export default Breadcrumb;
