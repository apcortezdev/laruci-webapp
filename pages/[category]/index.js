import { useRouter } from 'next/router';
import ProductList from '../../components/ProductList';
import styles from '../../styles/Listing.module.scss';

const CategoryPage = (props) => {
  const dummy = {
    abcde: {
      name: 'Produto 01',
      price: 19.9901,
      sale: false,
      discount: 0,
      shortDescription: 'Lindo sutiã com bojo meia taça',
      longDescription: 'Lindo sutiã com bojo meia taça com ou sem bolha',
      colors: ['#ecece3'],
      sizes: ['P', 'M', 'G', 'GG', 'xG'],
      images: [
        'https://images.unsplash.com/photo-1568441556126-f36ae0900180?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1048&q=80',
        'https://images.unsplash.com/photo-1598668752658-fbdfffcb4496?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      ],
    },
    efgij: {
      name: 'Produto 02',
      price: 99.99,
      sale: true,
      discount: 10,
      shortDescription: 'Lindo sutiã com bojo meia taça',
      longDescription: 'Lindo sutiã com bojo meia taça com ou sem bolha',
      colors: ['#F1F4C4', '#F0F0F0'],
      sizes: ['P', 'M', 'G', 'GG', 'xG'],
      images: [
        'https://images.unsplash.com/photo-1568441556126-f36ae0900180?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1048&q=80',
        'https://images.unsplash.com/photo-1598668752658-fbdfffcb4496?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      ],
    },
    klmno: {
      name: 'Produto 03',
      price: 59.99,
      sale: false,
      discount: 0,
      shortDescription: 'Lindo sutiã com bojo meia taça',
      longDescription: 'Lindo sutiã com bojo meia taça com ou sem bolha',
      colors: ['#F1F4C4', '#F0F0F0'],
      sizes: ['P', 'M', 'G', 'GG', 'xG'],
      images: [
        'https://images.unsplash.com/photo-1568441556126-f36ae0900180?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1048&q=80',
        'https://images.unsplash.com/photo-1598668752658-fbdfffcb4496?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      ],
    },
    pqrst: {
      name: 'Produto 04',
      price: 39.99,
      sale: false,
      discount: 0,
      shortDescription: 'Lindo sutiã com bojo meia taça',
      longDescription: 'Lindo sutiã com bojo meia taça com ou sem bolha',
      colors: ['#F1F4C4', '#F0F0F0'],
      sizes: ['P', 'M', 'G', 'GG', 'xG'],
      images: [
        'https://images.unsplash.com/photo-1568441556126-f36ae0900180?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1048&q=80',
        'https://images.unsplash.com/photo-1598668752658-fbdfffcb4496?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      ],
    },
    uvwxz: {
      name: 'Produto 05',
      price: 29.990,
      sale: false,
      discount: 0,
      shortDescription: 'Lindo sutiã com bojo meia taça',
      longDescription: 'Lindo sutiã com bojo meia taça com ou sem bolha',
      colors: ['#F1F4C4', '#F0F0F0'],
      sizes: ['P', 'M', 'G', 'GG', 'xG'],
      images: [
        'https://images.unsplash.com/photo-1568441556126-f36ae0900180?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1048&q=80',
        'https://images.unsplash.com/photo-1598668752658-fbdfffcb4496?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      ],
    },
    uvllz: {
      name: 'Produto 05',
      price: 29.990,
      sale: false,
      discount: 0,
      shortDescription: 'Lindo sutiã com bojo meia taça',
      longDescription: 'Lindo sutiã com bojo meia taça com ou sem bolha',
      colors: ['#F1F4C4', '#F0F0F0'],
      sizes: ['P', 'M', 'G', 'GG', 'xG'],
      images: [
        'https://images.unsplash.com/photo-1568441556126-f36ae0900180?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1048&q=80',
        'https://images.unsplash.com/photo-1598668752658-fbdfffcb4496?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      ],
    },
    uvasdfz: {
      name: 'Produto 05',
      price: 29.990,
      sale: false,
      discount: 0,
      shortDescription: 'Lindo sutiã com bojo meia taça',
      longDescription: 'Lindo sutiã com bojo meia taça com ou sem bolha',
      colors: ['#F1F4C4', '#F0F0F0'],
      sizes: ['P', 'M', 'G', 'GG', 'xG'],
      images: [
        'https://images.unsplash.com/photo-1568441556126-f36ae0900180?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1048&q=80',
        'https://images.unsplash.com/photo-1598668752658-fbdfffcb4496?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      ],
    },
    uvsdwxz: {
      name: 'Produto 05',
      price: 29.990,
      sale: false,
      discount: 0,
      shortDescription: 'Lindo sutiã com bojo meia taça',
      longDescription: 'Lindo sutiã com bojo meia taça com ou sem bolha',
      colors: ['#F1F4C4', '#F0F0F0'],
      sizes: ['P', 'M', 'G', 'GG', 'xG'],
      images: [
        'https://images.unsplash.com/photo-1568441556126-f36ae0900180?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1048&q=80',
        'https://images.unsplash.com/photo-1598668752658-fbdfffcb4496?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      ],
    },
    uv2xz: {
      name: 'Produto 05',
      price: 29.990,
      sale: false,
      discount: 0,
      shortDescription: 'Lindo sutiã com bojo meia taça',
      longDescription: 'Lindo sutiã com bojo meia taça com ou sem bolha',
      colors: ['#F1F4C4', '#F0F0F0'],
      sizes: ['P', 'M', 'G', 'GG', 'xG'],
      images: [
        'https://images.unsplash.com/photo-1568441556126-f36ae0900180?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1048&q=80',
        'https://images.unsplash.com/photo-1598668752658-fbdfffcb4496?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      ],
    },
  };

  const router = useRouter();

  const route = router.query;

  return (
    <div className={styles.main}>
      <div className={styles.aside}/>
      <div className={styles.content}>
        <ProductList category={route.category} list={dummy} />
      </div>
      <div className={styles.aside}/>
    </div>
  );
};

export default CategoryPage;
