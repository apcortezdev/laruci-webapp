import { useState } from 'react';
import Head from 'next/Head';
import Store from '../../../components/store/Store';
import Main from '../../../components/main/Main';
import Breadcrumb from '../../../components/Breadcrumb';
import ShipmentCalc from '../../../components/ShipmentCalc';
import Button from '../../../components/utilities/Button';
import ImageShow from '../../../components/utilities/ImageShow';
import SizeSelector from '../../../components/utilities/SizeSelector';
import ProductList from '../../../components/ProductList';
import ProductListItemCard from '../../../components/utilities/ProductListItemCard';
import styles from '../../../styles/ProductPage.module.scss';
import { getSizes } from '../../../data/sizes';
import { getCategories } from '../../../data/categories';
import {
  getBareProductListByCategory,
  getCompleteProductById,
  getBareProductListById,
} from '../../../data/products';
import { Input } from '../../../components/utilities/FormComponents';

const ProductPage = ({
  title,
  canonical,
  prodId,
  prodCategory,
  allSizes,
  data,
  relatedProducts,
}) => {
  const product = data;
  const newPrice = !!product.discount
    ? product.price * (1 - product.discount / 100)
    : false;

  const [selectedColorSet, setSelectedColorSet] = useState(
    Object.keys(product.sets)[0]
  );

  const [selectedColorSet_images, setSelectedColorSet_images] = useState(
    product.sets[selectedColorSet].images
  );

  const htmlColors = Object.keys(product.sets).map((color) => (
    <div
      key={color}
      className={[
        styles.color,
        color === selectedColorSet ? styles.colorSelected : '',
      ]
        .join(' ')
        .trim()}
      style={{ backgroundColor: color }}
      onClick={setImagesToSlideShow.bind(this, color)}
    />
  ));

  const prepareRelatedListHtml = (list) => {
    let html = [];
    for (const key in list) {
      if (Object.hasOwnProperty.call(list, key)) {
        const element = list[key];
        html.push(
          <ProductListItemCard
            category={prodCategory}
            key={'related_' + key}
            prodId={key}
            product={element}
          />
        );
      }
    }
    return html;
  };

  function openSizesGuide() {}

  function setImagesToSlideShow(color) {
    setSelectedColorSet(color);
    setSelectedColorSet_images(product.sets[color].images);
  }

  const [sizeType, setSizeType] = useState('UNIQUE');
  const onChangeSizeType = (event) => {
    setSizeType(event.target.value);
    console.log(event.target.value);
  };

  return (
    <>
      <Head>
        <title>{`${title} - ${product.name}`}</title>
        <meta
          name="description"
          content={`Tamanhos especiais: ${product.name} - ${product.shortDescription}`}
        />
        <link href={canonical} rel="canonical" />
      </Head>
      <Main>
        <Store>
          <div className={styles.contentbox}>
            <div className={styles.bredcrumb_container}>
              <Breadcrumb
                query={[prodCategory, prodId]}
                current={product.name}
              />
            </div>
            <div className={styles.product_content_side}>
              <div className={styles.imageshow__container}>
                <ImageShow images={selectedColorSet_images} />
              </div>
              <div className={styles.details}>
                <span className={styles.font_hightlight}>{product.name}</span>
                <section
                  className={[
                    styles.section_details,
                    styles.details__description,
                  ]
                    .join(' ')
                    .trim()}
                >
                  {product.shortDescription}
                </section>
                <span className={styles.price_line}>
                  <span className={styles.price_side}>
                    {!!newPrice ? (
                      <>
                        de R$ {product.price.toFixed(2)} por{' '}
                        <span className={styles.font_price__price}>
                          R$ {newPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <>
                        por somente{' '}
                        <span className={styles.font_price__price}>
                          R$ {product.price.toFixed(2)}
                        </span>
                      </>
                    )}
                  </span>
                  {!!newPrice && (
                    <span
                      className={[
                        styles.font_price__price,
                        styles.font_discount,
                      ]
                        .join(' ')
                        .trim()}
                    >
                      -{product.discount}%
                    </span>
                  )}
                </span>
                <section
                  className={[
                    styles.section_details,
                    styles.section_colors,
                  ].join(' ')}
                >
                  Cores:
                  <div className={styles.imageshow__colors}>{htmlColors}</div>
                </section>
                <section
                  className={[
                    styles.section_details,
                    styles.section_sizes,
                  ].join(' ')}
                >
                  <p>
                    Medidas:
                    <span onClick={openSizesGuide}>Guia de medidas aqui!</span>
                  </p>
                  {!!product.sets[selectedColorSet].uniqueSizes && (
                    <div
                      className={
                        sizeType === 'UNIQUE' ? styles.selectedSizeSet : ''
                      }
                    >
                      <label htmlFor="unique_size" onChange={onChangeSizeType}>
                        <Input
                          id="unique_size"
                          type="radio"
                          name="size_type"
                          value="UNIQUE"
                        />
                        <span>Única:</span>
                      </label>
                      <span>
                        <SizeSelector
                          keyName="uniqueSizes"
                          availableSizeList={
                            sizeType === 'UNIQUE'
                              ? product.sets[selectedColorSet].uniqueSizes
                              : []
                          }
                          fullSizeList={allSizes}
                        />
                      </span>
                    </div>
                  )}
                  {!!product.sets[selectedColorSet].specialSizes && (
                    <div
                      className={
                        sizeType === 'SPECIAL' ? styles.selectedSizeSet : ''
                      }
                    >
                      <label htmlFor="special_size" onChange={onChangeSizeType}>
                        <Input
                          id="special_size"
                          type="radio"
                          name="size_type"
                          value="SPECIAL"
                        />
                        <span>Especial:</span>
                      </label>
                      <div>
                        {product.sets[selectedColorSet].specialSizes.map(
                          (op) => (
                            <div key={op.name} className={styles.specialSizes}>
                              <span>{op.name}:</span>
                              <span>
                                <SizeSelector
                                  keyName={op.name}
                                  availableSizeList={
                                    sizeType === 'SPECIAL' ? op.sizes : []
                                  }
                                  fullSizeList={allSizes}
                                />
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </section>
                <section
                  className={[
                    styles.section_details,
                    styles.section_details__buybtn,
                  ]
                    .join(' ')
                    .trim()}
                >
                  <span className={styles.section_btnline}>
                    <Button
                      className={styles.section_btnline__iconbtnsize}
                      tip={'Adicionar à sacola'}
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        className={styles.bag_icon_plus}
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z"
                        />
                      </svg>
                    </Button>
                    <Button
                      className={styles.section_btnline__btnsize}
                      type="button"
                    >
                      Comprar
                    </Button>
                  </span>
                </section>
              </div>
            </div>
            <div className={styles.product_content_bottom}>
              <section className={styles.section_details}>
                <ShipmentCalc />
              </section>
              <section
                className={[styles.section_details, styles.details__description]
                  .join(' ')
                  .trim()}
              >
                <span className={styles.section_title}>
                  Descrição do Produto:
                </span>
                {product.longDescription}
              </section>
              <section
                className={[styles.section_details, styles.details__description]
                  .join(' ')
                  .trim()}
              >
                <span className={styles.section_title}>Ofertas Similares:</span>
                <ProductList
                  category={prodCategory}
                  list={relatedProducts}
                  type="carousel"
                />
              </section>
            </div>
          </div>
        </Store>
      </Main>
    </>
  );
};

export async function getStaticPaths() {
  const categories = await getCategories();

  let pathList = [];

  for (const category of categories) {
    const products = await getBareProductListByCategory(category.id);
    for (const key in products) {
      pathList.push({ params: { category: category.id, product: key } });
    }
  }

  return {
    paths: pathList,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const category = params.category;
  const productId = params.product;
  const sizeList = await getSizes();
  const data = await getCompleteProductById(productId);
  const relatedProducts = await getBareProductListById(data.relatedProducts);

  return {
    props: {
      title: 'Laruci',
      canonical: `http://localhost:3000/${category}/${productId}`,
      prodCategory: category,
      prodId: productId,
      allSizes: sizeList,
      data: data,
      relatedProducts: relatedProducts,
    },
  };
}

export default ProductPage;
