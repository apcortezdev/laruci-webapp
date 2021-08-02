import { useRouter } from 'next/router';
import Admin from '../../components/admin/Admin';
import { Input } from '../../components/utilities/FormComponents';
import Button from '../../components/utilities/Button';
import styles from '../../styles/AdNoticePage.module.scss';
import { getNotice } from '../../data/notice';
import { useState } from 'react';

const AdNoticePage = (props) => {
  const router = useRouter();

  if (props.user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }

  const notice = JSON.parse(props.notice)

  const [text, setText] = useState(notice.text || '');
  const [isNoticeValid, setIsNoticeValid] = useState(true);

  const date = notice.startDate ? new Date(notice.startDate) : null;
  const [initialDate, setInitialDate] = useState();
  const [isInitialDateValid, setIsInitialDateValid] = useState(true);

  const [finalDate, setFinalDate] = useState();
  const [isFinalDateValid, setIsFinalDateValid] = useState(true);

  const resetNoticeData = (event) => {
    event.preventDefault();
    router.replace({ pathname: '/admin/' });
  };

  const saveNoticeData = async (event) => {
    event.preventDefault();

    const newNotice = {
      text: text,
      startDate: initialDate,
      endDate: finalDate,
    };

    const res = await fetch('/api/admin/notice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notice: newNotice }),
    });

    console.log(res);
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
              <Input
                id="initial_date"
                type="text"
                placeholder="Sem data"
                // mask={['99/99/9999']}
                valid={isInitialDateValid}
                onChange={setInitialDateValue}
                validationMessage={'Tem algo errado neste campo'}
                className={styles.input_date}
              />
              <label htmlFor="final_date">Até:</label>
              <Input
                id="final_date"
                type="text"
                placeholder="Sem data"
                // mask={['99/99/9999']}
                valid={isFinalDateValid}
                onChange={setFinalDateValue}
                validationMessage={'Tem algo errado neste campo'}
                className={styles.input_date}
              />
            </span>
          </span>
          <span className={styles.form_line}>
            <Button className={styles.formButton} onClick={resetNoticeData}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className={styles.formButton}
              onClick={saveNoticeData}
            >
              Salvar
            </Button>
          </span>
        </form>
      </div>
    </Admin>
  );
};

export async function getServerSideProps() {
  let notice;
  try {
    notice = await getNotice();
  } catch (err) {
    return { notFound: true };
  }

  const propNotice = {
    text: notice.text || '',
    startDate: notice.startDate || '',
    endDate: notice.endDate || '',
    createdDate: notice.createdDate || ''
  }

  return {
    props: {
      user: 'admin',
      notice: JSON.stringify(propNotice),
    },
  };
}

export default AdNoticePage;
