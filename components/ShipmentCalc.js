import Link from 'next/link';
import styles from '../styles/ShipmentCalc.module.scss';
import Button from './utilities/Button';

const ShipmentCalc = (props) => {
  return (
    <div className={styles.shipmentcalc_container}>
      <span>Calcular Entrega:</span>
      <span>Informe seu CEP para consultar prazos de entrega na sua casa</span>
      <span className={styles.check_cep}>
        <input
          className={styles.input_cep}
          type="text"
          pattern="[0-9]{5}-/[0-9]{3}"
          placeholder="00000-000"
          maxLength="9"
          size="7"
        />
        <Button className={styles.input_cep_btn}>Calcular</Button>
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

ShipmentCalc.propTypes = {};

export default ShipmentCalc;
