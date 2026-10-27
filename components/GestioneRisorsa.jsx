import { useState } from "react";

function GestioneRisorsa({ risorsa, dati, componenti, etichetteRisorse }) {


  // Seleziona dinamicamente la Card in base alla risorsa
  const ComponenteSelezionato = componenti[risorsa];

  // Stato per mostrare o nascondere il form di creazione di un nuovo post
  const [modalitaCreazione, setModalitaCreazione] = useState(false);

  // Stato per mostrare o nascondere il form di modifica di un post
  const [modalitaModifica, setModalitaModifica] = useState(false);

  // Stato per selezionare il metodo di modifica PUT o PATCH
  const [metodoModifica, setMetodoModifica] = useState("PUT");

  // Stato per il singolo elemento recuperato dall'API
  const [elementoCercato, setElementoCercato] = useState(null);

  // Stato per l'ID inserito nel campo di ricerca
  const [idRicerca, setIdRicerca] = useState("1");

  // Stato per verificare se la ricerca dei commenti è stata completata
  const [ricercaCommentiEffettuata, setRicercaCommentiEffettuata] = useState(false);

  // Stato per indicare se una richiesta GET è in corso
  const [loadingRicerca, setLoadingRicerca] = useState(false);

  // Stato per memorizzare eventuali errori durante le richieste GET
  const [erroreRicerca, setErroreRicerca] = useState(null);

  // Stato per selezionare la modalità di ricerca dei commenti di un post
  const [modalitaCommenti, setModalitaCommenti] = useState("annidata");

  // Stato per selezionare il tipo di risorsa associata a un utente
  const [tipoRisorseUtente, setTipoRisorseUtente] = useState("Posts");

  // Seleziona la Card per visualizzare i commenti di un post
  const ComponenteCommenti = componenti["Comments"];

  // Stato per memorizzare i commenti recuperati di un determinato post
  const [commentiPost, setCommentiPost] = useState([]);

  // Seleziona la Card per visualizzare le foto di un album
  const ComponenteFoto = componenti["Photos"];

  // Stato per memorizzare le foto recuperate di un determinato album
  const [fotoAlbum, setFotoAlbum] = useState([]);

  // Stato per verificare se la ricerca delle foto è stata completata
  const [ricercaFotoEffettuata, setRicercaFotoEffettuata] = useState(false);

  // Seleziona dinamicamente la Card in base alla risorsa scelta per un utente
  const ComponenteRisorseUtente = componenti[tipoRisorseUtente];

  // Stato per memorizzare le risorse recuperate di un determinato utente
  const [risorseUtente, setRisorseUtente] = useState([]);

  // Stato per verificare se la ricerca delle risorse di un utente è stata completata
  const [ricercaRisorseUtenteEffettuata, setRicercaRisorseUtenteEffettuata] = useState(false);


  // Stato per memorizzare i dati inseriti nel form di creazione POST
  const [nuovoPost, setNuovoPost] = useState({
    title:"",
    body:"",
    userId:1
  });


  // Stato per conservare localmente i post creati tramite POST
  const [postAggiunti, setPostAggiunti] = useState([]);

  // Stato per memorizzare una copia del post da modificare nel form PUT/PATCH
  const [postDaModificare, setPostDaModificare] = useState(null);

  // Stato per conservare i post modificati associandoli al loro ID
  const [postModificati, setPostModificati] = useState({});

  // Stato per conservare gli ID dei post eliminati localmente
  const [postEliminati, setPostEliminati] = useState([]);

  // Unisce i post creati e quelli dell’API, utilizzando le versioni locali eventualmente modificate
  // Esclude dalla visualizzazione i post eliminati localmente
  const tuttiPost = [...postAggiunti, ...dati].map((post) => { return postModificati[post.id] || post}).filter((post) => !postEliminati.includes(post.id))



  // GET di una singola risorsa tramite ID
  const cercaElemento = () => {

    // Controlla che l'ID inserito sia un numero intero maggiore di zero
    if (!Number.isInteger(Number(idRicerca)) || Number(idRicerca) <= 0) {
      setElementoCercato(null);
      setErroreRicerca("Inserisci un ID intero maggiore di zero.");
      return;
    }

    // Impedisce la ricerca di un post già eliminato localmente
    if(risorsa === "Posts" && postEliminati.includes(Number(idRicerca))) {
      setElementoCercato(null);
      setErroreRicerca("Questo post è già stato eliminato!");
      return;
    }

    // Costruisce dinamicamente l'URL in base alla risorsa e all'ID inserito
    const url = `https://jsonplaceholder.typicode.com/${risorsa.toLowerCase()}/${idRicerca}`;

    // Azzera l'eventuale risultato precedente
    setElementoCercato(null);
    setErroreRicerca(null);
    setLoadingRicerca(true);
    setCommentiPost([]);
    setFotoAlbum([]);
    setRisorseUtente([]);
    setModalitaModifica(false);
    setPostDaModificare(null);
    setRicercaCommentiEffettuata(false);
    setRicercaFotoEffettuata(false);
    setRicercaRisorseUtenteEffettuata(false);

    // Esegue la richiesta GET e gestisce la risposta, gli errori e il caricamento
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          if(response.status === 404) {
            throw new Error(`Risorsa non trovata: ${etichetteRisorse[risorsa] ?? risorsa}.`);
          }
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((risultato) => {
        setElementoCercato(risorsa === "Posts" ? postModificati[risultato.id] || risultato : risultato)
      })
      .catch((errore) => {
        if(errore instanceof TypeError) {
          setErroreRicerca("Impossibile contattare il server! Controlla la connessione Internet!")
        } else {
          setErroreRicerca(errore.message)
        }
      })
      .finally(() => {
        setLoadingRicerca(false);
      });
  };


  // GET dei commenti di un determinato post tramite ricerca annidata o filtrata
  const cercaCommentiPost = () => {

    // Costruisce l'URL in base alla modalità di ricerca selezionata
    const url = modalitaCommenti === "annidata" ? `https://jsonplaceholder.typicode.com/${risorsa.toLowerCase()}/${elementoCercato.id}/comments` : `https://jsonplaceholder.typicode.com/comments?postId=${elementoCercato.id}`;

    // Azzera i commenti precedenti e prepara lo stato della richiesta
    setCommentiPost([]);
    setErroreRicerca(null);
    setLoadingRicerca(true);
    setRicercaCommentiEffettuata(false);

    // Esegue la richiesta GET e salva i commenti recuperati
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((risultato) => {
        setCommentiPost(risultato);
        setRicercaCommentiEffettuata(true);
      })
      .catch((errore) => {
        if(errore instanceof TypeError) {
          setErroreRicerca("Impossibile contattare il server! Controlla la connessione Internet!")
        } else {
          setErroreRicerca(errore.message)
        }
      })
      .finally(() => {
        setLoadingRicerca(false);
      });
  };


  // GET delle foto appartenenti a un determinato album
  const cercaFotoAlbum = () => {

    // Costruisce dinamicamente l'URL utilizzando l'ID dell'album selezionato
    const url = `https://jsonplaceholder.typicode.com/${risorsa.toLowerCase()}/${elementoCercato.id}/photos`;

    // Azzera le foto precedenti e prepara lo stato della richiesta
    setFotoAlbum([]);
    setErroreRicerca(null);
    setLoadingRicerca(true);
    setRicercaFotoEffettuata(false);

    // Esegue la richiesta GET e salva le foto recuperate
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((risultato) => {
        setFotoAlbum(risultato);
        setRicercaFotoEffettuata(true);
      })
      .catch((errore) => {
        if(errore instanceof TypeError) {
          setErroreRicerca("Impossibile contattare il server! Controlla la connessione Internet!")
        } else {
          setErroreRicerca(errore.message)
        }
      })
      .finally(() => {
        setLoadingRicerca(false);
      });
  };


  // GET delle risorse associate a un determinato utente
  const cercaRisorseUtente = () => {

    // Costruisce dinamicamente l'URL in base all'utente e alla risorsa selezionata
    const url = `https://jsonplaceholder.typicode.com/${risorsa.toLowerCase()}/${elementoCercato.id}/${tipoRisorseUtente.toLowerCase()}`;

    // Azzera le risorse precedenti e prepara lo stato della richiesta
    setRisorseUtente([]);
    setErroreRicerca(null);
    setLoadingRicerca(true);
    setRicercaRisorseUtenteEffettuata(false);

    // Esegue la richiesta GET e salva le risorse recuperate
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((risultato) => {
        setRisorseUtente(risultato);
        setRicercaRisorseUtenteEffettuata(true);
      })
      .catch((errore) => {
        if(errore instanceof TypeError) {
          setErroreRicerca("Impossibile contattare il server! Controlla la connessione Internet!")
        } else {
          setErroreRicerca(errore.message)
        }
      })
      .finally(() => {
        setLoadingRicerca(false);
      });
  };


  // POST per creare un nuovo post e aggiungerlo all’elenco locale
  const creaPost = (e) => {

    // Impedisce il comportamento predefinito di invio del form
    e.preventDefault();

    // Controlla che il titolo, il contenuto e l’ID utente siano validi prima della POST
    if(nuovoPost.title.trim()==="") {
      setErroreRicerca("Il titolo del post non può essere vuoto!");
      return;
    }
    if(nuovoPost.body.trim()==="") {
      setErroreRicerca("Il contenuto del post non può essere vuoto!");
      return;
    }
    if (!Number.isInteger(Number(nuovoPost.userId)) || Number(nuovoPost.userId) <= 0) {
      setErroreRicerca("Inserisci un ID intero maggiore di zero.");
      return;
    }

    // Endpoint API per simulare la creazione del nuovo post
    const url = "https://jsonplaceholder.typicode.com/posts";

    // Azzera le risorse precedenti e prepara lo stato della richiesta
    setErroreRicerca(null);
    setLoadingRicerca(true);

    // Invia al server la richiesta HTTP con metodo, intestazioni e dati JSON
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuovoPost)
    })
    .then((response) => {
       if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
    .then((risultato) => {

      // Crea un ID locale univoco perché JSONPlaceholder simula la POST
      const postConIdLocale = {
         ...risultato,
        id: crypto.randomUUID()
      };

      // Ripristina il form, chiude la creazione e aggiunge il post alla lista
      setNuovoPost({title:"", body:"", userId:1});
      setModalitaCreazione(false);
      setElementoCercato(null);
      setPostAggiunti((prev) => [postConIdLocale, ...prev]);
    })
    .catch((errore) => {
      if(errore instanceof TypeError) {
          setErroreRicerca("Impossibile contattare il server! Controlla la connessione Internet!")
        } else {
          setErroreRicerca(errore.message)
        }
    })
    .finally(() => {
      setLoadingRicerca(false);
     });
  };


  // PUT/PATCH per modificare un post esistente tramite il metodo selezionato
  const modificaPost = (e) => {

    // Impedisce il comportamento predefinito di invio del form
    e.preventDefault();

    // Controlla che il titolo, il contenuto e l’ID utente siano validi prima di PUT/PATCH
    if(postDaModificare.title.trim()==="") {
      setErroreRicerca("Il titolo del post non può essere vuoto!");
      return;
    }
    if(postDaModificare.body.trim()==="") {
      setErroreRicerca("Il contenuto del post non può essere vuoto!");
      return;
    }
    if (!Number.isInteger(Number(postDaModificare.userId)) || Number(postDaModificare.userId) <= 0) {
      setErroreRicerca("Inserisci un ID intero maggiore di zero!");
      return;
    }

    // Endpoint API del post da modificare tramite ID
    const url = `https://jsonplaceholder.typicode.com/posts/${postDaModificare.id}`;

    // Raccoglie soltanto le proprietà effettivamente cambiate per la PATCH
    const campiModificati = {};
    if (elementoCercato.title !== postDaModificare.title) {
      campiModificati.title = postDaModificare.title;
    }
    if (elementoCercato.body !== postDaModificare.body) {
      campiModificati.body = postDaModificare.body;
    }
    if (elementoCercato.userId !== postDaModificare.userId) {
      campiModificati.userId = postDaModificare.userId;
    }

    // Impedisce l’invio della PATCH quando non sono state effettuate modifiche
    if(metodoModifica === "PATCH" && Object.keys(campiModificati).length === 0) {
      setErroreRicerca("Non hai modificato nessun campo!");
      return;
    }

    // Azzera le risorse precedenti e prepara lo stato della richiesta
    setErroreRicerca(null);
    setLoadingRicerca(true);

    // Invia al server la richiesta HTTP con metodo, intestazioni e dati JSON
    fetch(url, {
      method: metodoModifica,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(metodoModifica === "PUT" ? postDaModificare : campiModificati)
    })
    .then((response) => {
       if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
    .then((risultato) => {

      // Unisce i dati originali con la risposta del server per ottenere il post completo
      const postAggiornato = {
        ...elementoCercato,
        ...risultato
      };

      // Memorizza la versione aggiornata del post senza perdere le modifiche precedenti
      setPostModificati((prev) => ({
        ...prev,
        [postAggiornato.id]: postAggiornato
      }));

      // Chiude il form di modifica e aggiorna il post visualizzato
      setPostDaModificare(null);
      setModalitaModifica(false);
      setElementoCercato(postAggiornato);

    })
    .catch((errore) => {
      if(errore instanceof TypeError) {
          setErroreRicerca("Impossibile contattare il server! Controlla la connessione Internet!")
        } else {
          setErroreRicerca(errore.message)
        }
    })
    .finally(() => {
      setLoadingRicerca(false);
     });
  };


  // DELETE per simulare l’eliminazione di un post e nasconderlo dall’elenco locale
  const eliminaPost = () => {

    // Endpoint API del post da eliminare tramite ID
    const url = `https://jsonplaceholder.typicode.com/posts/${elementoCercato.id}`;

    // Azzera le risorse precedenti e prepara lo stato della richiesta
    setErroreRicerca(null);
    setLoadingRicerca(true);

    // Esegue la richiesta DELETE senza inviare un body
    fetch(url, {
      method: "DELETE"
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
    })
    .then(() => {
      // Memorizza l’ID eliminato e torna alla visualizzazione dell’elenco
      setPostEliminati((prev) => [...prev, elementoCercato.id]);
      setElementoCercato(null);
      console.log("Post eliminato correttamente.");
    })
    .catch((errore) => {
      if(errore instanceof TypeError) {
          setErroreRicerca("Impossibile contattare il server! Controlla la connessione Internet!")
        } else {
          setErroreRicerca(errore.message)
        }
    })
    .finally(() => {
      setLoadingRicerca(false)
    })

  }


  // Controlla che esista una Card per la risorsa selezionata
  if (!ComponenteSelezionato) {
    return <p className="alert alert-warning">Nessun componente disponibile per questa risorsa!</p>;
  }

  return (
    <section className="py-3">

      {/* Stato delle richieste: un unico messaggio di caricamento generale */}
      {loadingRicerca && (
        <div className="alert alert-info d-flex align-items-center gap-2" role="status">
          <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span>Operazione in corso...</span>
        </div>
      )}

      {/* La regione rimane nel DOM per comunicare eventuali errori */}
      <div role="alert">
        {erroreRicerca && <p className="alert alert-danger">{erroreRicerca}</p>}
      </div>

      {/* Schermata principale */}
      {!modalitaCreazione && !modalitaModifica && (
        <div>
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h3 className="h5 fw-bold mb-3">Cerca e gestisci</h3>

              {/* Barra orizzontale scorrevole: stessa impostazione già scelta per il progetto */}
              <div className="d-flex align-items-stretch gap-2 overflow-auto pb-2">
                <label htmlFor="idRicerca" className="visually-hidden">ID della risorsa</label>
                <input
                  id="idRicerca"
                  className="form-control flex-grow-1"
                  type="number"
                  min="1"
                  placeholder="ID risorsa"
                  value={idRicerca}
                  disabled={loadingRicerca}
                  onChange={(e) => setIdRicerca(e.target.value)}
                />
                <button className="btn btn-primary text-nowrap flex-shrink-0" type="button" disabled={loadingRicerca} onClick={cercaElemento}>Cerca</button>

                {risorsa === "Posts" && elementoCercato && !modalitaModifica && (
                  <button className="btn btn-warning text-nowrap flex-shrink-0" type="button" disabled={loadingRicerca} onClick={() => {setModalitaModifica(true); setPostDaModificare({...elementoCercato})}}>Modifica Post</button>
                )}
                {risorsa === "Posts" && elementoCercato && (
                  <button className="btn btn-danger text-nowrap flex-shrink-0" type="button" disabled={loadingRicerca} onClick={eliminaPost}>Elimina Post</button>
                )}
                {risorsa === "Posts" && elementoCercato && (
                  <button className="btn btn-info text-nowrap flex-shrink-0" type="button" disabled={loadingRicerca} onClick={cercaCommentiPost}>Mostra Commenti</button>
                )}
                {risorsa === "Posts" && elementoCercato && (
                  <select
                    className="form-select w-auto flex-shrink-0"
                    aria-label="Modalità ricerca commenti"
                    value={modalitaCommenti}
                    disabled={loadingRicerca}
                    onChange={(e) => {setModalitaCommenti(e.target.value); setRicercaCommentiEffettuata(false); setCommentiPost([])}}
                  >
                    <option value="annidata">Ricerca commenti (GET annidata)</option>
                    <option value="filtrata">Ricerca commenti (GET filtrata)</option>
                  </select>
                )}

                {risorsa === "Albums" && elementoCercato && (
                  <button className="btn btn-info text-nowrap flex-shrink-0" type="button" disabled={loadingRicerca} onClick={cercaFotoAlbum}>Mostra Foto</button>
                )}

                {risorsa === "Users" && elementoCercato && (
                  <button className="btn btn-info text-nowrap flex-shrink-0" type="button" disabled={loadingRicerca} onClick={cercaRisorseUtente}>Mostra {etichetteRisorse[tipoRisorseUtente]}</button>
                )}
                {risorsa === "Users" && elementoCercato && (
                  <select
                    className="form-select w-auto flex-shrink-0"
                    aria-label="Tipo di risorsa dell'utente"
                    value={tipoRisorseUtente}
                    disabled={loadingRicerca}
                    onChange={(e) => {setTipoRisorseUtente(e.target.value); setRicercaRisorseUtenteEffettuata(false); setRisorseUtente([])}}
                  >
                    <option value="Posts">Post dell’utente selezionato</option>
                    <option value="Albums">Album dell’utente selezionato</option>
                    <option value="Todos">Attività dell’utente selezionato</option>
                  </select>
                )}

                {risorsa === "Posts" && !modalitaCreazione && !elementoCercato && (
                  <button className="btn btn-warning text-nowrap flex-shrink-0" type="button" disabled={loadingRicerca} onClick={() => setModalitaCreazione(true)}>Crea Nuovo Post</button>
                )}

                <button
                  className="btn btn-secondary text-nowrap flex-shrink-0"
                  type="button"
                  disabled={loadingRicerca}
                  onClick={() => {setElementoCercato(null); setErroreRicerca(null); setLoadingRicerca(false); setModalitaModifica(false); setPostDaModificare(null); setRicercaCommentiEffettuata(false); setRicercaFotoEffettuata(false); setRicercaRisorseUtenteEffettuata(false); setCommentiPost([]); setFotoAlbum([]); setRisorseUtente([]); setIdRicerca("1")}}
                >Mostra Tutti</button>
              </div>
            </div>
          </div>

          {/* Risorsa singola oppure elenco delle Card */}
          <div className="mb-4">
            <h3 className="h5 fw-bold mb-3">{elementoCercato ? "Risultato della ricerca" : `Elenco ${etichetteRisorse[risorsa]}`}</h3>
            {elementoCercato ? (
              <div className="row g-3">
                <div className="col-12 col-lg-8 mx-auto">
                  <ComponenteSelezionato elemento={elementoCercato} />
                </div>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                {(risorsa === "Posts" ? tuttiPost : dati).map((elementoApi) => (
                  <div className="col" key={elementoApi.id}>
                    <ComponenteSelezionato elemento={elementoApi} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risultati dei commenti del post selezionato */}
          {(ricercaCommentiEffettuata || commentiPost.length > 0) && (
            <div className="border-top pt-4 mt-4">
              <h3 className="h5 fw-bold mb-3">Commenti del post</h3>
              {commentiPost.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                  {commentiPost.map((commento) => (
                    <div className="col" key={commento.id}>
                      <ComponenteCommenti elemento={commento} />
                    </div>
                  ))}
                </div>
              ) : <p className="alert alert-info">Nessun commento trovato!</p>}
            </div>
          )}

          {/* Risultati delle foto dell'album selezionato */}
          {(ricercaFotoEffettuata || fotoAlbum.length > 0) && (
            <div className="border-top pt-4 mt-4">
              <h3 className="h5 fw-bold mb-3">Foto dell'album</h3>
              {fotoAlbum.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                  {fotoAlbum.map((foto) => (
                    <div className="col" key={foto.id}>
                      <ComponenteFoto elemento={foto} />
                    </div>
                  ))}
                </div>
              ) : <p className="alert alert-info">Nessuna foto trovata!</p>}
            </div>
          )}

          {/* Risultati delle risorse collegate all'utente selezionato */}
          {(ricercaRisorseUtenteEffettuata || risorseUtente.length > 0) && (
            <div className="border-top pt-4 mt-4">
              <h3 className="h5 fw-bold mb-3">{etichetteRisorse[tipoRisorseUtente]} dell'utente</h3>
              {risorseUtente.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                  {risorseUtente.map((risorsaMap) => (
                    <div className="col" key={risorsaMap.id}>
                      <ComponenteRisorseUtente elemento={risorsaMap} />
                    </div>
                  ))}
                </div>
              ) : <p className="alert alert-info">Nessuna risorsa trovata per questo utente!</p>}
            </div>
          )}
        </div>
      )}

      {/* Form di creazione POST */}
      {risorsa === "Posts" && modalitaCreazione && (
        <div className="row">
          <div className="col-12 col-md-8 mx-auto">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h3 className="h5 fw-bold mb-4">Crea un nuovo post</h3>
                <form onSubmit={creaPost}>
                  <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="titoloPost" className="form-label">Titolo del Post</label>
                      <input id="titoloPost" className="form-control" type="text" value={nuovoPost.title} disabled={loadingRicerca} onChange={(e) => setNuovoPost((prev) =>({...prev, title:e.target.value}))}/>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="userIdPost" className="form-label">ID Utente</label>
                      <input id="userIdPost" className="form-control" type="number" min="1" value={nuovoPost.userId} disabled={loadingRicerca} onChange={(e) => setNuovoPost((prev) =>({...prev, userId:Number(e.target.value)}))}/>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contenutoPost" className="form-label">Contenuto del Post</label>
                    <textarea id="contenutoPost" className="form-control" rows="5" value={nuovoPost.body} disabled={loadingRicerca} onChange={(e) => setNuovoPost((prev) =>({...prev, body:e.target.value}))}/>
                  </div>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button className="btn btn-success flex-grow-1" type="submit" disabled={loadingRicerca}>
                      {loadingRicerca ? "Creazione in corso..." : "Crea Post"}
                    </button>
                    <button className="btn btn-secondary" type="button" disabled={loadingRicerca} onClick={() => {setModalitaCreazione(false); setNuovoPost({title:"", body:"", userId:1}); setErroreRicerca(null);}}>Annulla</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form di modifica PUT/PATCH */}
      {modalitaModifica && postDaModificare && (
        <div className="row">
          <div className="col-12 col-md-8 mx-auto">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h3 className="h5 fw-bold mb-4">Modifica post #{postDaModificare.id}</h3>
                <form onSubmit={modificaPost}>
                  <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="titoloPostModifica" className="form-label">Titolo del Post</label>
                      <input id="titoloPostModifica" className="form-control" type="text" value={postDaModificare.title} disabled={loadingRicerca} onChange={(e) => setPostDaModificare((prev) => ({...prev, title:e.target.value}))} />
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="userIdPostModifica" className="form-label">ID Utente</label>
                      <input id="userIdPostModifica" className="form-control" type="number" min="1" value={postDaModificare.userId} disabled={loadingRicerca} onChange={(e) => setPostDaModificare((prev) => ({...prev, userId:Number(e.target.value)}))} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contenutoPostModifica" className="form-label">Contenuto del Post</label>
                    <textarea id="contenutoPostModifica" className="form-control" rows="5" value={postDaModificare.body} disabled={loadingRicerca} onChange={(e) => setPostDaModificare((prev) => ({...prev, body:e.target.value}))} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="metodoModifica" className="form-label">Metodo di aggiornamento</label>
                    <select id="metodoModifica" className="form-select" value={metodoModifica} disabled={loadingRicerca} onChange={(e) => setMetodoModifica(e.target.value)}>
                      <option value="PUT">Modifica Post (PUT)</option>
                      <option value="PATCH">Modifica Post (PATCH)</option>
                    </select>
                  </div>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button className="btn btn-success flex-grow-1" type="submit" disabled={loadingRicerca}>
                      {loadingRicerca ? "Salvataggio in corso..." : "Salva Modifiche"}
                    </button>
                    <button className="btn btn-secondary" type="button" disabled={loadingRicerca} onClick={() => {setModalitaModifica(false); setPostDaModificare(null); setErroreRicerca(null);}}>Annulla</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default GestioneRisorsa;