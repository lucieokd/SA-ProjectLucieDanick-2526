import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function About() {
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <header className="mb-5">
            <h1 className="display-5 fw-bold mb-3">Over deze app</h1>
            <p className="text-muted lead">Kort, duidelijk en transparant — dit is wat we verzamelen en waarom.</p>
          </header>

          <section className="d-flex flex-column gap-4">
            <div className="card shadow-sm">
              <div className="card-body d-flex gap-3">
                <i className="bi bi-info-circle fs-4 text-primary flex-shrink-0"></i>
                <div>
                  <h2 className="card-title h5 fw-semibold mb-2">Wat doet deze app?</h2>
                  <p className="card-text small mb-0">
                    Deze applicatie helpt gebruikers muziek te ontdekken en gepersonaliseerde aanbevelingen te
                    tonen (FYP — "For Your Profile" / aanbevelingsalgoritme). De interface toont charts, artiesten
                    en songinformatie opgehaald via externe muziek-API's.
                  </p>
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body d-flex gap-3">
                <i className="bi bi-music-note-beamed fs-4 text-primary flex-shrink-0"></i>
                <div>
                  <h2 className="card-title h5 fw-semibold mb-2">Welke externe APIs gebruiken we?</h2>
                  <ul className="small mb-2">
                    <li>
                      <strong>iTunes Search API</strong> — voor song- en albummetadata, artwork en preview-links.
                    </li>
                    <li className="mt-1">
                      <strong>Spotify API</strong> — voor artiestgegevens, top-tracks en aanvullende muziekdata.
                    </li>
                  </ul>
                  <p className="card-text small mb-0">Deze APIs leveren publieke muziekdata; we slaan geen API-keys van gebruikers op.</p>
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body d-flex gap-3">
                <i className="bi bi-database fs-4 text-primary flex-shrink-0"></i>
                <div>
                  <h2 className="card-title h5 fw-semibold mb-2">Welke gebruikersgegevens vragen we?</h2>
                  <p className="card-text small mb-2">
                    Enkel de gegevens die nodig zijn om jouw ervaring te personaliseren en je profiel op te bouwen. Dit
                    omvat meestal:
                  </p>
                  <ul className="small mb-2">
                    <li>e-mailadres (gebruikt voor authenticatie)</li>
                    <li>voornaam en achternaam (optioneel, voor profielweergave)</li>
                    <li>favoriete artiesten of voorkeuren (optioneel — gebruikt door het FYP-algoritme)</li>
                  </ul>
                  <p className="card-text small mb-0">Deze gegevens worden uitsluitend gebruikt om betere aanbevelingen te maken.</p>
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body d-flex gap-3">
                <i className="bi bi-shield-check fs-4 text-primary flex-shrink-0"></i>
                <div>
                  <h2 className="card-title h5 fw-semibold mb-2">Hoe bewaren en beveiligen we data?</h2>
                  <p className="card-text small mb-2">
                    We bewaren minimale profielgegevens en voorkeuren in beveiligde opslag (bijvoorbeeld Firebase
                    Authentication + Firestore). Alleen geautoriseerde onderdelen van de applicatie hebben toegang.
                  </p>
                  <p className="card-text small mb-0">
                    We verkopen of verhuren je gegevens nooit. We delen je data niet met externe partijen, behalve
                    waar technisch noodzakelijk (bijv. calls naar de muziek-APIs om nummers en artwork op te halen).
                  </p>
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body d-flex gap-3">
                <i className="bi bi-envelope fs-4 text-primary flex-shrink-0"></i>
                <div>
                  <h2 className="card-title h5 fw-semibold mb-2">Waarom vragen we deze gegevens?</h2>
                  <p className="card-text small mb-0">
                    De gevraagde informatie wordt gebruikt door ons FYP-algoritme om relevante muziek en artiesten
                    voor jou te selecteren. Zonder deze gegevens zijn aanbevelingen minder gepersonaliseerd.
                  </p>
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body d-flex gap-3">
                <i className="bi bi-shield-check fs-4 text-primary flex-shrink-0"></i>
                <div>
                  <h2 className="card-title h5 fw-semibold mb-2">Jouw rechten & opties</h2>
                  <ul className="small mb-0">
                    <li>Je kan je profielgegevens inzien en aanpassen via de profielpagina.</li>
                    <li>Je kan jouw account verwijderen — alle persoonsgegevens worden dan gewist uit onze database.</li>
                    <li>Als je vragen of verzoeken hebt over privacy, contacteer ons (zie hieronder).</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body d-flex gap-3">
                <i className="bi bi-envelope fs-4 text-primary flex-shrink-0"></i>
                <div>
                  <h2 className="card-title h5 fw-semibold mb-2">Contact & volledige privacyverklaring</h2>
                  <p className="card-text small mb-0">
                    Voor vragen of het volledige privacybeleid, stuur een e-mail naar <a className="text-decoration-underline" href="mailto:privacy@example.com">privacy@example.com</a>
                    {' '}of bekijk de volledige privacyverklaring op de site (placeholder).
                  </p>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-5 text-center text-muted small">
            <p className="mb-0">
              Deze pagina is opgesteld door het projectteam voor je FYP. Vermeldingen van externe APIs: iTunes Search
              API en Spotify API (publieke endpoints). Deze app gebruikt gebruikersdata alleen voor persoonlijke
              aanbevelingen en study-doeleinden.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
