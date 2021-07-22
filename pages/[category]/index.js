import ListingPageFilter from '../../components/ListingPageFilter';
import ProductList from '../../components/ProductList';
import styles from '../../styles/ListingPage.module.scss';
import { getColors } from '../../data/colors';
import { getSizes } from '../../data/sizes';
import { getCategories } from '../../data/categories';
import { getListProductsByCategory } from '../../data/products';
import Store from '../../components/store/Store';
import Main from '../../components/main/Main';

const ListingPage = ({ category, data, colorList, sizesList }) => {
  if (!data || !category || !colorList || !sizesList) {
    return <p className="center">Loading...</p>;
  }

  return (
    <Main>
      <Store>
        <ListingPageFilter colorList={colorList} sizesList={sizesList} />
        <ProductList category={category} list={data} />
      </Store>
    </Main>
  );
};

export async function getStaticPaths() {
  const categories = getCategories();
  const categoryList = categories.map((c) => ({ params: { category: c.id } }));
  return {
    paths: categoryList,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const category = params.category;

  const colors = getColors();
  const sizes = getSizes();

  const data = getListProductsByCategory(category);

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
