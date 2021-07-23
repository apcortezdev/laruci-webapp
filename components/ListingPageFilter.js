import { useEffect, useState } from 'react';
import { SelectColor, SelectText } from './utilities/FormComponents';
import styles from './ListingPageFilter.module.scss';
import Button from '../components/utilities/Button';

const ListingPageFilter = ({ colorList, sizesList }) => {
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [selectedOrder, setSelectedOrder] = useState();

  const [toggleFilter, setToggleFilter] = useState(false);
  const toggleMobileFilter = () => {
    setToggleFilter((toggle) => !toggle);
  };

  const orderList = [
    { name: 'Menor Preço', value: 'c' },
    { name: 'Maior Preço', value: 'e' },
    { name: 'A - Z', value: 'a' },
    { name: 'Z - A', value: 'z' },
  ];

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
      <div
        className={[styles.filter_box, toggleFilter && styles.filter_box_open]
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
                onChange={setOrder}
                options={orderList}
              />
            </div>
            <Button
              type="submit"
              className={styles.form__button}
              onClick={submitSearch}
            >
              Buscar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingPageFilter;
