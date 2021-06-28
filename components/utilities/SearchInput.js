import styles from './SearchInput.module.scss';

const SearchInput = () => {
  return (
    <span className={styles.searchinput}>
      <input type="text" />
      <span className={styles.search_icon} />
    </span>
  );
};

export default SearchInput;
