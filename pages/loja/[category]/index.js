import Head from 'next/Head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Main from '../../../components/main/Main';
import ProductList from '../../../components/ProductList';
import Store from '../../../components/store/Store';
import Button from '../../../components/utilities/Button';
import {
  SelectColor,
  SelectText
} from '../../../components/utilities/FormComponents';
import Spin from '../../../components/utilities/Spin';
import {
  getCategories,
  getSections,
  getSocialContact,
  getTopNotice
} from '../../../data/access/appInfo';
import { getColors } from '../../../data/access/colors';
import styles from '../../../styles/loja/ListingPage.module.scss';
import { removeAccents } from '../../../validation/backValidation';


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
      '/20'
    );
  };

  // [category]/[color]/[section]/[order]/[term]/[page]/[numperpage]
  const { data, error } = useSWR(uri, productsFetcher);

  if (!data) {
    return <Spin width={64} length={64} />;
  }

  if (
    page === 1 &&
    data &&
    (data.statusCode === '404' || data.statusCode === '500')
  ) {
    return (
      <div className={styles.emptyList}>
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
    list = <ProductList productList={data.data} type="large" />;
  }

  if (
    data.lastPage ||
    typeof data.lastPage === 'undefined' ||
    page < +query.page
  )
    return <>{list}</>;

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
  sectionList,
  facebookLink,
  instagramLink,
  whatsappLink,
}) => {
  if (!category || !colorList || !sectionList) {
    return (
      <div className="center">
        <Spin width={48} length={48} />
      </div>
    );
  }

  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState('all');
  const [toggleFilter, setToggleFilter] = useState(false);
  const [query, setQuery] = useState({
    page: '',
    category: '',
    color: '',
    section: '',
    order: '',
    term: '',
  });

  useEffect(() => {
    const page = +router.query.page > 0 ? router.query.page : 1;
    const categ = category;

    let color;
    if (router.query.color) {
      color = router.query.color;
    } else {
      color = 'all';
      setSelectedColor('all');
    }

    let section;
    if (router.query.section) {
      section = router.query.section;
    } else {
      section = 'all';
      setSelectedSection('all');
    }

    let order;
    if (router.query.order) {
      order = router.query.order;
    } else {
      order = 'all';
      setSelectedSection('all');
    }

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
    setQuery((q) => ({
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

  const toggleMobileFilter = () => {
    setToggleFilter((toggle) => !toggle);
  };

  const orders = [
    { id: 'price', text: 'Menor Preço' },
    { id: '-price', text: 'Maior Preço' },
    { id: 'name', text: 'A - Z' },
    { id: '-name', text: 'Z - A' },
  ];

  return (
    <Main
      notice={notice}
      categoryList={categoryList}
      footerLinks={{
        facebook: facebookLink,
        instagram: instagramLink,
        whatsapp: whatsappLink,
      }}
    >
      <Head>
        <link
          rel="preload"
          href={`/api/loja/products/${category}/all/all/0/_/1/20`}
          as="fetch"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <Store notice={!!notice} categoryList={categoryList}>
        <div className={styles.filter}>
          <div
            className={[
              styles.filter_box,
              toggleFilter && styles.filter_box_open,
            ]
              .join(' ')
              .trim()}
          >
            <span
              className={styles.filter_icon_container}
              onClick={toggleMobileFilter}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                className={styles.icon_color}
                viewBox="0 0 16 16"
              >
                <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
              </svg>
              <span>Filtrar</span>
            </span>
            <form
              className={[styles.form, toggleFilter && styles.form_open]
                .join(' ')
                .trim()}
              onSubmit={(e) => {
                e.preventDefault();
                search(selectedColor, selectedSection, selectedOrder);
              }}
            >
              <div
                className={[styles.form_item_group, styles.form_item_group_one]
                  .join(' ')
                  .trim()}
              >
                <div className={styles.form_item}>
                  <label htmlFor="color" className={styles.form_label}>
                    Cor:
                  </label>
                  <SelectColor
                    className={[
                      styles.container_capitalized,
                      styles.selector_colors,
                    ]
                      .join(' ')
                      .trim()}
                    id="color"
                    placeholder="Todas"
                    onChange={(v) => setSelectedColor(v)}
                    colors={colorList}
                    value={
                      colorList.find((v) => v.id === selectedColor)
                        ? colorList.find((v) => v.id === selectedColor).text
                        : 'Todas'
                    }
                  />
                </div>
                <div className={styles.form_item}>
                  <label htmlFor="section" className={styles.form_label}>
                    Modelo:
                  </label>
                  <SelectText
                    className={styles.selector_sections}
                    id="section"
                    placeholder="Todos"
                    onChange={(v) => setSelectedSection(v)}
                    options={sectionList}
                    value={
                      sectionList.find((v) => v.id === selectedSection)
                        ? sectionList.find((v) => v.id === selectedSection).text
                        : 'Popular'
                    }
                  />
                </div>
              </div>
              <div
                className={[styles.form_item_group, styles.form_item_group_two]
                  .join(' ')
                  .trim()}
              >
                <div className={styles.form_item}>
                  <label htmlFor="order" className={styles.form_label}>
                    Ordem:
                  </label>
                  <SelectText
                    className={styles.selector_order}
                    id="order"
                    placeholder="Popular"
                    onChange={(v) => setSelectedOrder(v)}
                    options={orders}
                    value={
                      orders.find((v) => v.id === selectedOrder)
                        ? orders.find((v) => v.id === selectedOrder).text
                        : 'Todos'
                    }
                  />
                </div>
                <Button type="submit" className={styles.form__button}>
                  Buscar
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.content}>
          <section>{query.page > 0 && setPages(query)}</section>
        </div>
      </Store>
    </Main>
  );
};

export async function getStaticPaths() {
  const categories = await getCategories();
  const categoryMapped = categories.map((c) => ({
    params: { category: removeAccents(c.name) },
  }));
  const categoryList = [{ params: { category: 'busca' } }, ...categoryMapped];

  return {
    paths: categoryList,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const category = params.category;

  const notice = await getTopNotice();

  const sections = await getSections();

  const categories = await getCategories();

  let categorySelected;
  if (category !== 'busca') {
    try {
      categorySelected = categories.find(
        (c) => removeAccents(c.name.toLowerCase()) === category.toLowerCase()
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

  const colors = await getColors();
  const colorList = await JSON.parse(JSON.stringify(colors));

  const contato = await getSocialContact();
  const facebook = 'https://facebook.com/' + contato.facebookName;
  const instagtam = 'https://instagram.com/' + contato.instagramName;
  const whatsapp = `https://wa.me/${
    contato.whatsappNum
  }?text=${encodeURIComponent(contato.whatsappMessage)}`;

  return {
    props: {
      notice: notice,
      category: categorySelected ? categorySelected._id : 'all',
      categoryList: categories,
      facebookLink: facebook,
      instagramLink: instagtam,
      whatsappLink: whatsapp,
      colorList: colorList.map((c) => ({
        id: c._id,
        text: c.name,
        code: c.code,
      })),
      sectionList: sections.map((s) => ({
        id: s._id,
        text: s.name.toLowerCase(),
      })),
    },
  };
}

export default ListingPage;
