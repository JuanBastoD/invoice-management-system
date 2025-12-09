from src.models.factura import Factura
from .validaciones import validar_factura_data
from src.services.database_service import DatabaseService


class GestorDeFacturas:

    def __init__(self):
        self.db = DatabaseService()

    def crear_factura(self, **kwargs):
        validar_factura_data(kwargs)
        factura = Factura(**kwargs)
        self.db.insertar_factura(factura)
        return factura

    def obtener_facturas(self, filtros=None):
        rows = self.db.consultar_facturas(filtros)
        facturas = []

        for row in rows:
            _, tipo, entidad, estado, fecha_e, fecha_v, monto, desc, path = row
            facturas.append(
                Factura(
                    tipo=tipo,
                    entidad=entidad,
                    estado=estado,
                    fecha_emision=fecha_e,
                    fecha_vencimiento=fecha_v,
                    monto=monto,
                    descripcion=desc,
                    path_pdf=path
                )
            )

        return facturas

    def actualizar_factura(self, factura_id, nuevos_datos):
        return self.db.actualizar_factura(factura_id, nuevos_datos)

    def eliminar_factura(self, factura_id):
        self.db.eliminar_factura(factura_id)
