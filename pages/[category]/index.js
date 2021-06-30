import { useRouter } from 'next/router';
import ListingPageFilter from '../../components/ListingPageFilter';
import ProductList from '../../components/ProductList';
import styles from '../../styles/ListingPage.module.scss';

import dummy from '../api/dummy';

const ListingPage = (props) => {
  const data = dummy;

  const router = useRouter();

  const category = router.query.category;
  if (!category) {
    return <p className='center'>Loading...</p>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.aside}/>
      <div className={styles.content}>
        <ListingPageFilter />
        <ProductList category={category} list={data} />
      </div>
      <div className={styles.aside}/>
    </div>
  );
};

export default ListingPage;
