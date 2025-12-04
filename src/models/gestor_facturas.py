from src.models.factura import Factura
from src.services.database_service import DatabaseService

class GestorDeFacturas:
    
    def __init__(self):
        self.db =DatabaseService()
        
    def crear_factura(self, **kwargs):
        factura = Factura(**kwargs)
        self.db.insertar_factura(factura)
        return factura
    
    def obtener_facturas(self, filtros=None):
        return self.db.consultar_facturas(filtros)