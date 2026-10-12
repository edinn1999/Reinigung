// CleanPro Reinigungsservice

// Kontaktdaten hier eintragen – sie werden überall auf der Seite übernommen.
const KONTAKT = {
  telefon: "+49 000 0000000",
  email: "kontakt@example.de",
};

const telHref = "tel:" + KONTAKT.telefon.replace(/[^\d+]/g, "");
document.querySelectorAll("[data-phone-link]").forEach((a) => (a.href = telHref));
document.querySelectorAll("[data-phone-text]").forEach((a) => (a.textContent = KONTAKT.telefon));
document.querySelectorAll("[data-mail-link]").forEach((a) => {
  a.href = "mailto:" + KONTAKT.email;
  a.textContent = KONTAKT.email;
});
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Für Zuhause / Für Gewerbe
const ledes = {
  privat: document.querySelector("[data-lede-privat]"),
  gewerbe: document.querySelector("[data-lede-gewerbe]"),
};
const objekt = document.getElementById("b-objekt");
document.querySelectorAll("[data-audience]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const wahl = btn.dataset.audience;
    document.querySelectorAll("[data-audience]").forEach((b) => {
      const aktiv = b === btn;
      b.classList.toggle("is-active", aktiv);
      b.setAttribute("aria-pressed", String(aktiv));
    });
    ledes.privat.hidden = wahl !== "privat";
    ledes.gewerbe.hidden = wahl !== "gewerbe";
    objekt.value = wahl === "gewerbe" ? "Büro / Praxis" : "Wohnung";
  });
});

// Vorher/Nachher-Regler
document.querySelectorAll(".ba").forEach((fig) => {
  const range = fig.querySelector(".ba-range");
  const update = () => fig.style.setProperty("--pos", range.value + "%");
  range.addEventListener("input", update);
  update();
});

// Buchungsleiste und Leistungslinks füllen das Kontaktformular vor
const cLeistung = document.getElementById("c-leistung");
const cPlz = document.getElementById("c-plz");
const cNachricht = document.getElementById("c-nachricht");
const kontakt = document.getElementById("kontakt");

document.getElementById("booking").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  cLeistung.value = f.leistung.value;
  cPlz.value = f.plz.value;
  if (!cNachricht.value) cNachricht.value = "Objekt: " + f.objekt.value + "\n";
  kontakt.scrollIntoView();
  document.querySelector("#contact-form [name=name]").focus({ preventScroll: true });
});

document.querySelectorAll("[data-pick]").forEach((a) => {
  a.addEventListener("click", () => (cLeistung.value = a.dataset.pick));
});

// Kontaktformular: öffnet das E-Mail-Programm mit der fertigen Anfrage
const form = document.getElementById("contact-form");
const status = form.querySelector(".form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name;
  const email = form.email;
  name.removeAttribute("aria-invalid");
  email.removeAttribute("aria-invalid");

  let fehler = "";
  if (!name.value.trim()) {
    fehler = "Bitte geben Sie Ihren Namen ein.";
    name.setAttribute("aria-invalid", "true");
    name.focus();
  } else if (!email.validity.valid || !email.value.trim()) {
    fehler = "Bitte geben Sie eine gültige E-Mail-Adresse ein, damit wir antworten können.";
    email.setAttribute("aria-invalid", "true");
    email.focus();
  }
  if (fehler) {
    status.textContent = fehler;
    status.className = "form-status is-error";
    return;
  }

  const zeilen = [
    "Name: " + name.value.trim(),
    "Telefon: " + form.telefon.value.trim(),
    "E-Mail: " + email.value.trim(),
    "Leistung: " + form.leistung.value,
    "PLZ: " + form.plz.value.trim(),
    "",
    form.nachricht.value.trim(),
  ];
  const betreff = "Anfrage " + form.leistung.value + " – " + name.value.trim();
  window.location.href =
    "mailto:" + KONTAKT.email +
    "?subject=" + encodeURIComponent(betreff) +
    "&body=" + encodeURIComponent(zeilen.join("\n"));

  status.textContent = "Ihr E-Mail-Programm wurde geöffnet. Senden Sie die Anfrage dort ab.";
  status.className = "form-status is-ok";
});
