import { useEffect, useState } from 'react';
import Head from 'next/Head';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import styles from '../../../styles/loja/ListingPage.module.scss';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import ListingPageFilter from '../../../components/ListingPageFilter';
import ProductList from '../../../components/ProductList';
import Button from '../../../components/utilities/Button';
import Spin from '../../../components/utilities/Spin';
import { getMainSizeSetsJSON } from '../../../data/sizeSets';
import { getCategoriesJSON } from '../../../data/categories';
import { getColorsJSON } from '../../../data/colors';
import { getCurrentNotice } from '../../../data/notice';

const productsFetcher = async (uri) => {
  const products = await fetch(uri);
  return await products.json();
};

const Page = ({ index, query }) => {
  const uri = () => {
    if (
      typeof query.category === 'undefined' ||
      typeof query.color === 'undefined' ||
      typeof query.size === 'undefined' ||
      typeof query.order === 'undefined' ||
      typeof query.page === 'undefined'
    ) {
      return false;
    }
    return (
      '/api/loja/products/' +
      query.category +
      '/' +
      query.color +
      '/' +
      query.size +
      '/' +
      query.order +
      '/_/' +
      query.page +
      '/25'
    );
  };

  // category/color/size/order/term/page/numperpage
  const { data, error, isValidating } = useSWR(uri, productsFetcher);

  console.log('data');
  console.log(data);

  if (!data) {
    return (
      <div>
        <Spin width={64} length={64} />
      </div>
    );
  }

  if (data && (data.statusCode === '404' || data.statusCode === '500')) {
    return (
      <div>
        <p>
          Poxa, sua pesquisa não retornou nenhum resultado.
          <br />
          Mas não se preocupe, logo teremos novidades para você!
        </p>
      </div>
    );
  }

  return (
    <div>
      <ProductList productList={data.data} type="page" />
    </div>
  );
};

const ListingPage = ({
  notice,
  category,
  categoryList,
  colorList,
  sizeList,
}) => {
  if (!category || !colorList || !sizeList) {
    return (
      <div className="center">
        <Spin width={48} length={48} />
      </div>
    );
  }

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [err, setErr] = useState();
  const [query, setQuery] = useState({
    page: 1,
    category: category,
    color: '',
    size: '',
    order: '',
  });

  useEffect(() => {
    setQuery({
      page: router.query.page,
      category: category,
      color: router.query.color,
      size: router.query.size,
      order: router.query.order,
    });
  }, [category, router.query]);

  const search = (selectedColor, selectedSize, selectedOrder, page = 1) => {
    const pathname =
      category === 'all'
        ? '/loja/busca'
        : `/loja/${categoryList.find((c) => c._id === category).name}`;
    setQuery({
      page: +page,
      category: category,
      color: selectedColor,
      size: selectedSize,
      order: selectedOrder,
    });
    router.push({
      pathname: pathname,
      query: {
        page: page,
        color: selectedColor,
        size: selectedSize,
        order: selectedOrder,
      },
    });
  };

  const setPages = (query) => {
    let pages = [];
    for (let i = 0; i < query.page; i++) {
      pages.push(<Page index={i} key={i} query={query} />);
    }
    return pages;
  };

  return (
    <Main notice={notice} categoryList={categoryList}>
      <Head>
        <link
          rel="preload"
          href={`/api/loja/products/${category === 'all' ? 'busca' : category}/all/all/0/_/1/25`}
          as="fetch"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <Store notice={!!notice} categoryList={categoryList}>
        <ListingPageFilter
          colors={colorList}
          sizes={sizeList}
          onSearch={search}
        />
        <div className={styles.content}>
          {isLoading ? (
            <Spin width={48} length={48} />
          ) : err ? (
            <p>
              Ops, isso é estranho, mas parece que ocorreu um erro.
              <br />
              Por favor, tente mais tarde.
            </p>
          ) : (
            <>
              <section>{query.page > 0 && setPages(query)}</section>
              {!lastPage && (
                <section>
                  <Button
                    className={styles.loadbutton}
                    onClick={() =>
                      search(
                        query.color,
                        query.size,
                        query.order,
                        +query.page++
                      )
                    }
                  >
                    Carregar Mais
                  </Button>
                </section>
              )}
            </>
          )}
        </div>
      </Store>
    </Main>
  );
};

export async function getStaticPaths() {
  const categories = await getCategoriesJSON();
  const catList = await JSON.parse(categories);
  const categoryMapped = catList.map((c) => ({ params: { category: c.name } }));
  const categoryList = [{ params: { category: 'busca' } }, ...categoryMapped];

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

  let categorySelected;
  if (category !== 'busca') {
    try {
      categorySelected = categoryList.find(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      );
    } catch (err) {
      return {
        notFound: true,
      };
    }
    if (
      typeof categorySelected === 'undefined' ||
      categorySelected === null ||
      categorySelected === ''
    ) {
      return {
        notFound: true,
      };
    }
  }

  const colors = await getColorsJSON();
  const ColorList = await JSON.parse(colors);

  return {
    props: {
      notice: noticeText,
      category: categorySelected ? categorySelected._id : 'all',
      categoryList: categoryList,
      colorList: ColorList,
      sizeList: sizeSetsList[0].sizes.map((c) => ({ _id: c, text: c })),
    },
  };
}

export default ListingPage;
