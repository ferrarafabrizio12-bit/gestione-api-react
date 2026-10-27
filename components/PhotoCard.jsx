
function PhotoCard({ elemento }) {

  return (
    <article className="card h-100 shadow-sm border-0 rounded-3">

      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-primary">FOTO</span>
          <small className="text-secondary">#{elemento.id}</small>
        </div>

        <h3 className="card-title h5 fw-bold text-capitalize mb-3">
          {elemento.title}
        </h3>

        <img
          src={elemento.url}
          alt={elemento.title}
          className="img-fluid rounded-3 w-100"
          style={{
            height: "220px",
            objectFit: "contain"
          }}
          loading="lazy"
        />

      </div>

      <div className="card-footer bg-body-tertiary border-0 px-4 py-3">
        <div className="d-flex justify-content-between align-items-center gap-2">

          <small className="text-secondary">
            ID Foto: <strong>{elemento.id}</strong>
          </small>

          <small className="text-secondary">
            ID Album: <strong>{elemento.albumId}</strong>
          </small>

        </div>
      </div>

    </article>
  );
}

export default PhotoCard;
