from pydantic import BaseModel
from datetime import date

class FacturaIn(BaseModel):
    tipo: str
    entidad: str
    estado: str
    fecha_emision: date
    fecha_vencimiento: date
    monto: float
    descripcion: str

class FacturaOut(FacturaIn):
    id: int
    path_pdf: str | None = None
