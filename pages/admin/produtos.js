import ConfirmationDialog from '../../components/utilities/ConfirmationDialog';
import { useRouter } from 'next/router';
import Admin from '../../components/admin/Admin';
import {
  Input,
  InputNumber,
  InputRadio,
  SelectText,
  InputCheck,
  InputMask,
} from '../../components/utilities/FormComponents';
import Button from '../../components/utilities/Button';
import styles from '../../styles/AdProductsPage.module.scss';
import { useReducer, useState } from 'react';

const fields = {
  CODE: 'code',
  NAME: 'name',
  LIMIT_STOCK: 'limitStock',
  STOCK_NUMBER: 'stockNumber',
  CATEGORY: 'category',
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

const AdProductsPage = (props) => {
  const router = useRouter();

  if (props.user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }

  const onChange = (value, field) => {
    dispatchProductState({ field: field, value: value });
  };

  const [a, setA] = useState(0);
  const onChangeNum = (v) => {
    setA((b) => b + v);
  };

  const [productState, dispatchProductState] = useReducer(productReducer, {
    product: {
      code: '',
      name: '',
      limitStock: true,
      stockNumber: 0,
      category: '',
    },
  });

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
          <span>
            <label htmlFor="code">
              Código:
              <span className={styles.inpwbutton}>
                <Input
                  id="code"
                  className={[styles.inp_text, styles.inp_text_upper].join(' ')}
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
            <span className={styles.inp_check_line}>
              <span>
                <label
                  htmlFor="prod_limitStock_nolimit"
                  onChange={(e) => onChange(e.target.value, fields.LIMIT_STOCK)}
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
                  onChange={(e) => onChange(e.target.value, fields.LIMIT_STOCK)}
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
                // className={styles.inp_text}
                onChange={() => {}}
                options={[{ id: 'vaca', name: 'Vaca', value: 'vaca' }]}
              />
            </label>
          </span>
        </section>
      </div>
      {/* <ConfirmationDialog show={showConfirmation} onCancel={onDismissConfirmation} onConfirm={onConfirmSaveHandler}/> */}
    </Admin>
  );
};

export async function getServerSideProps() {
  //   let notice;
  //   try {
  //     notice = await getNotice();
  //   } catch (err) {
  //     return { notFound: true };
  //   }

  //   const propNotice = {
  //     id: notice._id || '',
  //     text: notice.text || '',
  //     startDate: notice.startDate || '',
  //     endDate: notice.endDate || '',
  //     createdDate: notice.createdDate || '',
  //   };

  return {
    props: {
      user: 'admin',
      //   notice: JSON.stringify(propNotice),
    },
  };
}

export default AdProductsPage;
