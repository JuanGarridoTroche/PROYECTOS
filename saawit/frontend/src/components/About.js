import "../css/about.css";
import creators from "../services/about.json";


// Componente "Sobre nosotros" mostrado en footer
export const About = () => {
  return (
    <section>
      <h2>Sobre nosotros</h2>
      {creators.map((creator) => {
        return (
          <section key={creator.id} className="container-about">
            <img
              src={require(`../img/about-${creator.image}.png`)}
              alt={creator.image}
              className="image-about"
            />
            <article className="container-text-about">
              <p className="name-about">
                <strong>
                  {creator.name} {creator.lastname}
                </strong>
              </p>
              <p className="living-about">
                {creator.population}, {creator.province}, {creator.country}
              </p>
              {/* <p className="email-about">{creator.email}</p> */}
              <p className="job-about">{creator.job}</p>
              <p className="text-about">{creator.testimonial}</p>
              <figure className="social-media">
                <a
                  href={`mailto: ${creator.email}?subject=contratación&body=Contacta conmigo a través de este correo electrónico`}
                  alt={creator.mail}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/email.svg" alt="email" />
                </a>
                <a
                  href={creator.linkedin}
                  alt={creator.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/linkedin.svg" alt="linkedin" />
                </a>
                <a
                  href={creator.twitter}
                  alt={creator.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/twitter.svg" alt="twitter" />
                </a>
              </figure>
            </article>
          </section>
        );
      })}
    </section>
  );
};
