import Image from 'next/image';
import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const ImageShow = ({ images }) => {
  const slideshow__container = useRef();
  const img_main = useRef();
  const ratio = 2;

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

  const thumbLinsRef = useRef();
  const [thumbsPosition, setThumbsPosition] = useState(0);
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const slide = (value) => {
    let width = thumbLinsRef.current.getBoundingClientRect().width;
    if (width > images.length * 110) return;
    let limit = images.length * 110 - width;
    setThumbsPosition((v) => {
      let newV = v + value;
      if (newV > 0) return 0;
      if (newV < -limit) return -limit;
      return newV;
    });
  };

  useEffect(() => {
    setSelectedImage(images[0]);
  }, [images]);

  return (
    <div className={styles.content}>
      <div
        className={styles.imageRatio}
        ref={slideshow__container}
        onMouseMove={moveAction}
        onTouchMove={moveAction}
        onMouseLeave={imageZoomOff}
      >
        <div ref={img_main} className={styles.imageWrapper}>
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt}
            loading="lazy"
            objectFit="cover"
            layout="fill"
          />
        </div>
      </div>
      <div className={styles.thumbsWrapper}>
        <button
          className={[styles.sideshowbtn, styles.sidebtnleft].join(' ').trim()}
          onClick={() => slide(+100)}
        >
          &#10094;
        </button>
        <div
          className={styles.imagesThumb}
          style={{ transform: `translateX(${thumbsPosition}px)` }}
          ref={thumbLinsRef}
        >
          {images.map((image) => (
            <div
              key={image.src.split('/').pop()}
              className={styles.imageThumb}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                loading="eager"
                objectFit="cover"
                layout="fill"
              />
            </div>
          ))}
        </div>
        <button
          className={[styles.sideshowbtn, styles.sidebtnright].join(' ').trim()}
          onClick={() => slide(-100)}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

ImageShow.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default ImageShow;
