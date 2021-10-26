import Head from 'next/Head';
import Image from 'next/image';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import dfStyles from '../../../styles/loja/Defaults.module.scss';
import Button from '../../../components/utilities/Button';
import FacebookIconLink from '../../../components/utilities/FacebookIconLink';
import InstagramIconLink from '../../../components/utilities/InstagramIconLink';
import WhatsappIconLink from '../../../components/utilities/WhatsappIconLink';
import styles from '../../../styles/loja/ContactPage.module.scss';
import {
  Input,
  masker,
  Textarea,
} from '../../../components/utilities/FormComponents';
import { useRef } from 'react';
import {
  getCategories,
  getContact,
  getContactMosaic,
  getSocialContact,
  getTopNotice,
} from '../../../data/access/appInfo';

const ContactPage = ({
  notice,
  domain,
  mosaic,
  facebookName,
  instagramName,
  whatsappNum,
  categoryList,
  facebookLink,
  instagramLink,
  whatsappLink,
  contactEmail,
  phoneSac,
  addressOne,
  addressTwo,
  addressCep,
  city,
  state,
}) => {
  const email = useRef();
  const subject = useRef();
  const message = useRef();

  const sendEmail = (event) => {
    event.preventDefault();
    email.current.focus();
  };

  return (
    <Main
      notice={notice}
      categoryList={categoryList}
      footerLinks={{
        facebook: facebookLink,
        instagram: instagramLink,
        whatsapp: whatsappLink,
      }}
    >
      <Head>
        <title>Laruci - Login</title>
        <meta name="description" content={'Página de contato Laruci'} />
        <link href={`${domain}/loja/contato`} rel="canonical" />
      </Head>
      <Store notice={!!notice} categoryList={categoryList}>
        <div
          className={[
            dfStyles.content,
            dfStyles.flex_center,
            dfStyles.flex_column,
            dfStyles.h_100,
          ].join(' ')}
        >
          <div className={[styles.page, styles.flex_center].join(' ').trim()}>
            <table id="mosaic" className={styles.mosaic}>
              <tbody>
                <tr>
                  {mosaic.map((pic) => (
                    <td key={pic.src} className={styles.mosaic_item_web}>
                      <Image
                        src={pic.src}
                        alt={pic.alt}
                        loading="eager"
                        objectFit="cover"
                        layout="fill"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <section className={styles.socials}>
              <span className={styles.contact_text}>
                Clique em uma de nossas redes sociais:
              </span>
              <div className={styles.social_container}>
                <span
                  className={[styles.social_icon, styles.social_face]
                    .join(' ')
                    .trim()}
                >
                  <FacebookIconLink link={facebookLink} />
                </span>
                <span
                  className={[styles.social_icon, styles.social_inst]
                    .join(' ')
                    .trim()}
                >
                  <InstagramIconLink link={instagramLink} />
                </span>
                <span
                  className={[styles.social_icon, styles.social_what]
                    .join(' ')
                    .trim()}
                >
                  <WhatsappIconLink link={whatsappLink} />
                </span>
              </div>
            </section>
            <article className={styles.contact}>
              <section className={styles.info}>
                <table>
                  <tbody>
                    <tr>
                      <td>{facebookName}</td>
                      <td>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          className={styles.icon}
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td>{instagramName}</td>
                      <td>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          className={styles.icon}
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td>{contactEmail}</td>
                      <td>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          className={styles.icon}
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td>{masker(whatsappNum, '+ 99 (99) 9 9999-9999')}</td>
                      <td>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          className={styles.icon}
                          viewBox="0 0 16 16"
                        >
                          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {phoneSac.map((phone) => {
                          let text = phone.startsWith('55')
                            ? phone.slice(2)
                            : phone;
                          let mask;
                          if (phone.length === 12) mask = '(99) 9 9999-9999';
                          if (phone.length === 10) mask = '(99) 9999-9999';
                          if (phone.length === 11) mask = '9999 999 9999';
                          if (phone.length === 8) mask = '9999-9999';
                          return <p key={phone}>{masker(text, mask)}</p>;
                        })}
                      </td>
                      <td>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          className={styles.icon}
                          viewBox="0 0 16 16"
                        >
                          <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49a68.14 68.14 0 0 0-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 74.663 74.663 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199V2.5zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0zm-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233c.18.01.359.022.537.036 2.568.189 5.093.744 7.463 1.993V3.85zm-9 6.215v-4.13a95.09 95.09 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A60.49 60.49 0 0 1 4 10.065zm-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68.019 68.019 0 0 0-1.722-.082z" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>{addressOne}</p>
                        <p>{addressTwo}</p>
                        <p>{city + ' - ' + state.toUpperCase()}</p>
                        <p>{addressCep}</p>
                      </td>
                      <td>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          className={styles.icon}
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                          <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        </svg>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.messenger}>
                <form className={styles.contact_form}>
                  <span className={styles.contact_inputline}>
                    <Input
                      refs={email}
                      id="email"
                      type="email"
                      placeholder="E-mail"
                      required
                    />
                  </span>
                  <span className={styles.contact_inputline}>
                    <Input
                      refs={subject}
                      id="subject"
                      type="text"
                      placeholder="Assunto"
                      validationMessage="Coloque um assunto na mensagem!"
                      required
                    />
                  </span>
                  <span className={styles.contact_inputline}>
                    <Textarea
                      refs={message}
                      id="message"
                      rows="10"
                      cols="20"
                      placeholder="Mensagem"
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
            </article>
          </div>
        </div>
      </Store>
    </Main>
  );
};

export async function getStaticProps() {

  const notice = await getTopNotice();
  const categories = await getCategories();
  const contact = await getContact();
  const social = await getSocialContact();
  const mosaic = await getContactMosaic();
  const facebook = 'https://facebook.com/' + social.facebookName;
  const instagtam = 'https://instagram.com/' + social.instagramName;
  const whatsapp = `https://wa.me/${
    social.whatsappNum
  }?text=${encodeURIComponent(social.whatsappMessage)}`;

  return {
    props: {
      notice: notice,
      domain: process.env.MAIN_DOMAIN,
      mosaic: mosaic,
      categoryList: categories,
      facebookName: social.facebookName,
      instagramName: social.instagramName,
      whatsappNum: social.whatsappNum,
      facebookLink: facebook,
      instagramLink: instagtam,
      whatsappLink: whatsapp,
      contactEmail: contact.email,
      phoneSac: contact.phones,
      addressOne: contact.addressOne,
      addressTwo: contact.addressTwo,
      addressCep: contact.addressCep,
      city: contact.city,
      state: contact.state,
    },
  };
}

export default ContactPage;
