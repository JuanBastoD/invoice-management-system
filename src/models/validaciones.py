import os 

TIPOS_VALIDOS = ["entrada", "salida"]
ESTADOS_VALIDOS = ["pendiente","pagada","vencida","en revision"]

def validar_factura_data(data):
    if data["tipo"] not in TIPOS_VALIDOS:
        raise ValueError("Tipo de factura invalido")
    
    if data["estado"] not in ESTADOS_VALIDOS:
        raise ValueError("Estado de factura inválido")
    
    if data["monto"] <=0:
        raise ValueError ("El monto debe ser mayor a cero")
    
    if not os.path.exists(data["path_pdf"]):
        raise FileNotFoundError("El archivo PDF no existe")
    
    return True