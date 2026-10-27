import { useState, useEffect } from "react";

// Importazione dei componenti Card per visualizzare le diverse risorse API
import PostCard from "./components/PostCard.jsx";
import PhotoCard from "./components/PhotoCard.jsx";
import CommentCard from "./components/CommentCard.jsx";
import AlbumCard from "./components/AlbumCard.jsx";
import TodoCard from "./components/TodoCard.jsx";
import UserCard from "./components/UserCard.jsx";

// Importazione del componente per la gestione delle risorse e delle operazioni GET
import GestioneRisorsa from "./components/GestioneRisorsa.jsx";

function App() {

  // Stato per memorizzare la risorsa attualmente selezionata nella navbar
  const [risorsaSelezionata, setRisorsaSelezionata] = useState("Posts");

  // Elenco delle risorse API disponibili: queste chiavi NON vanno tradotte
  const risorse = ["Posts", "Comments", "Albums", "Photos", "Todos", "Users"];

  // Etichette in italiano utilizzate soltanto nell'interfaccia
  const etichetteRisorse = {
    Posts: "Post",
    Comments: "Commenti",
    Albums: "Album",
    Photos: "Foto",
    Todos: "Attività",
    Users: "Utenti"
  };

  // Stati per gestire il caricamento, gli errori e i dati ricevuti dall'API
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(null);
  const [dati, setDati] = useState([]);

  // Associa ogni risorsa API al relativo componente Card
  const componenti = {
    Posts: PostCard,
    Comments: CommentCard,
    Albums: AlbumCard,
    Photos: PhotoCard,
    Todos: TodoCard,
    Users: UserCard
  };

  // Esegue una nuova richiesta GET ogni volta che cambia la risorsa selezionata
  useEffect(() => {
    setLoading(true);
    setErrore(null);
    setDati([]);
    const controller = new AbortController();

    // Recupera dall'API tutti gli elementi appartenenti alla risorsa selezionata
    fetch(`https://jsonplaceholder.typicode.com/${risorsaSelezionata.toLowerCase()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore durante il recupero dei dati");
        }
        return response.json();
      })
      .then((risultato) => {
        setDati(risultato);
      })
      .catch((errore) => {
        if (errore.name !== "AbortError") {
          console.error(errore);
          setErrore(errore.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [risorsaSelezionata]);

  return (
    <div className="container py-4">
      {/* Titolo principale dell'applicazione */}
      <header className="mb-4">
        <h1 className="fw-bold mb-2">
          Gestione API<span className="d-none d-md-inline"> React</span>
        </h1>
        <p className="text-secondary mb-0">Esplora e gestisci le risorse API</p>
      </header>

      {/* Navbar: si visualizzano etichette italiane, ma lo stato mantiene le chiavi API */}
      <nav
        className="d-flex flex-column flex-md-row gap-2 overflow-auto mb-4 pb-2"
        aria-label="Navigazione risorse API"
      >
        {risorse.map((risorsa) => {
          const stessaRisorsa = risorsa === risorsaSelezionata;

          return (
            <button
              key={risorsa}
              type="button"
              className={`btn flex-shrink-0 text-nowrap ${stessaRisorsa ? "btn-success fw-bold" : "btn-light fw-normal"}`}
              aria-current={stessaRisorsa ? "page" : undefined}
              onClick={() => setRisorsaSelezionata(risorsa)}
            >
              {etichetteRisorse[risorsa]}
            </button>
          );
        })}
      </nav>

      <main>
        {/* Messaggio di caricamento della risorsa */}
        {loading && (
          <div className="alert alert-info d-flex align-items-center gap-2" role="status">
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span>Caricamento in corso...</span>
          </div>
        )}

        {/* Messaggio di errore */}
        {errore && (
          <div className="alert alert-danger" role="alert">{errore}</div>
        )}

        {/* La key reimposta gli stati interni quando cambia la risorsa */}
        <GestioneRisorsa
          key={risorsaSelezionata}
          risorsa={risorsaSelezionata}
          dati={dati}
          componenti={componenti}
          etichetteRisorse={etichetteRisorse}
        />
      </main>
    </div>
  );
}

export default App;
