import PropTypes from 'prop-types';
import Link from 'next/link';
import styles from './ShipmentCalc.module.scss';
import Button from './utilities/Button';
import { Input } from '../components/utilities/FormComponents';
import { useState } from 'react';

const ShipmentCalc = ({ weight }) => {
  const [cep, setCep] = useState('');

  const onCalculate = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.shipmentcalc_container}>
      <span>Calcular Entrega:</span>
      <span>Informe seu CEP para consultar prazos de entrega na sua casa</span>
      <span className={styles.check_cep}>
        <div>
          <Input
            className={styles.input_cep}
            type="text"
            mask={['99999-999']}
            placeholder="00000-000"
            size="7"
            onChange={(event) => setCep(event.target.value)}
            value={cep}
          />
        </div>
        <Button className={styles.input_cep_btn} onClick={onCalculate}>
          Calcular
        </Button>
      </span>
      <span>
        <Link
          href={'https://buscacepinter.correios.com.br/app/endereco/index.php'}
        >
          <a rel="noreferrer noopener" target={'_blank'}>
            Não sei meu CEP
          </a>
        </Link>
      </span>
      <span>
        Ou retire em algum de nossos{' '}
        <Link href={'/vendedores'}>
          <a>vendedores!</a>
        </Link>
      </span>
    </div>
  );
};

ShipmentCalc.propTypes = {
  weight: PropTypes.number,
};

export default ShipmentCalc;
