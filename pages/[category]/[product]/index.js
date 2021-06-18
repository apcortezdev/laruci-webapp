import { useRouter } from 'next/router';
import { useState } from 'react';
import ImageSlideShow from '../../../components/utilities/ImageSlideShow';
import styles from '../../../styles/ProductPage.module.scss';
import dummy from '../../api/dummy';

const ProductPage = (props) => {
  const router = useRouter();

  const data = dummy[Object.keys(dummy)[0]];
  const [images, setImages] = useState(
    data.sets[Object.keys(data.sets)[0]].images
  );

  const [slideImgSelected, setSlideImgSelected] = useState(0);
  const [sizes, setSizes] = useState([data.sets[Object.keys(data.sets).sizes]]);

  const colors = Object.keys(data.sets).map((color) => (
    <div
      key={color}
      className={styles.color}
      style={{ backgroundColor: color }}
      onClick={setImagesToSlideShow.bind(this, color)}
    />
  ));

  function setImagesToSlideShow(color) {
    setImages(data.sets[color].images);
  }

  const nextImage = () => {
    setSlideImgSelected((i) => {
      if (i === (images.length - 1)) {
        return 0;
      }
      return i + 1;
    });
    console.log(slideImgSelected);
  };

  const previousImage = () => {
    setSlideImgSelected((i) => {
      if (i === 0) {
        return (images.length - 1);
      }
      return i - 1;
    });
    console.log(slideImgSelected);
  };

  return (
    <div className={styles.main}>
      <div className={styles.aside} />
      <div className={styles.content}>
        <div className={styles.slideshow}>
          <div className={styles.slideshow__slide}>
            <button
              className={[styles.sideshowbtn, styles.sidebtnleft].join(' ')}
              onClick={nextImage}
            >
              &#10094;
            </button>
            <img src={images[slideImgSelected]} styles={styles.slide} />
            <button
              className={[styles.sideshowbtn, styles.sidebtnright].join(' ')}
              onClick={previousImage}
            >
              &#10095;
            </button>
          </div>
          <div className={styles.slideshow__color}>{colors}</div>
        </div>
        <div className={styles.details}>
          {data.name}
        </div>
      </div>
      <div className={styles.aside} />
    </div>
  );
};

export default ProductPage;
