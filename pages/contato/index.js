import Button from '../../components/utilities/Button';
import FacebookIconLink from '../../components/utilities/FacebookIconLink';
import InstagramIconLink from '../../components/utilities/InstagramIconLink';
import WhatsappIconLink from '../../components/utilities/WhatsappIconLink';
import styles from '../../styles/ContactPage.module.scss';
import { getFullContact } from '../../data/contact';
import { useRef } from 'react';
import { Input, Textarea } from '../../components/utilities/FormComponents';
import Store from '../../components/store/Store';

const ContactPage = ({
  contactEmail,
  facebookLink,
  instagramLink,
  whatsappLink,
  phoneSac,
}) => {
  if (!phoneSac) {
    return <p>Loading</p>;
  }

  const email = useRef();
  const subject = useRef();
  const message = useRef();

  const sendEmail = (event) => {
    event.preventDefault();
    email.current.focus();
  };

  return (
    <Store>
      <div className={[styles.page, styles.flex_center].join(' ')}>
        <section className={[styles.section, styles.flex_center].join(' ')}>
          <span className={styles.contact_text}>
            Clique em uma de nossas redes sociais:
          </span>
          <div className={styles.social_container}>
            <span
              className={[styles.social_icon, styles.social_face].join(' ')}
            >
              <FacebookIconLink link={facebookLink} />
            </span>
            <span
              className={[styles.social_icon, styles.social_inst].join(' ')}
            >
              <InstagramIconLink link={instagramLink} />
            </span>
            <span
              className={[styles.social_icon, styles.social_what].join(' ')}
            >
              <WhatsappIconLink link={whatsappLink} />
            </span>
          </div>
        </section>
        <section
          className={[
            styles.flex_center,
            styles.section,
            styles.section_separator,
          ].join(' ')}
        >
          <span className={styles.contact_text}>
            Entre em contato por email:
          </span>
          <form className={styles.contact_form}>
            <span className={styles.contact_inputline}>
              <label className={styles.contact_label} htmlFor="email">
                Seu email:
              </label>
              <Input
                refs={email}
                id="email"
                type="email"
                placeholder="Digite seu e-mail aqui"
                required
              />
            </span>
            <span className={styles.contact_inputline}>
              <label className={styles.contact_label} htmlFor="subject">
                Assunto:
              </label>
              <Input
                refs={subject}
                id="subject"
                type="text"
                placeholder="Digite o assunto da mensagem"
                validationMessage="Coloque um assunto na mensagem!"
                required
              />
            </span>
            <span className={styles.contact_inputline}>
              <label className={styles.contact_label} htmlFor="message">
                Mensagem:
              </label>
              <Textarea
                refs={message}
                id="message"
                rows="10"
                cols="20"
                placeholder="Digite sua mensagem"
                validationMessage="Seu contato precisa de uma mensagem!"
                required
              />
            </span>
            <span className={styles.contact_inputline}>
              <Button
                className={styles.button}
                type="submit"
                onClick={sendEmail}
              >
                Enviar
              </Button>
            </span>
          </form>
        </section>
        <section
          className={[
            styles.flex_center,
            styles.section,
            styles.section_separator,
          ].join(' ')}
        >
          <span className={styles.contact_text}>
            Ou entre em contato pelo telefone:
          </span>
          <span className={styles.contact_text}>{`SAC: ${phoneSac}`}</span>
        </section>
      </div>
    </Store>
  );
};

export async function getStaticProps() {
  const contact = getFullContact();
  return {
    props: {
      contactEmail: contact.email,
      facebookLink: contact.facebook,
      instagramLink: contact.instagram,
      whatsappLink: contact.whatsapp,
      phoneSac: contact.phoneSac,
    },
  };
}

export default ContactPage;
