import { useRouter } from 'next/router';
import ProductList from '../../components/ProductList';
import styles from '../../styles/ListingPage.module.scss';

import dummy from '../api/dummy';

const ListingPage = (props) => {
  const data = dummy;

  const router = useRouter();

  const route = router.query;

  return (
    <div className={styles.main}>
      <div className={styles.aside}/>
      <div className={styles.content}>
        <ProductList category={route.category} list={data} />
      </div>
      <div className={styles.aside}/>
    </div>
  );
};

export default ListingPage;
