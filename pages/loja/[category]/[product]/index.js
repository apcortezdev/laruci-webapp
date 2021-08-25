import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/Head';
import { useRouter } from 'next/router';
import BagContext from '../../../../store/bag-context';
import Main from '../../../../components/main/Main';
import Store from '../../../../components/store/Store';
import Breadcrumb from '../../../../components/Breadcrumb';
import ShipmentCalc from '../../../../components/ShipmentCalc';
import Button from '../../../../components/utilities/Button';
import ImageShow from '../../../../components/utilities/ImageShow';
import SizeSelector from '../../../../components/utilities/SizeSelector';
import ProductList from '../../../../components/ProductList';
import ConfirmationDialog from '../../../../components/utilities/ConfirmationDialog';
import {
  InputRadio,
  InputNumber,
} from '../../../../components/utilities/FormComponents';

import styles from '../../../../styles/loja/ProductPage.module.scss';
import { getCategoriesJSON } from '../../../../data/categories';
import {
  getProductListingByCategoryJSON,
  getProductIdsByCategoryJSON,
  getProductByIdJSON,
} from '../../../../data/products';
import { getCurrentNotice } from '../../../../data/notice';

const ProductPage = ({
  notice,
  title,
  canonical,
  categoryList,
  product,
  relatedProducts,
}) => {
  const router = useRouter();
  const newPrice = !!product.discountPercentage
    ? product.price.toFixed(2) * (1 - product.discountPercentage / 100)
    : false;

  // Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [okText, setOkText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // INPUT OPTIONS FOR PURCHASE: - START
  // COLOR
  const [selectedSet, setSelectedSet] = useState(product.sets[0]);
  const [selectedSetValidator, setSelectedSetValidator] = useState(true);

  // SIZES
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSizesValidator, setSelectedSizesValidator] = useState(true);

  // EXTRAS
  const [selectedExtras, setSelectedExtras] = useState({});
  const [selectedExtrasValidator, setSelectedExtrasValidator] = useState(true);
  const onSelectedExtrasHandler = (name, value) => {
    setSelectedExtras((options) => ({ ...options, [name]: value }));
    setSelectedExtrasValidator(true);
  };

  // QUANTITY
  const [quantity, setQuantity] = useState(1);
  const [quantityValidator, setQuantityValidator] = useState(true);
  const onChangeQuantity = (v) => {
    setQuantity((q) => q + v);
    setQuantityValidator(true);
  };
  // INPUT OPTIONS FOR PURCHASE: -END

  function openSizesGuide() {}

  const context = useContext(BagContext);

  function addToBag(event) {
    event.preventDefault();

    // Validations
    if (!selectedSet) {
      setSelectedSetValidator(false);
      setDialogMessage('Por favor, escolha uma cor.');
      setShowDialog(true);
      return false;
    }

    if (
      (selectedSet.sizeSets.length > 0 && selectedSizes.length < 1) ||
      !selectedSizes[0]
    ) {
      setSelectedSizesValidator(false);
      setDialogMessage('Por favor, escolha uma das medidas disponíveis.');
      setShowDialog(true);
      return false;
    }

    if (
      selectedSet.sizeSets.filter(
        (size) => size.isUnique === selectedSizes[0].isUnique
      ).length != selectedSizes.length ||
      selectedSizes.some((size) => size.selected.length === 0)
    ) {
      setSelectedSizesValidator(false);
      setDialogMessage(
        'Por favor, escolha uma medida de cada opção disponível para personalização.'
      );
      setShowDialog(true);
      return false;
    }

    if (selectedSet.extraOptions.length != Object.keys(selectedExtras).length) {
      setSelectedExtrasValidator(false);
      setDialogMessage('Por favor, selecione as opções desejadas.');
      setShowDialog(true);
      return false;
    }

    if (+quantity < 1) {
      setQuantityValidator(true);
      setDialogMessage('Por favor, escolha a quantidade.');
      setShowDialog(true);
      return false;
    }

    const prodToBag = {
      product: product._id,
      selectedSet: selectedSet._id,
      selectedSizes: selectedSizes,
      selectedExtras: Object.keys(selectedExtras).map((key) => ({
        extraId: key,
        selected: selectedExtras[key],
      })),
      quantity: quantity,
    };

    setCancelText('Continuar Comprando');
    setOkText('Finalizar Compra');
    setDialogMessage(
      quantity +
        ' "' +
        product.name +
        '" ' +
        (quantity > 1 ? 'foram adicionados' : 'foi adicionado') +
        ' à sua sacola!'
    );
    setShowDialog(true);

    context.addToBag(prodToBag);
    return true;
  }

  function buyHandler(event) {
    event.preventDefault();
    if (addToBag(event)) router.push({ pathname: '/loja/sacola' });
  }

  return (
    <Main notice={notice} categoryList={categoryList}>
      <Store notice={!!notice} categoryList={categoryList}>
        <Head>
          <title>{`${title} - ${product.name}`}</title>
          <meta
            name="description"
            content={`Tamanhos especiais: ${product.name} - ${product.shortDescription}`}
          />
          <link href={canonical} rel="canonical" />
        </Head>
        <div className={styles.contentbox}>
          <div className={styles.bredcrumb_container}>
            <Breadcrumb
              query={[product.categoryId.name, product._id]}
              current={product.name}
            />
          </div>
          <div className={styles.product_content_side}>
            <div className={styles.hidden_web}>
              <span className={styles.font_hightlight}>{product.name}</span>
              <span>Ref: {product.code}</span>
            </div>
            <div className={styles.imageshow__container}>
              <ImageShow
                images={selectedSet.images.map((image, index) => ({
                  src: `/images/products/${product._id}/${image}`,
                  alt: `Foto ${index} de ${product.name} na cor ${selectedSet.colorId.text}`,
                }))}
              />
            </div>
            <div className={styles.details}>
              <div className={styles.hidden_mobile}>
                <span className={styles.font_hightlight}>{product.name}</span>
                <span>Ref: {product.code.toUpperCase()}</span>
              </div>
              <section
                className={[styles.section_details, styles.details__description]
                  .join(' ')
                  .trim()}
              >
                {product.shortDescription}
                <span className={styles.center_spaced_line}>
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
                      -{product.discountPercentage}%
                    </span>
                  )}
                </span>
              </section>
              <section
                className={[
                  styles.section_details,
                  styles.section_colors,
                  !selectedSetValidator ? styles.section_validation : '',
                ].join(' ')}
              >
                Cores:
                <div className={styles.imageshow__colors}>
                  {product.sets.map((set) => (
                    <div
                      key={set._id}
                      className={[
                        styles.color,
                        set._id === selectedSet._id ? styles.colorSelected : '',
                      ]
                        .join(' ')
                        .trim()}
                      style={{ backgroundColor: set.colorId.code }}
                      onClick={() => {
                        setSelectedSet(set);
                        setSelectedSetValidator(true);
                        setSelectedSizesValidator(true);
                        setSelectedExtrasValidator(true);
                        setSelectedExtras({});
                        setSelectedSizes([]);
                      }}
                    />
                  ))}
                </div>
              </section>
              <section
                className={[
                  styles.section_details,
                  styles.section_sizes,
                  !selectedSizesValidator ? styles.section_validation : '',
                ].join(' ')}
              >
                <p>
                  Medidas:
                  <span onClick={openSizesGuide}>Guia de medidas aqui!</span>
                </p>
                {selectedSet.sizeSets.length <= 0 ? (
                  <p>Tamanho único</p>
                ) : (
                  <>
                    {selectedSet.sizeSets.map((size) => {
                      if (size.isUnique)
                        return (
                          <div
                            key={size._id}
                            className={
                              !!selectedSizes[0] &&
                              selectedSizes[0].sizeId === size._id
                                ? styles.selectedSizeSet
                                : ''
                            }
                          >
                            <label htmlFor="uniqueSize">
                              <InputRadio
                                id="uniqueSize"
                                type="radio"
                                name="size_type"
                                value="uniqueSize"
                                checked={
                                  !!selectedSizes[0] &&
                                  selectedSizes[0].sizeId === size._id
                                }
                                onChange={() => {
                                  setSelectedSizes([
                                    {
                                      sizeId: size._id,
                                      isUnique: true,
                                      selected: '',
                                    },
                                  ]);
                                  setSelectedSizesValidator(true);
                                }}
                              />
                              <span className={styles.capitalize}>
                                {size.name}
                              </span>
                            </label>
                            <span>
                              <SizeSelector
                                availableSizeList={
                                  !!selectedSizes[0] &&
                                  selectedSizes[0].sizeId === size._id
                                    ? size.availableSizes
                                    : []
                                }
                                value={
                                  selectedSizes.find(
                                    (s) => s.sizeId === size._id
                                  )
                                    ? selectedSizes.find(
                                        (s) => s.sizeId === size._id
                                      ).selected
                                    : ''
                                }
                                fullSizeList={size.sizeSetId.sizes}
                                id={size._id}
                                onChange={(id, value) => {
                                  setSelectedSizes([
                                    {
                                      sizeId: id,
                                      isUnique: true,
                                      selected: value,
                                    },
                                  ]);
                                  setSelectedSizesValidator(true);
                                }}
                              />
                            </span>
                          </div>
                        );
                    })}
                    {selectedSet.sizeSets.filter((size) => !size.isUnique)
                      .length > 0 && (
                      <div
                        className={
                          !!selectedSizes[0] && !selectedSizes[0].isUnique
                            ? styles.selectedSizeSet
                            : ''
                        }
                      >
                        <label htmlFor="customSize">
                          <InputRadio
                            id="customSize"
                            type="radio"
                            name="size_type"
                            value="customSize"
                            checked={
                              !!selectedSizes[0] &&
                              selectedSizes[0].isUnique === false
                            }
                            onChange={() => {
                              setSelectedSizes(() => {
                                let newSelectedSizes = [];
                                selectedSet.sizeSets.forEach((size) => {
                                  if (!size.isUnique)
                                    newSelectedSizes.push({
                                      sizeId: size._id,
                                      isUnique: false,
                                      selected: '',
                                    });
                                });
                                return newSelectedSizes;
                              });
                              setSelectedSizesValidator(true);
                            }}
                          />
                          <span>Personalizado:</span>
                        </label>
                        <div>
                          {selectedSet.sizeSets.map((size, i) => {
                            if (!size.isUnique)
                              return (
                                <div
                                  key={size._id}
                                  className={styles.specialSizes}
                                >
                                  <span className={styles.capitalize}>
                                    {size.name}:
                                  </span>
                                  <span>
                                    <SizeSelector
                                      availableSizeList={
                                        selectedSizes.some(
                                          (s) => s.sizeId === size._id
                                        )
                                          ? size.availableSizes
                                          : []
                                      }
                                      value={
                                        selectedSizes.find(
                                          (s) => s.sizeId === size._id
                                        )
                                          ? selectedSizes.find(
                                              (s) => s.sizeId === size._id
                                            ).selected
                                          : ''
                                      }
                                      fullSizeList={size.sizeSetId.sizes}
                                      id={size._id}
                                      onChange={(id, value) => {
                                        let index = selectedSizes.findIndex(
                                          (s) => s.sizeId === id
                                        );
                                        setSelectedSizes((oldArray) => {
                                          let newArray = [...oldArray];
                                          newArray[index] = {
                                            sizeId: id,
                                            ref: i,
                                            isUnique: false,
                                            selected: value,
                                          };
                                          setSelectedSizesValidator(true);
                                          return newArray;
                                        });
                                      }}
                                    />
                                  </span>
                                </div>
                              );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </section>
              {selectedSet.extraOptions.length > 0 && (
                <section
                  className={[
                    styles.section_details,
                    styles.section_extras,
                    !selectedExtrasValidator ? styles.section_validation : '',
                  ].join(' ')}
                >
                  <p>Opções:</p>
                  {selectedSet.extraOptions.map((op) => (
                    <div key={`${selectedSet._id}_${op.name}`}>
                      <span>
                        <p>{op.name}:</p>
                      </span>
                      <span>
                        {op.options.map((option) => (
                          <label
                            htmlFor={`extraOptInpt_${op.name}_${option}`}
                            key={`extraOptLabel_${op.name}_${option}`}
                          >
                            <InputRadio
                              id={`extraOptInpt_${op.name}_${option}`}
                              type="radio"
                              name={`extraOptInpt_${op.name}_${op.name}`}
                              value={option}
                              onChange={() =>
                                onSelectedExtrasHandler(op._id, option)
                              }
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </span>
                    </div>
                  ))}
                </section>
              )}
              <section
                className={[
                  styles.section_details,
                  styles.center_spaced_line,
                  !quantityValidator ? styles.section_validation : '',
                ]
                  .join(' ')
                  .trim()}
              >
                <p>Quantidade:</p>
                <span>
                  <InputNumber
                    id="quantity"
                    name="quantity"
                    minValue={1}
                    onChange={onChangeQuantity}
                    value={quantity}
                  />
                </span>
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
                    onClick={addToBag}
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
                    onClick={buyHandler}
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
                category={product.categoryId}
                productList={relatedProducts}
                type="carousel"
              />
            </section>
          </div>
        </div>
      </Store>
      <ConfirmationDialog
        show={showDialog}
        onCancel={() => {
          setShowDialog(false);
          setCancelText('');
          setOkText('ok');
        }}
        onConfirm={() => {
          setShowDialog(false);
          setCancelText('');
          setOkText('ok');
        }}
        message={dialogMessage}
        cancelText={cancelText}
        okText={okText}
        noButtons={okText === 'Finalizar Compra'}
        fixed
      >
        {okText === 'Finalizar Compra' && (
          <span className={styles.confirmationButtonLine}>
            <Button
              className={styles.formButton}
              onClick={() => {
                setShowDialog(false);
                setCancelText('');
                setOkText('ok');
              }}
            >
              {cancelText}
            </Button>
            <Button
              className={styles.formButton}
              onClick={() => {
                setShowDialog(false);
                setCancelText('');
                setOkText('ok');
                if (okText === 'Finalizar Compra')
                  router.push({ pathname: '/loja/sacola' });
              }}
            >
              {okText}
            </Button>
          </span>
        )}
      </ConfirmationDialog>
    </Main>
  );
};

export async function getStaticPaths() {
  const categories = await getCategoriesJSON();
  const categoryList = await JSON.parse(categories);

  let pathList = [];

  for (const category of categoryList) {
    const products = await getProductIdsByCategoryJSON(category._id, 1, 100);
    const prodList = await JSON.parse(products);
    prodList.forEach((prod) => {
      pathList.push({ params: { category: category.name, product: prod._id } });
    });
  }

  return {
    paths: pathList,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const category = params.category;
  const productId = params.product;

  const prod = await getProductByIdJSON(productId);
  const product = await JSON.parse(prod);
  const related = await getProductListingByCategoryJSON(
    product.categoryId,
    1,
    10
  );
  const relatedProducts = await JSON.parse(related);

  const categories = await getCategoriesJSON();
  const categoryList = await JSON.parse(categories);

  const notice = await getCurrentNotice();
  let noticeText = notice ? notice.text : '';

  return {
    props: {
      title: 'Laruci',
      canonical: `http://localhost:3000/loja/${category}/${productId}`,
      notice: noticeText,
      categoryList: categoryList,
      product: product,
      relatedProducts: relatedProducts,
    },
  };
}

export default ProductPage;
