import { useEffect, useState } from 'react';
import Head from 'next/Head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
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
import { getSectionsJSON } from '../../../data/sections';

const productsFetcher = async (uri) => {
  const products = await fetch(uri);
  return await products.json();
};

const Page = ({ page, query, onSearch }) => {
  const uri = () => {
    if (
      typeof query.category === 'undefined' ||
      typeof query.color === 'undefined' ||
      typeof query.section === 'undefined' ||
      typeof query.order === 'undefined' ||
      typeof query.term === 'undefined' ||
      typeof query.page === 'undefined'
    ) {
      return false;
    }
    return (
      '/api/loja/products/' +
      (query.category || 'all') +
      '/' +
      (query.color || 'all') +
      '/' +
      (query.section || 'all') +
      '/' +
      (query.order || '0') +
      '/' +
      (query.term || '0') +
      '/' +
      (page || 1) +
      '/3'
    );
  };

  // [category]/[color]/[section]/[order]/[term]/[page]/[numperpage]
  const { data, error } = useSWR(uri, productsFetcher);

  if (!data) {
    return (<Spin width={64} length={64} />);
  }

  if (
    page === 1 &&
    data &&
    (data.statusCode === '404' || data.statusCode === '500')
  ) {
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

  let list;
  if (data.data && data.data.length > 0) {
    list = <ProductList productList={data.data} type="page" />;
  }

  if (data.lastPage || typeof data.lastPage === 'undefined' || page < +query.page) return <>{list}</>;

  return (
    <>
      {list}
      <div>
        <section>
          <Button
            className={styles.loadbutton}
            onClick={(e) => {
              e.preventDefault();
              onSearch(
                query.color,
                query.section,
                query.order,
                +query.page + 1
              );
            }}
          >
            Carregar Mais
          </Button>
        </section>
      </div>
    </>
  );
};

const ListingPage = ({
  notice,
  category,
  categoryList,
  colorList,
  sizeList,
  sectionList,
}) => {
  if (!category || !colorList || !sizeList || !sectionList) {
    return (
      <div className="center">
        <Spin width={48} length={48} />
      </div>
    );
  }
  const router = useRouter();
  const [query, setQuery] = useState({
    page: '',
    category: '',
    color: '',
    section: '',
    order: '',
    term: '',
  });

  useEffect(() => {
    console.log('RE-RENDERED');
    const page = +router.query.page > 0 ? router.query.page : 1;
    const categ = category;
    const color =
    router.query.color ? router.query.color : 'all';
    const section =
      router.query.section ? router.query.section : 'all';
    const order =
      router.query.order ? router.query.order : 0;
    const term = router.query.term ? router.query.term : '';
    setQuery({
      page: page,
      category: categ,
      color: color,
      section: section,
      order: order,
      term: term,
    });
  }, [category, router.query]);

  const search = (selectedColor, selectedSection, selectedOrder, page = 1) => {
    const pathname =
      category === 'all'
        ? '/loja/busca'
        : `/loja/${categoryList.find((c) => c._id === category).name}`;
    setQuery(q =>
      ({
      page: +page,
      category: category,
      color: selectedColor,
      section: selectedSection,
      order: selectedOrder,
      term: q.term,
    }));
    let newQuery = {};
    if (page > 1) newQuery.page = page;
    if (selectedColor.length > 0 && selectedColor !== 'all')
      newQuery.color = selectedColor;
    if (selectedSection.length > 0 && selectedSection !== 'all')
      newQuery.section = selectedSection;
    if (selectedOrder > 1) newQuery.order = selectedOrder;
    if (query.term.length > 0) newQuery.term = query.term;

    router.push(
      {
        pathname: pathname,
        query: newQuery,
      },
      null,
      {
        scroll: false,
      }
    );
  };

  const setPages = (query) => {
    let pages = [];
    for (let i = 0; i < query.page; i++) {
      pages.push(<Page key={i} page={i + 1} query={query} onSearch={search} />);
    }
    return pages;
  };

  return (
    <Main notice={notice} categoryList={categoryList}>
      <Head>
        <link
          rel="preload"
          href={`/api/loja/products/${category}/all/all/0/_/1/25`}
          as="fetch"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <Store notice={!!notice} categoryList={categoryList}>
        <ListingPageFilter
          colors={colorList}
          sections={sectionList}
          onSearch={search}
        />
        <div className={styles.content}>
          <section>{query.page > 0 && setPages(query)}</section>
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

  const sections = await getSectionsJSON();
  const sectionList = await JSON.parse(sections);

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
      sectionList: sectionList,
    },
  };
}

export default ListingPage;
