import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import styles from '../../../styles/ListingPage.module.scss';
import ListingPageFilter from '../../../components/ListingPageFilter';
import ProductList from '../../../components/ProductList';
import Button from '../../../components/utilities/Button';
import { getSizes } from '../../../data/sizes';
import { getCategoriesJSON } from '../../../data/categories';
import { getColorsJSON } from '../../../data/colors';
import { getBareProductListByCategory } from '../../../data/products';

const ListingPage = ({
  notice,
  category,
  categoryList,
  data,
  colorList,
  sizeList,
}) => {
  if (!data || !category || !colorList || !sizeList) {
    return <p className="center">Loading...</p>;
  }

  const loadNextPage = () => {};

  return (
    <Main notice={notice} categoryList={categoryList}>
      <Store notice={!!notice} categoryList={categoryList}>
        <ListingPageFilter colors={colorList} sizes={sizeList} />
        <ProductList list={data} type="page" />
        <section>
          <Button className={styles.loadbutton} onClick={loadNextPage}>
            Carregar Mais
          </Button>
        </section>
      </Store>
    </Main>
  );
};

export async function getStaticPaths() {
  const categories = await getCategoriesJSON();
  const catList = await JSON.parse(categories);
  const categoryList = catList.map((c) => ({ params: { category: c.name } }));
  return {
    paths: categoryList,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const category = params.category;

  const sizes = await getSizes();
  const data = await getBareProductListByCategory(category);

  const categories = await getCategoriesJSON();
  const catList = await JSON.parse(categories);

  const colors = await getColorsJSON();
  const ColorList = await JSON.parse(colors);

  return {
    props: {
      notice: '',
      category: category,
      categoryList: catList,
      data: data,
      colorList: ColorList,
      sizeList: sizes,
    },
  };
}

export default ListingPage;
