from fastapi import FastAPI, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import shutil
import logging

from src.models.gestor_facturas import GestorDeFacturas
from src.models.schema import FacturaIn, FacturaOut
from src.funcional import (
    total_facturado,
    contar_pendientes,
    filtrar_por_estado
)

app = FastAPI()
gestor = GestorDeFacturas()

os.makedirs("facturas", exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.get("/facturas/numero/{numero}")
def obtener_factura_por_numero(numero: str):
    f = gestor.obtener_por_numero(numero)
    if not f:
        return {"error": "Factura no encontrada"}
    return factura_to_dict(f)


@app.post("/facturas")
async def crear_factura(data: FacturaIn):
    logging.info("Datos recibidos: %s", data.dict())
    factura = gestor.crear_factura(**data.dict())
    logging.info("Factura creada: %s", factura_to_dict(factura))
    return factura_to_dict(factura)


@app.delete("/facturas/{id}")
def eliminar_factura(id: int):
    gestor.eliminar_factura(id)
    return {"mensaje": "Factura eliminada"}


@app.get("/estadisticas")
def obtener_estadisticas():
    facturas = gestor.obtener_facturas_raw()

    total = total_facturado(facturas)
    pendientes = contar_pendientes(facturas)

    return {
        "total_facturado": total,
        "pendientes": pendientes,
        "pagadas": len(filtrar_por_estado(facturas, "pagada")),
        "vencidas": len(filtrar_por_estado(facturas, "vencida")),
        "cantidad_total": len(facturas),
    }


logging.basicConfig(level=logging.INFO)


@app.post("/upload/pdf")
async def upload_pdf(pdf: UploadFile):
    filename = pdf.filename.replace(" ", "_")  # reemplaza espacios
    save_path = os.path.join("facturas", filename)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(pdf.file, buffer)
    return {"path_pdf": f"facturas/{filename}"}


app.mount("/pdf", StaticFiles(directory="facturas"), name="pdf")
