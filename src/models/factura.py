class Factura:
    def __init__(self, tipo, entidad, estado, fecha_emision,
                 fecha_vencimiento, monto, descripcion, path_pdf):
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
