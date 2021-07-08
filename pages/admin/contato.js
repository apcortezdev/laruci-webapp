import { useRef, useState } from 'react';
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
  const [email, setEmail] = useState(contactEmail);
  const [phoneSac, setPhoneSac] = useState(phone);
  const [facebook, setFacebook] = useState(facebookLink);
  const [instagram, setInstagram] = useState(instagramLink);
  const [whatsapp, setWhatsapp] = useState(whatsappNum);
  const [whatsappTemplateMessage, setWhatsappTemplateMessage] =
    useState(whatsappMessage);

  const setEmailValue = (event) => {
    setEmail(event.target.value);
  };

  const setPhoneSacValue = (event) => {
    setPhoneSac(event.target.value);
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

  return (
    <Admin>
      <div className={styles.wrapper}>
        <h1>Alterar Informações de Contato</h1>
        <h3>*Campos Obrigatórios</h3>
        <form className={styles.form}>
          <span className={styles.form_line}>
            <label htmlFor="email">*E-mail:</label>
            <Input
              id="email"
              type="email"
              placeholder="E-mail para contato"
              value={email}
              onChange={setEmailValue}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="phoneSac">*Telefone SAC:</label>
            <Input
              id="phoneSac"
              type="text"
              placeholder="Telefone de SAC"
              value={phoneSac}
              mask={'+99(99)9999-9999'}
              onChange={setPhoneSacValue}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="facebook">*Facebook:</label>
            <Input
              id="facebook"
              type="text"
              placeholder="Link do Facebook"
              value={facebook}
              onChange={setFacebookValue}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="instagram">*Instagram:</label>
            <Input
              id="instagram"
              type="text"
              placeholder="Link do Instagram"
              value={instagram}
              onChange={setInstagramValue}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="whatsapp">*WhatsApp:</label>
            <Input
              id="whatsapp"
              type="text"
              placeholder="Número de Whatsapp"
              value={whatsapp}
              onChange={setWhatsappValue}
              valid={false}
              validationMessage={'Bicha'}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="whatsapp">
              *Texto modelo para mensagem de WhatsApp:
            </label>
            <Textarea
              id="whatsapp"
              placeholder="Mensagem modelo de Whatsapp"
              rows={5}
              cols={15}
              value={whatsappTemplateMessage}
              onChange={setWhatsappTemplateValue}
            />
            <p>
              Este texto é um modelo que aparece no WhatsApp do cliente quando
              clicarem no ícone para enviar mensagem por chat.
            </p>
          </span>
          <span className={styles.form_line}>
            <Button className={styles.formButton}>Cancelar</Button>
            <Button className={styles.formButton}>Salvar</Button>
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
