import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/AdNoticePage.module.scss';
import Admin from '../../components/admin/Admin';
import Button from '../../components/utilities/Button';
import ConfirmationDialog from '../../components/utilities/ConfirmationDialog';
import { Input, InputMask } from '../../components/utilities/FormComponents';
import { getNoticeJSON } from '../../data/notice';

const AdNoticePage = (props) => {
  const router = useRouter();

  if (props.user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }

  const [showConfirmation, setShowConfirmation] = useState(false);

  const notice = JSON.parse(props.notice);

  const [text, setText] = useState(notice.text || '');
  const [isNoticeValid, setIsNoticeValid] = useState(true);

  const [initialDate, setInitialDate] = useState();
  const [isInitialDateValid, setIsInitialDateValid] = useState(true);

  const [finalDate, setFinalDate] = useState();
  const [isFinalDateValid, setIsFinalDateValid] = useState(true);

  const onCancelHandler = (event) => {
    event.preventDefault();
    router.replace({ pathname: '/admin/' });
  };

  const onConfirmSaveHandler = (event) => {
    event.preventDefault();
    onDismissConfirmation(event);
    onSaveHandler(event);
  };

  const onSaveHandler = async (event) => {
    event.preventDefault();

    const newNotice = {
      id: notice.id || '',
      text: text,
      startDate: initialDate,
      endDate: finalDate,
    };

    const res = await fetch('/api/admin/notice', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notice: newNotice }),
    });

    if (res.status !== 200) {
      onCancelHandler(event);
    } else {
      window.alert('ERRO! Por favor contate o administrador');
    }
  };

  const setTextValue = (event) => {
    setText(event.target.value);
  };

  const setInitialDateValue = (event) => {
    setInitialDate(event.target.value);
  };

  const setFinalDateValue = (event) => {
    setFinalDate(event.target.value);
  };

  const onShowConfirmation = (event) => {
    event.preventDefault();
    setShowConfirmation(true);
  };

  const onDismissConfirmation = (event) => {
    event.preventDefault();
    setShowConfirmation(false);
  };

  return (
    <Admin>
      <div className={styles.wrapper}>
        <h1>Alterar Aviso da Página Principal</h1>
        <div>
          ATENÇÃO: <br />
          <ul>
            <li>
              Tenha certeza de que as informações desta página estão corretas e
              atualizadas. Altere-as com cuidado!
            </li>
            <li>
              Alterações poderão <u> demorar até 24 horas</u> para serem
              atualizadas no site.
            </li>
            <li>
              Este aviso aparecerá no topo da página quando visitada pelo
              cliente. Caso deseje que nenhum aviso seja mostrado, deixe o campo
              em branco.
            </li>
            <li>
              As datas estipulam um limite de tempo em que o aviso estará à
              mostra no site.
            </li>
          </ul>
        </div>
        <form className={styles.form}>
          <span className={styles.form_line}>
            <label htmlFor="notice">Aviso:</label>
            <Input
              id="notice"
              type="text"
              placeholder="Sem Aviso"
              value={text}
              valid={isNoticeValid}
              onChange={setTextValue}
              validationMessage={'Tem algo errado neste campo'}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="initial_date">Datas:</label>
            <span className={styles.form_input_dates}>
              <label htmlFor="initial_date">De:</label>
              <InputMask
                id="initial_date"
                type="text"
                placeholder="Sem data"
                mask={['99/99/9999']}
                valid={isInitialDateValid}
                onChange={setInitialDateValue}
                validationMessage={'Tem algo errado neste campo'}
                className={styles.input_date}
              />
              <label htmlFor="final_date">Até:</label>
              <InputMask
                id="final_date"
                type="text"
                placeholder="Sem data"
                mask={['99/99/9999']}
                valid={isFinalDateValid}
                onChange={setFinalDateValue}
                validationMessage={'Tem algo errado neste campo'}
                className={styles.input_date}
              />
            </span>
          </span>
          <span className={styles.form_line}>
            <Button className={styles.formButton} onClick={onCancelHandler}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className={styles.formButton}
              onClick={onShowConfirmation}
            >
              Salvar
            </Button>
          </span>
        </form>
      </div>
      <ConfirmationDialog
        show={showConfirmation}
        onCancel={onDismissConfirmation}
        onConfirm={onConfirmSaveHandler}
      />
    </Admin>
  );
};

export async function getServerSideProps() {
  const notice = await getNoticeJSON();

  const propNotice = {
    id: notice._id || '',
    text: notice.text || '',
    startDate: notice.startDate || '',
    endDate: notice.endDate || '',
    createdDate: notice.createdDate || '',
  };

  return {
    props: {
      user: 'admin',
      notice: notice,
    },
  };
}

export default AdNoticePage;
