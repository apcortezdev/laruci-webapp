import { useRouter } from 'next/router';
import styles from '../../styles/Categories.module.scss';

const CategoryPage = (props) => {
  const router = useRouter();

  const route = router.query;
  console.log(router.query);
  return <div className={styles.main}>Category Page</div>;
};

export default CategoryPage;
