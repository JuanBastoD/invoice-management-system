from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.models.gestor_facturas import GestorDeFacturas

app = FastAPI()
gestor = GestorDeFacturas()

# ‼ Permitir acceso desde tu frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/facturas")
def get_facturas():
    return gestor.obtener_facturas()

@app.post("/facturas")
def crear_factura(data: dict):
    gestor.crear_factura(**data)
    return {"mensaje": "Factura creada correctamente"}

@app.get("/facturas/{id}")
def get_factura(id: int):
    return gestor.obtener_factura_por_id(id)

@app.delete("/facturas/{id}")
def borrar_factura(id: int):
    gestor.eliminar_factura(id)
    return {"mensaje": "Factura eliminada"}
