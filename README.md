# Gestione API React

Applicazione didattica realizzata con **React**, **Vite** e **Bootstrap 5** per esplorare risorse REST e sperimentare le operazioni HTTP.

## Funzionalità

- Navigazione tra **Post, Commenti, Album, Foto, Attività e Utenti**.
- Visualizzazione delle risorse in card responsive e ricerca per ID.
- Consultazione dei commenti di un post, delle foto di un album e delle risorse associate a un utente.
- Creazione di post (**POST**), modifica (**PUT** e **PATCH**) ed eliminazione (**DELETE**).
- Gestione degli stati di caricamento, degli errori e dei controlli dei form.
- Interfaccia in italiano realizzata con Bootstrap 5.

## Tecnologie

- React e JavaScript (JSX)
- Vite
- Bootstrap 5
- Fetch API e AbortController
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) come API di prova

## Avvio in locale

Prerequisiti: Node.js e npm, con una versione di Node.js compatibile con la versione di Vite installata nel progetto.

```bash
npm install
npm run dev
```

Apri nel browser l'indirizzo mostrato da Vite nel terminale.

Bootstrap viene caricato tramite CDN in `index.html`. Per caricare lo stile e contattare JSONPlaceholder è necessaria una connessione Internet.

Per generare la versione di produzione:

```bash
npm run build
```

I file generati vengono salvati nella cartella `dist/`.

## Struttura principale

```text
./
├── App.jsx
├── index.jsx
├── index.html
├── vite.config.js
├── package.json
├── package-lock.json
├── .gitignore
└── components/
    ├── GestioneRisorsa.jsx
    ├── PostCard.jsx
    ├── CommentCard.jsx
    ├── AlbumCard.jsx
    ├── PhotoCard.jsx
    ├── TodoCard.jsx
    └── UserCard.jsx
```

## Nota importante sulle operazioni CRUD

**JSONPlaceholder simula le operazioni di scrittura**: le richieste POST, PUT, PATCH e DELETE non modificano permanentemente i dati del servizio. L'applicazione gestisce localmente i post aggiunti, modificati ed eliminati per aggiornare la visualizzazione durante l'utilizzo.

Le modifiche locali non costituiscono una persistenza permanente e possono andare perse al ricaricamento o al cambio di risorsa.

## Obiettivo del progetto

Esercitare i principali concetti di React, la gestione delle richieste asincrone e la costruzione di un'interfaccia responsive e accessibile.
