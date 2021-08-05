import { useEffect, useReducer, useState } from 'react';
import styles from '../../styles/AdProductsPage.module.scss';
import ConfirmationDialog from '../../components/utilities/ConfirmationDialog';
import { useRouter } from 'next/router';
import Admin from '../../components/admin/Admin';
import {
  Input,
  InputNumber,
  InputRadio,
  SelectText,
  SelectColor,
  Textarea,
  InputCheck,
  InputMask,
} from '../../components/utilities/FormComponents';
import Button from '../../components/utilities/Button';
import { getCategoriesJSON } from '../../data/categories';
import { getColorsJSON } from '../../data/colors';
import { getSectionsJSON } from '../../data/sections';

/* LEMBRETE: VALIDE OS VALORES DE PREÇO, PESO E DISCONTO PARA APENAS UM PONTO DECIMAL CONTANDO O NÚMERO DE PONTOS:

var temp = "This is a string.";
var count = (temp. match(/is/g) || []). ...
console. log(count);
​
Output: 2.
​
Explaination : The g in the regular expression (short for global) says to search the whole string rather than just find the first occurrence.

*/

const fields = {
  CODE: 'code',
  NAME: 'name',
  LIMIT_STOCK: 'limitStock',
  STOCK_NUMBER: 'stockNumber',
  CATEGORY: 'category',
  COLOR: 'color',
  PRICE: 'price',
  DISCOUNT_PERCENTAGE: 'discountPercentage',
  WEIGHT: 'weight',
  SHORT_DESCRIPTION: 'shortDescription',
  LONG_DESCRIPTION: 'longDescription',
  SETS: 'sets',
};

const productReducer = (state, action) => {
  let product = state.product;

  const field = action.field;
  let value = action.value;

  switch (action.field) {
    case fields.LIMIT_STOCK:
      value = action.value === 'UNLIMITED';
      break;
    case fields.STOCK_NUMBER:
      value = state.product.stockNumber + action.value;
      break;
    case fields.SETS:
      value = state.sets;
      value.push(action.value);
      break;
  }

  if (field) {
    product = {
      ...product,
      [field]: value,
    };

    return { product };
  }

  return state;
};

const AdProductsPage = ({ user, categoryList, colorList, sectionList }) => {
  const router = useRouter();

  if (user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }

  if (!categoryList) {
    return (
      <Admin>
        <div className={styles.wrapper}>
          <p>Loading...</p>
        </div>
      </Admin>
    );
  }

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sections, setSections] = useState([]);

  const onChange = (value, field) => {
    dispatchProductState({ field: field, value: value });
  };

  const onAddSet = (event) => {
    event.preventDefault();
    console.log('CRICK');
  };

  const [productState, dispatchProductState] = useReducer(productReducer, {
    product: {
      code: '',
      name: '',
      limitStock: true,
      stockNumber: 0,
      category: '',
      price: '',
      discountPercentage: '',
      weight: '',
      shortDescription: '',
      longDescription: '',
      sets: [
        {
          colorId: '',
          sectionId: '',
        },
      ],
    },
  });

  // set
  const [section, setSection] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    setCategories(categoryList.map((c) => ({ id: c._id, text: c.text })));
    setSections(sectionList.map((c) => ({ id: c._id, text: c.text })));
    setColors(
      colorList.map((c) => ({ id: c._id, text: c.text, code: c.code }))
    );
  }, []);

  return (
    <Admin>
      <div className={styles.wrapper}>
        <section className={styles.warning}>
          <h1>Produtos</h1>
          <div>
            ATENÇÃO: <br />
            <ul>
              <li>
                Tenha certeza de que as informações desta página estão corretas
                e atualizadas. Altere-as com cuidado!
              </li>
              <li>
                Alterações poderão <u> demorar até 24 horas</u> para serem
                atualizadas no site.
              </li>
            </ul>
          </div>
        </section>
        <section className={styles.product}>
          <form className={styles.form} onSubmit={onAddSet}>
            <span>
              <label htmlFor="code">
                Código:
                <span className={styles.inpwbutton}>
                  <Input
                    id="code"
                    className={[styles.inp_text, styles.uppercase].join(' ')}
                    onChange={(e) => onChange(e.target.value, fields.CODE)}
                    value={productState.product.code}
                  />
                  <Button className={styles.button}>Buscar</Button>
                </span>
              </label>
            </span>
            <span>
              <label htmlFor="name">
                Nome:
                <Input
                  id="name"
                  className={styles.inp_text}
                  onChange={(e) => onChange(e.target.value, fields.NAME)}
                  value={productState.product.name}
                />
              </label>
            </span>
            <span>
              Estoque:
              <span
                className={[styles.inp_check_line, styles.group_line].join(' ')}
              >
                <span>
                  <label
                    htmlFor="prod_limitStock_nolimit"
                    onChange={(e) =>
                      onChange(e.target.value, fields.LIMIT_STOCK)
                    }
                  >
                    <InputRadio
                      id="prod_limitStock_nolimit"
                      name={'limitStock'}
                      defaultChecked={true}
                      value="UNLIMITED"
                    />
                    Sem Limite
                  </label>
                </span>
                <span>
                  <label
                    htmlFor="prod_limitStock_limit"
                    onChange={(e) =>
                      onChange(e.target.value, fields.LIMIT_STOCK)
                    }
                  >
                    <InputRadio
                      id="prod_limitStock_limit"
                      name="limitStock"
                      value="LIMITED"
                    />
                    Limitado à
                  </label>
                </span>
                <span>
                  <InputNumber
                    id="prod_stockNumber"
                    className={styles.inp_number}
                    onChange={(value) => onChange(value, fields.STOCK_NUMBER)}
                    minValue={0}
                    disabled={productState.product.limitStock}
                    value={productState.product.stockNumber}
                  />
                </span>
              </span>
            </span>
            <span>
              <label htmlFor="category">
                Categoria:
                <SelectText
                  id="category"
                  placeholder="Selecione"
                  className={styles.capitalize}
                  onChange={(v) => onChange(v, fields.CATEGORY)}
                  options={categories}
                />
              </label>
            </span>
            <span className={[styles.group_line, styles.margins].join(' ')}>
              <label htmlFor="price">
                Preço:
                <span className={styles.group_line}>
                  R$
                  <Input
                    id="price"
                    className={styles.inp_text}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9,.]/gi, '');
                      value = value.replace(',', '.');
                      onChange(value, fields.PRICE);
                    }}
                    value={productState.product.price}
                  />
                </span>
              </label>
              <label htmlFor="discount">
                Desconto:
                <span className={styles.group_line}>
                  <Input
                    id="discount"
                    className={styles.inp_text}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9,.]/gi, '');
                      value = value.replace(',', '.');
                      onChange(value, fields.DISCOUNT_PERCENTAGE);
                    }}
                    value={productState.product.discountPercentage}
                  />
                  %
                </span>
              </label>
              <label htmlFor="weight">
                Peso:
                <span className={styles.group_line}>
                  <Input
                    id="weight"
                    className={styles.inp_text}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9,.]/gi, '');
                      value = value.replace(',', '.');
                      onChange(value, fields.WEIGHT);
                    }}
                    value={productState.product.weight}
                  />
                  Kg
                </span>
              </label>
            </span>
            <span>
              <label htmlFor="shortDescription">
                Descrição Curta:
                <Input
                  id="shortDescription"
                  className={styles.inp_text}
                  onChange={(e) =>
                    onChange(e.target.value, fields.SHORT_DESCRIPTION)
                  }
                  value={productState.product.shortDescription}
                />
              </label>
            </span>
            <span>
              <label htmlFor="longDescription">
                Descrição Longa:
                <Textarea
                  id="longDescription"
                  rows={20}
                  className={styles.inp_textarea}
                  onChange={(e) =>
                    onChange(e.target.value, fields.LONG_DESCRIPTION)
                  }
                  value={productState.product.longDescription}
                />
              </label>
            </span>
            <div className={styles.sets}>
              Seleções:
              <div
                className={[
                  styles.borderAround,
                  styles.padding,
                  styles.sets,
                ].join(' ')}
              >
                <span>
                  <label htmlFor="section">
                    Seção:
                    <SelectText
                      id="section"
                      placeholder="Selecione"
                      className={styles.capitalize}
                      onChange={(v) => setSection(v)}
                      options={sections}
                    />
                  </label>
                </span>
                <span>
                  <label htmlFor="color">
                    Cor:
                    <SelectColor
                      id="color"
                      placeholder="Selecione"
                      className={styles.capitalize}
                      onChange={(v) => setColor(v)}
                      colors={colors}
                    />
                  </label>
                </span>
                <span>Tamanhos:</span>
                <span>
                  <Button
                    className={styles.buttonSmall}
                    type="submit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      className={styles.icon}
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                    </svg>
                  </Button>
                </span>
              </div>
            </div>
          </form>
        </section>
      </div>
      {/* <ConfirmationDialog show={showConfirmation} onCancel={onDismissConfirmation} onConfirm={onConfirmSaveHandler}/> */}
    </Admin>
  );
};

export async function getServerSideProps() {
  const categories = await getCategoriesJSON();
  const catList = await JSON.parse(categories);

  const colors = await getColorsJSON();
  const colorList = await JSON.parse(colors);

  const sections = await getSectionsJSON();
  const sectionList = await JSON.parse(sections);

  return {
    props: {
      user: 'admin',
      categoryList: catList,
      colorList: colorList,
      sectionList: sectionList,
    },
  };
}

export default AdProductsPage;
