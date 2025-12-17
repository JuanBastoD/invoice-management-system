from pydantic import BaseModel

class FacturaIn(BaseModel):
    numero_factura: str
    tipo: str
    entidad: str
    estado: str
    fecha_emision: str
    fecha_vencimiento: str | None = None
    monto: float
    descripcion: str | None = None
    path_pdf: str


class FacturaOut(FacturaIn):
    id: int
