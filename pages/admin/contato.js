import { useState } from 'react';
import { useRouter } from 'next/router';
import Admin from '../../components/admin/Admin';
import { getFullContactInfo } from '../../data/contact';
import { Input, Textarea } from '../../components/utilities/FormComponents';
import styles from '../../styles/AdContactPage.module.scss';
import Button from '../../components/utilities/Button';

const ContactPage = ({
  contactEmail,
  facebookLink,
  instagramLink,
  whatsappNum,
  whatsappMessage,
  phone,
}) => {
  const router = useRouter();

  if (!router.pathname) {
    return (
      <Admin>
        <div className={styles.wrapper}>
          <p>Loading...</p>
        </div>
      </Admin>
    );
  }
  const [email, setEmail] = useState(contactEmail || '');
  const [emailValid, setEmailValid] = useState(true);
  const [phoneSac, setPhoneSac] = useState(phone || ['']);
  const [phoneSacValid, setPhoneSacValid] = useState(
    phone ? phone.map((p) => true) : [true]
  );
  const [phoneSacEmpty, setPhoneSacEmpty] = useState(true);
  const [facebook, setFacebook] = useState(facebookLink || '');
  const [facebookValid, setFacebookValid] = useState(true);
  const [instagram, setInstagram] = useState(instagramLink || '');
  const [instagramValid, setInstagramValid] = useState(true);
  const [whatsapp, setWhatsapp] = useState(whatsappNum || '');
  const [whatsappValid, setWhatsappValid] = useState(true);
  const [whatsappTemplateMessage, setWhatsappTemplateMessage] = useState(
    whatsappMessage || ''
  );
  const [whatsappTemplateMessageValid, setWhatsappTemplateMessageValid] =
    useState(true);

  const setEmailValue = (event) => {
    setEmail(event.target.value);
  };

  const setFacebookValue = (event) => {
    setFacebook(event.target.value);
  };

  const setInstagramValue = (event) => {
    setInstagram(event.target.value);
  };

  const setWhatsappValue = (event) => {
    setWhatsapp(event.target.value);
  };

  const setWhatsappTemplateValue = (event) => {
    setWhatsappTemplateMessage(event.target.value);
  };

  function setPhoneSacValue(i, event) {
    setPhoneSac((oldPhones) => {
      let phones = [...oldPhones];
      phones[i] = event.target.value;
      return phones;
    });
  }

  const saveContactData = (event) => {
    event.preventDefault();
    if (!email) {
      setEmailValid(false);
    }
    if (phoneSac.length === 0) {
      setPhoneSacEmpty(false);
    } else {
      phoneSac.forEach((element, i) => {
        if (!element) {
          setPhoneSacValid((valid) => {
            let newValids = [...valid];
            newValids[i] = false;
            return newValids;
          });
        }
      });
    }
    if (!facebook) {
      setFacebookValid(false);
    }
    if (!instagram) {
      setInstagramValid(false);
    }
    if (!whatsapp) {
      setWhatsappValid(false);
    }
    if (!whatsappTemplateMessage) {
      setWhatsappTemplateMessageValid(false);
    }
  };

  const resetContactData = (event) => {
    event.preventDefault();
    setEmail(contactEmail);
    setPhoneSac(phone);
    setFacebook(facebookLink);
    setInstagram(instagramLink);
    setWhatsapp(whatsappNum);
    setWhatsappTemplateMessage(whatsappMessage);
    router.replace({
      pathname: '/admin',
    });
  };

  const addPhoneSac = (event) => {
    event.preventDefault();
    setPhoneSacValid((valids) => [...valids, true]);
    setPhoneSac((oldPhones) => [...oldPhones, '']);
    setPhoneSacEmpty(true);
  };

  function removePhoneSac(i, event) {
    event.preventDefault();
    setPhoneSac((oldPhones) => {
      oldPhones.splice(i, 1);
      return [...oldPhones];
    });
    setPhoneSacValid((valids) => {
      valids.splice(i, 1);
      return [...valids];
    });
  }

  return (
    <Admin>
      <div className={styles.wrapper}>
        <h1>Alterar Informações de Contato</h1>
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
              Número para SAC deve ser de telefone fixo, incluir código
              internacional DDI e código de área DDD{' '}
              {'(ex: +55 (14) 1234-5678)'}, do tipo 3004 {'(ex: 3004-1234)'}, ou
              do tipo 0800 {'(ex: 0800 123-4567)'}
            </li>
            <li>
              Números de WhatsApp deve incluir código internacional DDI e código
              de área DDD {'(ex: +55 (14) 9 1234-5678)'}
            </li>
            <li>
              Links para redes sociais devem ser escritos por completo{' '}
              {'(ex: https://www.facebook.com/usuario.'} Em caso de dúvidas,
              abra o perfil da rede social, copie o link do navegador e cole no
              campo correspondente.
            </li>
            <li>
              Todos os campos do formulário abaixo são de preenchimento{' '}
              <u>obrigatório</u>.
            </li>
            <li>
              A <u>Mensagem padrão de WhatsApp</u> é um texto modelo que aparece
              no WhatsApp do cliente quando re-direcionado pelo site.
            </li>
          </ul>
        </div>
        <form className={styles.form}>
          <span className={styles.form_line}>
            <label htmlFor="email">E-mail:</label>
            <Input
              id="email"
              type="email"
              placeholder="E-mail para contato"
              value={email}
              valid={emailValid}
              onChange={setEmailValue}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="phoneSac">Número para SAC:</label>
            {phoneSac.length > 0 &&
              phoneSac.map((num, i) => (
                <span
                  key={`span_${num.trim().replace(/ /g,'')}_phoneSac_${i}`}
                  className={styles.form_inputAndButtons}
                >
                  <span className={styles.form_input}>
                    <Input
                      id={`inp_${num.trim().replace(/ /g,'')}_phoneSac_${i}`}
                      type="text"
                      placeholder="Adicionar número"
                      value={num}
                      mask={["+99 (99) 9999-9999", "9999 999-9999", "9999-9999"]}
                      valid={phoneSacValid[i]}
                      onBlur={setPhoneSacValue.bind(this, i)}
                    />
                  </span>
                  <Button
                    className={styles.minusButton}
                    onClick={removePhoneSac.bind(this, i)}
                  >
                    {'-'}
                  </Button>
                </span>
              ))}
            <span className={styles.form_inputAndButtons}>
              <span className={styles.form_input}>
                <Input
                  id="phoneSac"
                  type="text"
                  placeholder="Adicionar número"
                  valid={phoneSacEmpty}
                  disabled
                />
              </span>
              <Button className={styles.plusButton} onClick={addPhoneSac}>
                {'+'}
              </Button>
            </span>
          </span>
          <span className={styles.form_line}>
            <label htmlFor="facebook">Facebook:</label>
            <Input
              id="facebook"
              type="text"
              placeholder="Link do Facebook"
              value={facebook}
              valid={facebookValid}
              onChange={setFacebookValue}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="instagram">Instagram:</label>
            <Input
              id="instagram"
              type="text"
              placeholder="Link do Instagram"
              value={instagram}
              valid={instagramValid}
              onChange={setInstagramValue}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="whatsapp">Número de WhatsApp:</label>
            <Input
              id="whatsapp"
              type="text"
              placeholder="Adicionar número"
              value={whatsapp}
              onChange={setWhatsappValue}
              mask={["AAA 9999"]}
              // mask={["+99 (99) 9 9999-9999", "9999 999-9999", "9999-9999", "AA 9999"]}
              valid={whatsappValid}
              validationMessage={'Bicha'}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="whatsapp_message">Mensagem padrão de WhatsApp:</label>
            <Textarea
              id="whatsapp_message"
              placeholder="Mensagem modelo de Whatsapp"
              rows={5}
              cols={15}
              valid={whatsappTemplateMessageValid}
              value={whatsappTemplateMessage}
              onChange={setWhatsappTemplateValue}
            />
          </span>
          <span className={styles.form_line}>
            <Button className={styles.formButton} onClick={resetContactData}>
              Cancelar
            </Button>
            <Button className={styles.formButton} onClick={saveContactData}>
              Salvar
            </Button>
          </span>
        </form>
      </div>
    </Admin>
  );
};

export async function getServerSideProps() {
  const contact = getFullContactInfo();
  return {
    props: {
      contactEmail: contact.email,
      facebookLink: contact.facebookLink,
      instagramLink: contact.instagramLink,
      whatsappNum: contact.whatsappNum,
      whatsappMessage: contact.whatsappTemplateMessage,
      phone: contact.phoneSac,
    },
  };
}

export default ContactPage;
