from datetime import datetime

class Factura:
    
    TIPOS_VALIDOS: {"entrada", "salida"}
    ESTADOS_VALIDOS: {"pagada", "pendiente", "vencida", "en revision"
                      }
    def __init__(self, tipo, entidad, estado, fecha_emision,
                 fecha_vencimiento, monto, descripcion, path_pdf):
        
        if tipo not in self.TIPOS_VALIDOS:
            raise ValueError(f"Tipo inválido: {tipo}")
        
        if estado not in self.ESTADOS_VALIDOS:
            raise ValueError(f"Estado inválido: {estado}")
        
        #fechas
        try:
            datetime.fromisoformat(fecha_emision)
        except:
            raise ValueError("Fecha de emision debe tener formato YYYY-MM-DD")
        
        if fecha_vencimiento:
            try:
                datetime.fromisoformat(fecha_vencimiento)
            except:
                raise ValueError("Fecha de vencimiento debe tener formato YYYY-MM-DD")
            
        if not isinstance(monto, (int, float)) or monto <= 0:
            raise ValueError("El monto debe ser un número mayor que 0")
        self.tipo = tipo
        self.entidad = entidad
        self.estado = estado
        self.fecha_emision = fecha_emision
        self.fecha_vencimiento = fecha_vencimiento
        self.monto = monto
        self.descripcion = descripcion
        self.path_pdf = path_pdf
    
    def __repr__(self):
        return f"<Factura {self.tipo} - {self.monto} - {self.estado}>"
