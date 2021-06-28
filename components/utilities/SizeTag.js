import styles from './SizeTag.module.scss';
import dummySizes from '../../pages/api/dummySizes';

const SizeTag = (props) => {
  const sizes = dummySizes;
  let tags = [];

  for (const key in sizes) {
    if (Object.hasOwnProperty.call(props.sizes, key)) {
      tags.push(
        <div key={sizes[key]} className={[styles.abled].join(' ')}>
          {sizes[key]}
        </div>
      );
    } else {
      tags.push(
        <div
          key={sizes[key]}
          className={[styles.tag, styles.disabled].join(' ')}
        >
          {sizes[key]}
        </div>
      );
    }
  }
  return (
    <>
      <div className={styles.tagsContainer}>{tags}</div>
      <div className={styles.guideContainer}>
        <span className={styles.font_inline}>Guia de tamanhos aqui!</span>
      </div>
    </>
  );
};

export default SizeTag;
