CREATE TABLE IF NOT EXISTS facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    entidad TEXT NOT NULL,
    estado TEXT NOT NULL,
    fecha_emision TEXT NOT NULL,
    fecha_vencimiento TEXT,
    monto  REAL NOT NULL,
    descripcion TEXT,
    path_pdf TEXT NOT NULL
);