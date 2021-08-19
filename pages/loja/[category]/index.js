import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import styles from '../../../styles/loja/ListingPage.module.scss';
import ListingPageFilter from '../../../components/ListingPageFilter';
import ProductList from '../../../components/ProductList';
import Button from '../../../components/utilities/Button';
import { getMainSizeSetsJSON } from '../../../data/sizeSets';
import { getCategoriesJSON } from '../../../data/categories';
import { getColorsJSON } from '../../../data/colors';
import { getCurrentNotice } from '../../../data/notice';
import { getProductListingByCategoryJSON } from '../../../data/products';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ListingPage = ({
  notice,
  category,
  categoryList,
  productList,
  colorList,
  sizeList,
}) => {
  if (!category || !colorList || !sizeList || !productList) {
    return <p className="center">Loading...</p>;
  }

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [prodList, setProdList] = useState(productList);
  const [lastPage, setLastPage] = useState(false);

  useEffect(() => {
    setProdList(productList);
  }, []);

  const loadPage = async () => {
    setIsLoading(true);
    const pag = page;
    const products = await fetch(
      `/api/admin/products/list/${category._id}/${pag + 1}/20`
    );

    const data = await products.json();

    switch (products.status) {
      case 200:
        setProdList((prods) => [...prods, ...data.productList]);
        setLastPage(data.lastPage);
        break;
      case 404:
      case 400:
      case 500:
      default:
        window.alert('Ops, Erro interno! Por favor, contate o Administrador.');
        break;
    }
    setPage((page) => page++);
    setIsLoading(false);
  };

  return (
    <Main notice={notice} categoryList={categoryList}>
      <Store notice={!!notice} categoryList={categoryList}>
        <ListingPageFilter colors={colorList} sizes={sizeList} />
        {prodList.length > 0 ? (
          <>
            <ProductList
              productList={prodList}
              category={category}
              type="page"
            />
            {isLoading && <p>{'Carregando...'}</p>}
            {!lastPage && (
              <section>
                <Button className={styles.loadbutton} onClick={loadPage}>
                  Carregar Mais
                </Button>
              </section>
            )}
          </>
        ) : (
          <p>{'Ops, isso é estranho, mas parece que ocorreu um erro =('}</p>
        )}
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

  const notice = await getCurrentNotice();
  let noticeText = notice ? notice.text : '';

  const sizes = await getMainSizeSetsJSON();
  const sizeSetsList = await JSON.parse(sizes);

  const categories = await getCategoriesJSON();
  const categoryList = await JSON.parse(categories);

  const categorySelected = categoryList.find(
    (c) => c.name.toLowerCase() === category.toLowerCase()
  );

  const products = await getProductListingByCategoryJSON(categorySelected._id);
  const productList = await JSON.parse(products);

  const colors = await getColorsJSON();
  const ColorList = await JSON.parse(colors);

  return {
    props: {
      notice: noticeText,
      category: categorySelected,
      productList: productList,
      categoryList: categoryList,
      colorList: ColorList,
      sizeList: sizeSetsList[0].sizes.map((c) => ({ _id: c, text: c })),
    },
  };
}

export default ListingPage;
