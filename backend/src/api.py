from fastapi import FastAPI
from src.models.gestor_facturas import GestorDeFacturas
from src.models.schema import FacturaIn, FacturaOut

app = FastAPI()
gestor = GestorDeFacturas()

# Convertir objeto OOP Factura → dict compatible con FastAPI
def factura_to_dict(f):
    return {
        "id": getattr(f, "id", None),
        "tipo": f.tipo,
        "entidad": f.entidad,
        "estado": f.estado,
        "fecha_emision": f.fecha_emision,
        "fecha_vencimiento": f.fecha_vencimiento,
        "monto": f.monto,
        "descripcion": f.descripcion,
        "path_pdf": f.path_pdf,
    }

@app.get("/facturas")
def obtener_facturas():
    facturas = gestor.obtener_facturas()
    return [factura_to_dict(f) for f in facturas]

@app.get("/facturas/{id}", response_model=FacturaOut)
def obtener_factura(id: int):
    f = gestor.obtener_factura_por_id(id)
    if not f:
        return {"error": "Factura no encontrada"}
    return factura_to_dict(f)

@app.post("/facturas", response_model=FacturaOut)
def crear_factura(data: FacturaIn):
    nueva = gestor.crear_factura(**data.dict())
    return factura_to_dict(nueva)

@app.delete("/facturas/{id}")
def eliminar_factura(id: int):
    gestor.eliminar_factura(id)
    return {"mensaje": "Factura eliminada"}
