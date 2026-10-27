
function UserCard({ elemento }) {

  return (
    <article className="card h-100 shadow-sm border-0 rounded-3">

      <div className="card-body p-4">

        {/* Intestazione della Card */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-secondary">UTENTE</span>
          <small className="text-secondary">#{elemento.id}</small>
        </div>

        {/* Nome e username */}
        <h3 className="card-title h5 fw-bold mb-1">
          {elemento.name}
        </h3>

        <p className="text-secondary small mb-3">
          @{elemento.username}
        </p>

        <hr className="my-3" />

        {/* Informazioni di contatto */}
        <div className="mb-3">
          <p className="small text-secondary mb-1">
            Email
          </p>
          <p className="card-text text-break mb-0">
            {elemento.email}
          </p>
        </div>

        <div className="mb-3">
          <p className="small text-secondary mb-1">
            Telefono
          </p>
          <p className="card-text text-break mb-0">
            {elemento.phone}
          </p>
        </div>

        {/* Città di residenza */}
        <div>
          <p className="small text-secondary mb-1">
            Città di residenza
          </p>
          <p className="card-text mb-0">
            {elemento.address?.city ?? "Non disponibile"}
          </p>
        </div>

      </div>

      {/* Footer della Card */}
      <div className="card-footer bg-body-tertiary border-0 px-4 py-3">
        <div className="d-flex justify-content-between align-items-center gap-2">

          <small className="text-secondary">
            ID Utente: <strong>{elemento.id}</strong>
          </small>

          <span className="badge bg-success">
            Profilo utente
          </span>

        </div>
      </div>

    </article>
  );
}

export default UserCard;
