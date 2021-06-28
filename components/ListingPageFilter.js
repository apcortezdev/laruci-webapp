import { useEffect, useState } from 'react';
import { SelectColor, SelectText } from './utilities/FormComponents';
import styles from './ListingPageFilter.module.scss';
import colorList from '../pages/api/dummyColors';
import sizesList from '../pages/api/dummySizes';
import Button from '../components/utilities/Button';
import FilterIcon from './utilities/FilterIcon';

const ListingPageFilter = (props) => {
  // const [colors, setColors] = useState([]);

  const orderList = {
    pop: 'Popular',
    che: 'Menor Preço',
    exp: 'Maior Preço',
    atz: 'A - Z',
    zta: 'Z - A',
  };

  const [selectedColor, setSelectedColor] = useState();

  const setColor = (color) => {
    //   setSelectedColor(color);
  };

  const setSize = (size) => {
    //   setSelectedColor(color);
  };

  const setOrder = (order) => {
    //   setSelectedColor(color);
  };

  const submitSearch = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      <span className={styles.mobile_filter}>
        <span className={styles.icon}>
          <FilterIcon className={styles.icon_color} />
        </span>
          Filtrar
      </span>
      <span className={styles.container_text}>Buscar por:</span>
      <form className={styles.form}>
        <div className={styles.form_item_group}>
          <div className={styles.form_item}>
            <label htmlFor="color" className={styles.form_label}>
              Cor:
            </label>
            <SelectColor
              className={[
                styles.container_capitalized,
                styles.selector_colors,
              ].join(' ')}
              id="color"
              placeholder="Todas"
              onChange={setColor}
              colors={colorList}
            />
          </div>
          <div className={styles.form_item}>
            <label htmlFor="size" className={styles.form_label}>
              Tamanho:
            </label>
            <SelectText
              className={styles.selector_sizes}
              id="size"
              placeholder="Todos"
              onChange={setSize}
              options={sizesList}
            />
          </div>
        </div>
        <div className={styles.form_item_group}>
          <div className={styles.form_item}>
            <label htmlFor="order" className={styles.form_label}>
              Ordem:
            </label>
            <SelectText
              className={styles.selector_order}
              id="order"
              placeholder="Irrelevante"
              onChange={setOrder}
              options={orderList}
            />
          </div>
          <Button
            type="submit"
            className={styles.form__button}
            onclick={submitSearch}
          >
            Buscar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ListingPageFilter;
