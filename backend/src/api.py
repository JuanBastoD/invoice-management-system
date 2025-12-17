from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
import uuid
import logging
from datetime import datetime
from src.funcional import total_facturado, contar_pendientes, filtrar_por_estado, total_por_mes
from src.models.gestor_facturas import GestorDeFacturas
from src.models.schema import FacturaIn

# ----------------------------
# Inicialización de la app
# ----------------------------
app = FastAPI(title="Gestor de Facturas")

# Instancia del gestor de facturas
gestor = GestorDeFacturas()

# Carpeta para almacenar PDFs
os.makedirs("facturas", exist_ok=True)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar a la URL de tu frontend en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO)


# ----------------------------
# Funciones auxiliares
# ----------------------------
def factura_to_dict(f):
    """Convierte un objeto factura a diccionario para la respuesta"""
    path_pdf = f.path_pdf.replace("\\", "/") if f.path_pdf else None

    return {
        "id": getattr(f, "id", None),
        "tipo": f.tipo,
        "entidad": f.entidad,
        "estado": f.estado,
        "fecha_emision": f.fecha_emision,
        "fecha_vencimiento": f.fecha_vencimiento,
        "monto": f.monto,
        "descripcion": f.descripcion,
        "path_pdf": path_pdf,
    }

# ----------------------------
# Endpoints: Gestión de facturas (CRUD)
# ----------------------------


@app.get("/facturas", tags=["Facturas"])
def obtener_facturas():
    """Lista todas las facturas"""
    facturas = gestor.obtener_facturas()
    return [factura_to_dict(f) for f in facturas]


@app.get("/facturas/{id}", tags=["Facturas"])
def obtener_factura(id: int):
    """Obtiene una factura por ID"""
    factura = gestor.obtener_factura_por_id(id)
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return factura_to_dict(factura)


@app.get("/facturas/numero/{numero}", tags=["Facturas"])
def obtener_factura_por_numero(numero: str):
    """Obtiene una factura por número"""
    f = gestor.obtener_por_numero(numero)
    if not f:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return factura_to_dict(f)


@app.post("/facturas", tags=["Facturas"])
def crear_factura(data: FacturaIn):
    """Crea una nueva factura"""
    logging.info("Datos recibidos: %s", data.dict())
    factura = gestor.crear_factura(**data.dict())
    logging.info("Factura creada: %s", factura_to_dict(factura))
    return factura_to_dict(factura)


@app.put("/facturas/{id}", tags=["Facturas"])
def actualizar_factura(id: int, data: FacturaIn):
    # Obtener la factura existente
    factura = gestor.obtener_por_id(id)
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    # Construir un dict solo con valores válidos para SQLite
    nuevos_datos = {
        "numero_factura": data.numero_factura or factura.numero_factura,
        "tipo": data.tipo or factura.tipo,
        "entidad": data.entidad or factura.entidad,
        "estado": data.estado or factura.estado,
        "fecha_emision": data.fecha_emision or factura.fecha_emision,
        "fecha_vencimiento": data.fecha_vencimiento or factura.fecha_vencimiento,
        "monto": data.monto or factura.monto,
        "descripcion": data.descripcion or factura.descripcion,
        "path_pdf": data.path_pdf or factura.path_pdf
    }

    gestor.actualizar_factura(id, nuevos_datos)

    # Devolver la factura actualizada
    factura_actualizada = gestor.obtener_por_id(id)
    return factura_to_dict(factura_actualizada)


@app.delete("/facturas/{id}", tags=["Facturas"])
def eliminar_factura(id: int):
    """Elimina una factura y su PDF asociado si existe"""
    factura = gestor.obtener_factura_por_id(id)
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    # Eliminar archivo PDF
    if factura.path_pdf and os.path.exists(factura.path_pdf):
        os.remove(factura.path_pdf)
        logging.info("PDF eliminado: %s", factura.path_pdf)

    # Eliminar factura del gestor
    gestor.eliminar_factura(id)
    return {"mensaje": "Factura eliminada"}


# ----------------------------
# Endpoints: Gestión de PDFs
# ----------------------------

@app.post("/upload/pdf", tags=["PDF"])
async def upload_pdf(pdf: UploadFile):
    """Sube un PDF a la carpeta 'facturas'"""
    # Evitar sobreescritura usando un UUID
    filename = f"{uuid.uuid4()}_{pdf.filename.replace(' ', '_')}"
    save_path = os.path.join("facturas", filename)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(pdf.file, buffer)

    logging.info("PDF subido: %s", save_path)
    return {"path_pdf": save_path}


@app.put("/facturas/{id}/pdf", tags=["PDF"])
async def actualizar_pdf(id: int, pdf: UploadFile):
    """Reemplaza el PDF de una factura"""
    factura = gestor.obtener_factura_por_id(id)
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    # Elimina PDF antiguo
    if factura.path_pdf and os.path.exists(factura.path_pdf):
        os.remove(factura.path_pdf)
        logging.info("PDF eliminado: %s", factura.path_pdf)

    # Guarda nuevo PDF
    filename = f"{uuid.uuid4()}_{pdf.filename.replace(' ', '_')}"
    save_path = os.path.join("facturas", filename)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(pdf.file, buffer)

    factura.path_pdf = save_path
    gestor.actualizar_factura(factura)

    logging.info("PDF actualizado: %s", save_path)
    return factura_to_dict(factura)


# ----------------------------
# Endpoints: Estadísticas
# ----------------------------
@app.get("/estadisticas")
def estadisticas():
    facturas = gestor.obtener_facturas_raw()

    now = datetime.now()
    stats = {
        "total_facturado": total_facturado(facturas),
        "pendientes": contar_pendientes(facturas),
        "pagadas": len(filtrar_por_estado(facturas, "pagada")),
        "vencidas": len(filtrar_por_estado(facturas, "vencida")),
        "cantidad_total": len(facturas),
        "total_mes_actual": total_por_mes(facturas, now.year, now.month)
    }

    return stats


# ----------------------------
# Servir PDFs
# ----------------------------
app.mount("/pdf", StaticFiles(directory="facturas"), name="pdf")
