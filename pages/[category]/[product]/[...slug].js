import { useRouter } from 'next/router';
import { useState } from 'react';
import ImageShow from '../../../components/utilities/ImageShow';
import dummy from '../../../data/dummy';

const ProductSlug = (props) => {
  const router = useRouter();

  const data = dummy[Object.keys(dummy)[1]];

  const [selectedColorSet, setSelectedColorSet] = useState(
    Object.keys(data.sets)[0]
  );

  const [selectedColorSet_images, setSelectedColorSet_images] = useState(
    data.sets[selectedColorSet].images
  );
  
  return (
  <div>
          <ImageShow images={selectedColorSet_images} />
  </div>);
};

export default ProductSlug;
