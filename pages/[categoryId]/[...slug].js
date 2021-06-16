import { useRouter } from 'next/router';

const CategoryPage = (props) => {
  const router = useRouter();

  return <div>{router.query.categoryId}</div>;
};

export default CategoryPage;
