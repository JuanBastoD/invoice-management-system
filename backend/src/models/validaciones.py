import os
from fastapi import HTTPException

TIPOS_VALIDOS = ["entrada", "salida"]
ESTADOS_VALIDOS = ["pendiente", "pagada", "vencida", "en revision"]


def validar_factura_data(data):
    if "path_pdf" not in data or not data["path_pdf"]:
        raise ValueError("La factura debe tener un PDF asociado")

    if data["tipo"] not in TIPOS_VALIDOS:
        raise ValueError("Tipo de factura inválido")

    if data["estado"] not in ESTADOS_VALIDOS:
        raise ValueError("Estado de factura inválido")

    if data["monto"] <= 0:
        raise ValueError("El monto debe ser mayor a cero")

    if not os.path.exists(data["path_pdf"]):
        raise ValueError("El archivo PDF no existe")
