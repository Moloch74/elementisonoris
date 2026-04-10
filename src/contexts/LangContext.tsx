import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "it" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.chiSiamo": { it: "CHI SIAMO", en: "ABOUT US" },
  "nav.catalogo": { it: "CATALOGO", en: "CATALOG" },
  "nav.shop": { it: "SHOP", en: "SHOP" },
  "nav.eventi": { it: "EVENTI", en: "EVENTS" },
  "nav.contatti": { it: "CONTATTI", en: "CONTACT" },
  "nav.esci": { it: "ESCI", en: "LOGOUT" },
  "nav.accedi": { it: "ACCEDI", en: "LOGIN" },

  // Footer
  "footer.navigazione": { it: "NAVIGAZIONE", en: "NAVIGATION" },
  "footer.social": { it: "SOCIAL", en: "SOCIAL" },
  "footer.copyright": { it: "UNDERGROUND RECORDS SHOP", en: "UNDERGROUND RECORDS SHOP" },

  // Hero (Index)
  "hero.subtitle": { it: "UNDERGROUND VINYL & STREETWEAR — LECCE", en: "UNDERGROUND VINYL & STREETWEAR — LECCE" },
  "hero.cta1": { it: "ESPLORA IL CATALOGO", en: "EXPLORE THE CATALOG" },
  "hero.cta2": { it: "CHI SIAMO", en: "ABOUT US" },
  "index.followScene": { it: "SEGUICI NELLA SCENA", en: "FOLLOW THE SCENE" },

  // Index - Chi Siamo Preview
  "index.sound": { it: "IL SUONO", en: "THE SOUND" },
  "index.underground": { it: "UNDERGROUND", en: "UNDERGROUND" },
  "index.chiSiamoDesc1": { it: "Elementi Sonori nasce a Lecce, in Via Sozy Carafa 31B, come punto di riferimento per chi vive la musica come cultura, non come sottofondo.", en: "Elementi Sonori was born in Lecce, at Via Sozy Carafa 31B, as a reference point for those who live music as culture, not background noise." },
  "index.chiSiamoDesc2": { it: "Dalla techno più oscura all'house più groovy, dall'acid al jungle, selezioniamo solo vinili che raccontano una storia.", en: "From the darkest techno to the grooviest house, from acid to jungle, we select only vinyl that tells a story." },
  "index.vinili": { it: "VINILI", en: "VINYLS" },
  "index.anni": { it: "ANNI", en: "YEARS" },
  "index.passione": { it: "PASSIONE", en: "PASSION" },
  "index.scopriDiPiu": { it: "SCOPRI DI PIÙ", en: "LEARN MORE" },

  // Index - Gallery
  "index.dal": { it: "DAL", en: "FROM THE" },
  "index.dancefloor": { it: "DANCEFLOOR", en: "DANCEFLOOR" },
  "index.gallerySubtitle": { it: "VINILI • STREETWEAR • RAVE CULTURE", en: "VINYL • STREETWEAR • RAVE CULTURE" },

  // Index - Catalogo Preview
  "index.catalogoTitle": { it: "CATALOGO", en: "CATALOG" },
  "index.catalogoSubtitle": { it: "SFOGLIA PER GENERE — SCOPRI IL TUO SUONO", en: "BROWSE BY GENRE — FIND YOUR SOUND" },
  "index.vediTuttoCatalogo": { it: "VEDI TUTTO IL CATALOGO", en: "VIEW FULL CATALOG" },
  "index.genre.techno.desc": { it: "Pura potenza dal dancefloor", en: "Pure dancefloor power" },
  "index.genre.house.desc": { it: "Groove senza compromessi", en: "Uncompromised groove" },
  "index.genre.acid.desc": { it: "Il suono della 303", en: "The sound of the 303" },
  "index.genre.jungle.desc": { it: "Breakbeat a velocità folle", en: "Breakbeat at insane speed" },
  "index.genre.electro.desc": { it: "Electro funk futuristico", en: "Futuristic electro funk" },
  "index.genre.ambient.desc": { it: "Paesaggi sonori profondi", en: "Deep soundscapes" },
  "index.dischi": { it: "dischi", en: "records" },

  // Index - Eventi Preview
  "index.eventiTitle": { it: "EVENTI", en: "EVENTS" },
  "index.prossimiAppuntamenti": { it: "PROSSIMI APPUNTAMENTI", en: "UPCOMING EVENTS" },
  "index.tuttiGliEventi": { it: "TUTTI GLI EVENTI", en: "ALL EVENTS" },

  // Index - Streetwear
  "index.abbigliamento": { it: "[ABBIGLIAMENTO]", en: "[CLOTHING]" },
  "index.streetwearDesc1": { it: "Non solo vinili. Elementi Sonori è anche streetwear underground: felpe, t-shirt e accessori per chi vive la cultura rave come stile di vita.", en: "Not just vinyl. Elementi Sonori is also underground streetwear: hoodies, t-shirts and accessories for those who live rave culture as a lifestyle." },
  "index.streetwearDesc2": { it: "Ogni capo è selezionato o prodotto in edizione limitata, ispirato alla scena techno, acid e jungle. Indossa il suono.", en: "Every piece is selected or produced in limited edition, inspired by the techno, acid and jungle scene. Wear the sound." },
  "index.accessori": { it: "ACCESSORI", en: "ACCESSORIES" },
  "index.scopriCollezione": { it: "SCOPRI LA COLLEZIONE", en: "DISCOVER THE COLLECTION" },

  // Index - Community
  "index.community": { it: "COMMUNITY", en: "COMMUNITY" },
  "index.communitySubtitle": { it: "COSA DICE CHI CI CONOSCE", en: "WHAT PEOPLE SAY ABOUT US" },
  "index.quote1": { it: "Il miglior negozio di vinili del Sud Italia. Punto.", en: "The best vinyl shop in Southern Italy. Period." },
  "index.quote2": { it: "Ogni volta che entro esco con almeno 5 dischi. La selezione è pazzesca.", en: "Every time I walk in I leave with at least 5 records. The selection is insane." },
  "index.quote3": { it: "Non è un negozio, è un tempio. Atmosfera unica, gente vera.", en: "It's not a shop, it's a temple. Unique atmosphere, real people." },
  "index.role.dj": { it: "DJ / Producer", en: "DJ / Producer" },
  "index.role.collector": { it: "Collezionista", en: "Collector" },
  "index.role.organizer": { it: "Organizzatore eventi", en: "Event organizer" },

  // Index - Dove Siamo
  "index.dove": { it: "DOVE", en: "WHERE" },
  "index.siamo": { it: "SIAMO", en: "WE ARE" },
  "index.dom": { it: "Dom: Chiuso", en: "Sun: Closed" },
  "index.contattaci": { it: "CONTATTACI", en: "CONTACT US" },

  // Chi Siamo page
  "chiSiamo.laNostraStoria": { it: "[LA NOSTRA STORIA]", en: "[OUR STORY]" },
  "chiSiamo.ilSuono": { it: "IL SUONO", en: "THE SOUND" },
  "chiSiamo.subtitle": { it: "Dal 2015 a Lecce, il punto di riferimento per chi vive la musica come cultura.", en: "Since 2015 in Lecce, the reference point for those who live music as culture." },
  "chiSiamo.nonUnNegozio": { it: "NON UN", en: "NOT A" },
  "chiSiamo.negozio": { it: "NEGOZIO", en: "SHOP" },
  "chiSiamo.presidio": { it: "UN PRESIDIO CULTURALE.", en: "A CULTURAL OUTPOST." },
  "chiSiamo.desc1": { it: "Elementi Sonori nasce a Lecce, in Via Sozy Carafa 31B, come punto di riferimento per chi vive la musica come cultura, non come sottofondo. Un negozio di vinili e streetwear underground che è anche rifugio, archivio e punto di incontro per la scena del Salento.", en: "Elementi Sonori was born in Lecce, at Via Sozy Carafa 31B, as a reference point for those who live music as culture, not background noise. An underground vinyl and streetwear shop that is also a refuge, archive and meeting point for the Salento scene." },
  "chiSiamo.desc2": { it: "Dalla techno più oscura all'house più groovy, dall'acid al jungle, selezioniamo solo vinili che raccontano una storia. Ogni disco nelle nostre casse è stato scelto con cura da chi il dancefloor lo vive davvero.", en: "From the darkest techno to the grooviest house, from acid to jungle, we select only vinyl that tells a story. Every record in our crates has been carefully chosen by someone who truly lives the dancefloor." },
  "chiSiamo.desc3": { it: "Non solo un negozio — un presidio culturale dove il vinile è ancora il re e lo streetwear è la nostra seconda pelle.", en: "Not just a shop — a cultural outpost where vinyl is still king and streetwear is our second skin." },
  "chiSiamo.iNostri": { it: "I NOSTRI", en: "OUR" },
  "chiSiamo.valori": { it: "VALORI", en: "VALUES" },
  "chiSiamo.cosaCiMuove": { it: "COSA CI MUOVE", en: "WHAT DRIVES US" },
  "chiSiamo.value1.title": { it: "SOLO VINILE", en: "VINYL ONLY" },
  "chiSiamo.value1.desc": { it: "Niente digitale, niente compromessi. Il vinile è il nostro linguaggio.", en: "No digital, no compromises. Vinyl is our language." },
  "chiSiamo.value2.title": { it: "ASCOLTO PRIMA", en: "LISTEN FIRST" },
  "chiSiamo.value2.desc": { it: "Ogni disco viene ascoltato e selezionato prima di entrare nelle casse.", en: "Every record is listened to and selected before entering the crates." },
  "chiSiamo.value3.title": { it: "CULTURA", en: "CULTURE" },
  "chiSiamo.value3.desc": { it: "Non vendiamo musica. Diffondiamo cultura underground.", en: "We don't sell music. We spread underground culture." },
  "chiSiamo.value4.title": { it: "COMMUNITY", en: "COMMUNITY" },
  "chiSiamo.value4.desc": { it: "Un punto di ritrovo per DJ, collezionisti e appassionati del Salento.", en: "A meeting point for DJs, collectors and enthusiasts of Salento." },
  "chiSiamo.ilNegozio": { it: "IL", en: "THE" },
  "chiSiamo.negozioWord": { it: "NEGOZIO", en: "SHOP" },
  "chiSiamo.la": { it: "LA", en: "THE" },
  "chiSiamo.timeline": { it: "TIMELINE", en: "TIMELINE" },
  "chiSiamo.dalPrimoDisco": { it: "DAL PRIMO DISCO AD OGGI", en: "FROM THE FIRST RECORD TO TODAY" },
  "chiSiamo.timeline1": { it: "Nasce l'idea: un punto di riferimento per la scena underground del Salento.", en: "The idea is born: a reference point for the Salento underground scene." },
  "chiSiamo.timeline2": { it: "Apertura del negozio in Via Sozy Carafa 31B, Lecce. Le prime casse di vinili.", en: "Shop opens at Via Sozy Carafa 31B, Lecce. The first crates of vinyl." },
  "chiSiamo.timeline3": { it: "Primo evento in-store: VINYL ONLY NIGHT. Sold out immediato.", en: "First in-store event: VINYL ONLY NIGHT. Instantly sold out." },
  "chiSiamo.timeline4": { it: "Superati i 3000 vinili in catalogo. Inizia la collaborazione con Discogs.", en: "Over 3000 vinyls in catalog. Collaboration with Discogs begins." },
  "chiSiamo.timeline5": { it: "Lancio della linea streetwear underground. I murales trasformano il negozio.", en: "Launch of the underground streetwear line. Murals transform the shop." },
  "chiSiamo.timeline6": { it: "5000+ vinili, eventi regolari, una community che cresce ogni giorno.", en: "5000+ vinyls, regular events, a community growing every day." },
  "chiSiamo.laNostraArte": { it: "LA NOSTRA", en: "OUR" },
  "chiSiamo.arte": { it: "ARTE", en: "ART" },
  "chiSiamo.muralesDelNegozio": { it: "I MURALES DEL NEGOZIO", en: "THE SHOP'S MURALS" },
  "chiSiamo.vieniA": { it: "VIENI A", en: "COME" },
  "chiSiamo.trovarci": { it: "TROVARCI", en: "VISIT US" },
  "chiSiamo.ctaAddress": { it: "Via Alfonso Sozy Carafa 31B, 73100 Lecce. Mar–Sab 11:00–13:30 / 17:00–21:30.", en: "Via Alfonso Sozy Carafa 31B, 73100 Lecce. Tue–Sat 11:00–13:30 / 17:00–21:30." },

  // Catalogo
  "catalogo.heroSubtitle": { it: "[437+ VINILI IN VENDITA SU DISCOGS — 5 STILI · 3 GENERI]", en: "[437+ VINYLS FOR SALE ON DISCOGS — 5 STYLES · 3 GENRES]" },
  "catalogo.title": { it: "CATALOGO", en: "CATALOG" },
  "catalogo.sfogliaPerStile": { it: "SFOGLIA PER STILE — ACQUISTA SU DISCOGS", en: "BROWSE BY STYLE — BUY ON DISCOGS" },
  "catalogo.generi": { it: "GENERI", en: "GENRES" },
  "catalogo.generiSubtitle": { it: "CATEGORIE PRINCIPALI SU DISCOGS", en: "MAIN CATEGORIES ON DISCOGS" },
  "catalogo.stili": { it: "STILI", en: "STYLES" },
  "catalogo.stiliSubtitle": { it: "CLICCA PER FILTRARE SU DISCOGS", en: "CLICK TO FILTER ON DISCOGS" },
  "catalogo.perPrezzo": { it: "PER PREZZO", en: "BY PRICE" },
  "catalogo.filtraPrezzo": { it: "FILTRA PER FASCIA DI PREZZO", en: "FILTER BY PRICE RANGE" },
  "catalogo.dischiVendita": { it: "DISCHI IN", en: "RECORDS FOR" },
  "catalogo.vendita": { it: "VENDITA", en: "SALE" },
  "catalogo.selezioneDaDiscogs": { it: "SELEZIONE DAL CATALOGO DISCOGS", en: "SELECTION FROM DISCOGS CATALOG" },
  "catalogo.aggiornamento": { it: "AGGIORNAMENTO CONTINUO", en: "CONTINUOUSLY UPDATED" },
  "catalogo.catalogoReale": { it: "Catalogo reale da Discogs. Clicca su ogni disco per acquistare direttamente.", en: "Real catalog from Discogs. Click any record to buy directly." },
  "catalogo.come": { it: "COME", en: "HOW TO" },
  "catalogo.acquistare": { it: "ACQUISTARE", en: "BUY" },
  "catalogo.treModi": { it: "TRE MODI PER AVERE IL TUO DISCO", en: "THREE WAYS TO GET YOUR RECORD" },
  "catalogo.inNegozio": { it: "IN NEGOZIO", en: "IN STORE" },
  "catalogo.inNegozioDesc": { it: "Vieni a trovarci in Via Sozy Carafa 31B, Lecce. Sfoglia le casse, ascolta e scegli.", en: "Visit us at Via Sozy Carafa 31B, Lecce. Browse the crates, listen and choose." },
  "catalogo.suDiscogs": { it: "SU DISCOGS", en: "ON DISCOGS" },
  "catalogo.suDiscogsDesc": { it: "Esplora il catalogo online su Discogs. Spedizione in tutta Italia e in Europa.", en: "Explore the online catalog on Discogs. Shipping throughout Italy and Europe." },
  "catalogo.suWhatsapp": { it: "SU WHATSAPP", en: "ON WHATSAPP" },
  "catalogo.suWhatsappDesc": { it: "Scrivici su WhatsApp per richieste specifiche, pre-order e dischi rari.", en: "Message us on WhatsApp for specific requests, pre-orders and rare records." },
  "catalogo.trovaIlTuo": { it: "TROVA IL TUO", en: "FIND YOUR" },
  "catalogo.disco": { it: "DISCO", en: "RECORD" },
  "catalogo.ctaDesc": { it: "Esplora il catalogo completo su Discogs. Oltre 437 vinili selezionati dalla scena underground.", en: "Explore the full catalog on Discogs. Over 437 vinyls selected from the underground scene." },
  "catalogo.vaiSuDiscogs": { it: "VAI SU DISCOGS", en: "GO TO DISCOGS" },
  "catalogo.genre.electronic.desc": { it: "Il cuore del catalogo: techno, acid, freetekno e tutte le sfumature della musica elettronica", en: "The heart of the catalog: techno, acid, freetekno and all shades of electronic music" },
  "catalogo.genre.funk.desc": { it: "Groove e radici black music nella collezione", en: "Groove and black music roots in the collection" },
  "catalogo.genre.hiphop.desc": { it: "Beats e campionamenti dalla cultura hip hop", en: "Beats and samples from hip hop culture" },
  "catalogo.style.freetekno.desc": { it: "Suoni liberi dalla scena free party e teknivals — il genere più rappresentato nel catalogo", en: "Free sounds from the free party and teknival scene — the most represented genre in the catalog" },
  "catalogo.style.techno.desc": { it: "Dalla Detroit originale al suono europeo, pura potenza dal dancefloor", en: "From original Detroit to European sound, pure dancefloor power" },
  "catalogo.style.acid.desc": { it: "Il suono inconfondibile della Roland TB-303 e le sue evoluzioni", en: "The unmistakable sound of the Roland TB-303 and its evolutions" },
  "catalogo.style.hardcore.desc": { it: "Velocità e intensità senza limiti — gabber, industrial e oltre", en: "Speed and intensity without limits — gabber, industrial and beyond" },
  "catalogo.style.tribal.desc": { it: "Ritmi tribali, percussioni ipnotiche e groove primitivo", en: "Tribal rhythms, hypnotic percussion and primitive groove" },

  // Eventi
  "eventi.prossimiAppuntamenti": { it: "[PROSSIMI APPUNTAMENTI]", en: "[UPCOMING EVENTS]" },
  "eventi.title": { it: "EVENTI", en: "EVENTS" },
  "eventi.subtitle": { it: "Dal negozio al warehouse. In-store sessions, rave e digging days.", en: "From the shop to the warehouse. In-store sessions, raves and digging days." },
  "eventi.eventiAnno": { it: "EVENTI ALL'ANNO", en: "EVENTS PER YEAR" },
  "eventi.partecipanti": { it: "PARTECIPANTI", en: "ATTENDEES" },
  "eventi.location": { it: "LOCATION", en: "VENUES" },
  "eventi.prossimi": { it: "PROSSIMI", en: "UPCOMING" },
  "eventi.dalDancefloor": { it: "DAL", en: "FROM THE" },
  "eventi.momentiScena": { it: "MOMENTI DALLA SCENA", en: "MOMENTS FROM THE SCENE" },
  "eventi.eventiPassati": { it: "EVENTI PASSATI", en: "PAST EVENTS" },
  "eventi.archivio": { it: "ARCHIVIO", en: "ARCHIVE" },
  "eventi.vuoiOrganizzare": { it: "VUOI ORGANIZZARE UN", en: "WANT TO ORGANIZE AN" },
  "eventi.evento": { it: "EVENTO", en: "EVENT" },
  "eventi.collaboriamo": { it: "Collaboriamo con DJ, collettivi e organizzatori. Scrivici per proposte e collaborazioni.", en: "We collaborate with DJs, collectives and organizers. Write to us for proposals and collaborations." },

  // Eventi descriptions
  "eventi.event1.desc": { it: "Una serata dedicata al vinile puro. Solo giradischi, solo wax. Selezione techno, house e acid.", en: "An evening dedicated to pure vinyl. Only turntables, only wax. Techno, house and acid selection." },
  "eventi.event2.desc": { it: "Warehouse party con i migliori selectors della scena acid tekno pugliese. Sound system da 10K watts.", en: "Warehouse party with the best selectors of the Apulian acid tekno scene. 10K watts sound system." },
  "eventi.event3.desc": { it: "Giornata di scavo nelle casse. Nuovi arrivi, rarità e chicche da collezionisti.", en: "A day of digging through the crates. New arrivals, rarities and collector's gems." },
  "eventi.event4.desc": { it: "Jungle, drum & bass e breakbeat in un'atmosfera unica. MC live e vinyl only set.", en: "Jungle, drum & bass and breakbeat in a unique atmosphere. Live MC and vinyl only sets." },
  "eventi.event5.desc": { it: "L'inaugurazione dell'estate con un evento all'aperto. Dettagli in arrivo.", en: "Summer opening with an outdoor event. Details coming soon." },

  // Contatti
  "contatti.heroSubtitle": { it: "[IL VINILE SI TOCCA, SI ANNUSA, SI VIVE]", en: "[VINYL IS TOUCHED, SMELLED, LIVED]" },
  "contatti.vieniA": { it: "VIENI A", en: "COME" },
  "contatti.trovarci": { it: "TROVARCI", en: "VISIT US" },
  "contatti.indirizzo": { it: "INDIRIZZO", en: "ADDRESS" },
  "contatti.apriMaps": { it: "APRI IN GOOGLE MAPS", en: "OPEN IN GOOGLE MAPS" },
  "contatti.orari": { it: "ORARI", en: "HOURS" },
  "contatti.contatti": { it: "CONTATTI", en: "CONTACT" },
  "contatti.seguici": { it: "SEGUICI", en: "FOLLOW US" },
  "contatti.scrivici": { it: "SCRIVICI", en: "WRITE TO US" },
  "contatti.viaEmail": { it: "VIA EMAIL O WHATSAPP", en: "VIA EMAIL OR WHATSAPP" },
  "contatti.faq": { it: "DOMANDE FREQUENTI", en: "FREQUENTLY ASKED QUESTIONS" },
  "contatti.esploraIl": { it: "ESPLORA IL", en: "EXPLORE THE" },
  "contatti.vediVinili": { it: "VEDI I VINILI", en: "VIEW VINYLS" },
  "contatti.faq1.q": { it: "Fate spedizioni?", en: "Do you ship?" },
  "contatti.faq1.a": { it: "Sì, spediamo in tutta Italia e in Europa tramite il nostro profilo Discogs.", en: "Yes, we ship throughout Italy and Europe through our Discogs profile." },
  "contatti.faq2.q": { it: "Accettate permute?", en: "Do you accept trades?" },
  "contatti.faq2.a": { it: "Valutiamo le permute caso per caso. Portaci i tuoi vinili e vediamo!", en: "We evaluate trades case by case. Bring your vinyls and let's see!" },
  "contatti.faq3.q": { it: "Posso prenotare un vinile?", en: "Can I reserve a vinyl?" },
  "contatti.faq3.a": { it: "Sì, scrivici su WhatsApp o via email per prenotazioni e richieste specifiche.", en: "Yes, write to us on WhatsApp or via email for reservations and specific requests." },
  "contatti.faq4.q": { it: "Fate eventi privati?", en: "Do you host private events?" },
  "contatti.faq4.a": { it: "Collaboriamo con organizzatori e collettivi. Contattaci per proposte.", en: "We collaborate with organizers and collectives. Contact us for proposals." },

  // Contact Form
  "form.scrivici": { it: "SCRIVICI", en: "WRITE TO US" },
  "form.nome": { it: "NOME", en: "NAME" },
  "form.email": { it: "EMAIL", en: "EMAIL" },
  "form.messaggio": { it: "IL TUO MESSAGGIO...", en: "YOUR MESSAGE..." },
  "form.inviaEmail": { it: "INVIA EMAIL", en: "SEND EMAIL" },
  "form.compilaCampi": { it: "Compila tutti i campi", en: "Fill in all fields" },
  "form.emailPronta": { it: "Email pronta per l'invio!", en: "Email ready to send!" },
  "form.whatsappDefault": { it: "Vorrei informazioni.", en: "I'd like information." },

  // Shop
  "shop.title": { it: "SHOP", en: "SHOP" },
  "shop.subtitle": { it: "VINILI · STREETWEAR · GADGETS — UNDERGROUND SELECTION", en: "VINYL · STREETWEAR · GADGETS — UNDERGROUND SELECTION" },
  "shop.inEvidenza": { it: "IN EVIDENZA", en: "FEATURED" },
  "shop.tutti": { it: "TUTTI", en: "ALL" },
  "shop.dettagli": { it: "DETTAGLI", en: "DETAILS" },
  "shop.aggiungi": { it: "AGGIUNGI", en: "ADD" },
  "shop.aggiungiAlCarrello": { it: "AGGIUNGI AL CARRELLO", en: "ADD TO CART" },
  "shop.esaurito": { it: "ESAURITO", en: "SOLD OUT" },
  "shop.disponibili": { it: "disponibili", en: "available" },
  "shop.disponibile": { it: "disponibile", en: "available" },
  "shop.spedizioneItalia": { it: "Spedizione in tutta Italia", en: "Shipping throughout Italy" },
  "shop.stripeComing": { it: "PAGAMENTO ONLINE IN ARRIVO — STRIPE INTEGRATION COMING SOON", en: "ONLINE PAYMENT COMING SOON — STRIPE INTEGRATION COMING SOON" },
  "shop.perAcquistare": { it: "Per acquistare contattaci via", en: "To purchase, contact us via" },
  "shop.contattaciProdotto": { it: "Contattaci su", en: "Contact us on" },
  "shop.perInfoProdotto": { it: "per info su questo prodotto", en: "for info about this product" },

  // Auth
  "auth.accedi": { it: "ACCEDI", en: "LOGIN" },
  "auth.registrati": { it: "REGISTRATI", en: "SIGN UP" },
  "auth.accediAccount": { it: "ACCEDI AL TUO ACCOUNT", en: "LOGIN TO YOUR ACCOUNT" },
  "auth.creaNuovoAccount": { it: "CREA UN NUOVO ACCOUNT", en: "CREATE A NEW ACCOUNT" },
  "auth.continuaGoogle": { it: "CONTINUA CON GOOGLE", en: "CONTINUE WITH GOOGLE" },
  "auth.continuaApple": { it: "CONTINUA CON APPLE", en: "CONTINUE WITH APPLE" },
  "auth.oppure": { it: "OPPURE", en: "OR" },
  "auth.inserisciEmailPassword": { it: "Inserisci email e password", en: "Enter email and password" },
  "auth.accessoEffettuato": { it: "Accesso effettuato!", en: "Login successful!" },
  "auth.registrazioneCompletata": { it: "Registrazione completata! Controlla la tua email per verificare l'account.", en: "Registration complete! Check your email to verify your account." },
  "auth.nonHaiAccount": { it: "Non hai un account?", en: "Don't have an account?" },
  "auth.haiGiaAccount": { it: "Hai già un account?", en: "Already have an account?" },

  // NotFound
  "notFound.title": { it: "Pagina non trovata", en: "Page not found" },
  "notFound.link": { it: "Torna alla Home", en: "Return to Home" },

  // Cart
  "cart.accediPerAggiungere": { it: "Accedi per aggiungere al carrello", en: "Login to add to cart" },
  "cart.aggiunto": { it: "Aggiunto al carrello!", en: "Added to cart!" },
  "cart.erroreAggiunta": { it: "Errore nell'aggiunta al carrello", en: "Error adding to cart" },
  "cart.aggiornato": { it: "Carrello aggiornato", en: "Cart updated" },
  "cart.title": { it: "CARRELLO", en: "CART" },
  "cart.articolo": { it: "articolo", en: "item" },
  "cart.articoli": { it: "articoli", en: "items" },
  "cart.vuoto": { it: "IL CARRELLO È VUOTO", en: "YOUR CART IS EMPTY" },
  "cart.vuotoDesc": { it: "Aggiungi qualcosa dallo shop per iniziare.", en: "Add something from the shop to get started." },
  "cart.vaiAlloShop": { it: "VAI ALLO SHOP", en: "GO TO SHOP" },
  "cart.prodotto": { it: "PRODOTTO", en: "PRODUCT" },
  "cart.quantita": { it: "QUANTITÀ", en: "QUANTITY" },
  "cart.subtotale": { it: "SUBTOTALE", en: "SUBTOTAL" },
  "cart.cadauno": { it: "cad.", en: "each" },
  "cart.rimuovi": { it: "Rimuovi", en: "Remove" },
  "cart.continuaShopping": { it: "CONTINUA LO SHOPPING", en: "CONTINUE SHOPPING" },
  "cart.svuota": { it: "SVUOTA CARRELLO", en: "CLEAR CART" },
  "cart.svuotaConferma": { it: "Svuotare il carrello?", en: "Clear the cart?" },
  "cart.riepilogo": { it: "RIEPILOGO ORDINE", en: "ORDER SUMMARY" },
  "cart.totale": { it: "TOTALE", en: "TOTAL" },
  "cart.subtotale": { it: "Subtotale", en: "Subtotal" },
  "cart.sconto": { it: "Sconto", en: "Discount" },
  "cart.codiceCoupon": { it: "CODICE COUPON", en: "COUPON CODE" },
  "cart.inserisciCoupon": { it: "es. WELCOME20", en: "e.g. WELCOME20" },
  "cart.couponApplicato": { it: "Coupon applicato", en: "Coupon applied" },
  "cart.couponInvalido": { it: "Coupon non valido", en: "Invalid coupon" },
  "cart.couponScaduto": { it: "Coupon scaduto", en: "Coupon expired" },
  "cart.couponEsaurito": { it: "Coupon esaurito", en: "Coupon exhausted" },
  "cart.couponMinimo": { it: "Ordine minimo", en: "Minimum order" },
  "cart.couponErrore": { it: "Errore nella validazione del coupon", en: "Coupon validation error" },
  "cart.checkout": { it: "PROCEDI AL CHECKOUT", en: "PROCEED TO CHECKOUT" },
  "cart.accediPrima": { it: "ACCEDI PER VEDERE IL CARRELLO", en: "LOGIN TO VIEW YOUR CART" },
  "cart.accediDesc": { it: "Devi accedere per utilizzare il carrello.", en: "You need to log in to use the cart." },
};

const LangContext = createContext<LangContextType>({
  lang: "it",
  setLang: () => {},
  t: (key) => key,
});

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang");
    return (saved === "en" ? "en" : "it") as Lang;
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LangContext.Provider>
  );
};
