import Button from '../../components/utilities/Button';
import FacebookLink from '../../components/utilities/FacebookLink';
import InstagramLink from '../../components/utilities/InstagramLink';
import WhatsappLink from '../../components/utilities/WhatsappLink';
import styles from '../../styles/ContactPage.module.scss';

const ContactPage = (props) => {

  const sendEmail = (event) => {
    event.preventDefault();
  }
  
  return (
    <div className={styles.main}>
      <div className={styles.aside} />
      <div className={styles.flex_center}>
        <section className={[styles.section, styles.flex_center].join(' ')}>
          <span className={styles.contact_text}>
            Clique em uma de nossas redes sociais:
          </span>
          <div className={styles.social_container}>
            <span
              className={[styles.social_icon, styles.social_face].join(' ')}
            >
              <FacebookLink />
            </span>
            <span
              className={[styles.social_icon, styles.social_inst].join(' ')}
            >
              <InstagramLink />
            </span>
            <span
              className={[styles.social_icon, styles.social_what].join(' ')}
            >
              <WhatsappLink />
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
              <input
                className={styles.contact_inputtxt}
                id="email"
                type="text"
              />
            </span>
            <span className={styles.contact_inputline}>
              <label className={styles.contact_label} htmlFor="subject">
                Assunto:
              </label>
              <input
                className={styles.contact_inputtxt}
                id="subject"
                type="text"
              />
            </span>
            <span className={styles.contact_inputline}>
              <label className={styles.contact_label} htmlFor="message">
                Mensagem:
              </label>
              <textarea
                className={styles.contact_inputtxt}
                id="message"
                rows="10"
                cols="20"
              />
            </span>
            <span className={styles.contact_inputline}>
              <Button className={styles.button} type="submit" onClick={sendEmail}>
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
          <span className={styles.contact_text}>
            {'SAC: +55 (14)  3218-2634'}
          </span>
        </section>
      </div>
      <div className={styles.aside} />
    </div>
  );
};

export default ContactPage;
