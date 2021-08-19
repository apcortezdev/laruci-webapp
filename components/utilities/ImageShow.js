import Image from 'next/image';
import styles from './ImageShow.module.scss';
import { useEffect, useRef, useState } from 'react';

const ImageShow = (props) => {
  const images = props.images;

  const slideshow__container = useRef();
  const img_main = useRef();
  const ratio = 2;
  const [slideImgNumber, setSlideImgNumber] = useState(0);

  useEffect(() => {
    setSlideImgNumber(0);
  }, [images]);

  const nextImage = () => {
    setSlideImgNumber((i) => {
      if (i === images.length - 1) {
        return 0;
      }
      return i + 1;
    });
  };

  const previousImage = () => {
    setSlideImgNumber((i) => {
      if (i === 0) {
        return images.length - 1;
      }
      return i - 1;
    });
  };

  const imageZoomOff = () => {
    img_main.current.style.transform = `scale(1)`;
    img_main.current.style.top = `0px`;
    img_main.current.style.left = `0px`;
  };

  const moveAction = () => {
    let pos = getCursor();
    img_main.current.style.transform = `scale(${ratio})`;
    img_main.current.style.top = `calc(50% - ${pos.y}px)`;
    img_main.current.style.left = `calc(50% - ${pos.x}px)`;
  };

  const getCursor = () => {
    const e = window.event;
    const bounds = slideshow__container.current.getBoundingClientRect();
    let x = e.pageX - bounds.left;
    let y = e.pageY - bounds.top;
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  };

  return (
    <div className={styles.slideshow__wrapper}>
      <div className={styles.slideshow__ratio}>
        <div
          ref={slideshow__container}
          className={styles.slideshow__container}
          onMouseMove={moveAction}
          onTouchMove={moveAction}
          onMouseLeave={imageZoomOff}
        >
          {images.length > 1 && (
            <button
              className={[styles.sideshowbtn, styles.sidebtnleft]
                .join(' ')
                .trim()}
              onClick={nextImage}
            >
              &#10094;
            </button>
          )}
          <img
            ref={img_main}
            className={styles.img_main}
            src={`/public/images/products/${props.productId}/${images[slideImgNumber]}`}
          />
          {/* <Image
            ref={img_main}
            width={400}
            height={400}
            loading="lazy"
            objectFit="cover"
            src={`/public/images/products/${props.productId}/${images[slideImgNumber]}`}
          /> */}
          {images.length > 1 && (
            <button
              className={[styles.sideshowbtn, styles.sidebtnright]
                .join(' ')
                .trim()}
              onClick={previousImage}
            >
              &#10095;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageShow;
