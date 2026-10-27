
function TodoCard({ elemento }) {

  return (
    <article className="card h-100 shadow-sm border-0 rounded-3">

      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span
            className={`badge ${
              elemento.completed
                ? "bg-success"
                : "bg-warning text-dark"
            }`}
          >
            {elemento.completed ? "COMPLETATA" : "DA COMPLETARE"}
          </span>

          <small className="text-secondary">#{elemento.id}</small>
        </div>

        <h3
          className={`card-title h5 fw-bold mb-3 ${
            elemento.completed
              ? "text-decoration-line-through text-success fst-italic"
              : "text-body"
          }`}
        >
          {elemento.title}
        </h3>

        <div className="d-flex align-items-center gap-2">
          <input
            type="checkbox"
            className="form-check-input mt-0"
            checked={elemento.completed}
            readOnly
            aria-label="Stato di completamento"
          />

          <span className="small text-secondary">
            {elemento.completed
              ? "Attività completata"
              : "Attività ancora da completare!"}
          </span>
        </div>

      </div>

      <div className="card-footer bg-body-tertiary border-0 px-4 py-3">
        <div className="d-flex justify-content-between align-items-center gap-2">

          <small className="text-secondary">
            ID Attività: <strong>{elemento.id}</strong>
          </small>

          <small className="text-secondary">
            ID Utente: <strong>{elemento.userId}</strong>
          </small>

        </div>
      </div>

    </article>
  );
}

export default TodoCard;
