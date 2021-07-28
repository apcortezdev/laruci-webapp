import styles from '../../../styles/ListingPage.module.scss';
import ListingPageFilter from '../../../components/ListingPageFilter';
import ProductList from '../../../components/ProductList';
import Button from '../../../components/utilities/Button';
import { getColors } from '../../../data/colors';
import { getSizes } from '../../../data/sizes';
import { getCategories } from '../../../data/categories';
import { getBareProductListByCategory } from '../../../data/products';

const ListingPage = ({ category, data, colorList, sizesList }) => {
  if (!data || !category || !colorList || !sizesList) {
    return <p className="center">Loading...</p>;
  }

  const loadNextPage = () => {};

  return (
    <>
      <ListingPageFilter colorList={colorList} sizesList={sizesList} />
      <ProductList list={data} type="page" />
      <section>
        <Button className={styles.loadbutton} onClick={loadNextPage}>
          Carregar Mais
        </Button>
      </section>
    </>
  );
};

export async function getStaticPaths() {
  const categories = await getCategories();
  const categoryList = categories.map((c) => ({ params: { category: c.id } }));
  return {
    paths: categoryList,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const category = params.category;

  const colors = await getColors();
  const sizes = await getSizes();
  const data = await getBareProductListByCategory(category);

  return {
    props: {
      category: category,
      data: data,
      colorList: colors,
      sizesList: sizes,
    },
  };
}

export default ListingPage;
