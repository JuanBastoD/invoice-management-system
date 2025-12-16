from fastapi import FastAPI
from src.models.gestor_facturas import GestorDeFacturas
from src.models.schema import FacturaIn, FacturaOut
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
gestor = GestorDeFacturas()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # para desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/estadisticas")
def estadisticas():
    facturas = gestor.obtener_facturas()

    total_facturas = len(facturas)
    total_monto = sum(f.monto for f in facturas)
    pagadas = len([f for f in facturas if f.estado == "pagada"])
    pendientes = len([f for f in facturas if f.estado == "pendiente"])
    vencidas = len([f for f in facturas if f.estado == "vencida"])

    return {
        "total_facturas": total_facturas,
        "total_monto": total_monto,
        "pagadas": pagadas,
        "pendientes": pendientes,
        "vencidas": vencidas
    }
