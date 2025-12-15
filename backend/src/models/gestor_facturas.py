from src.models.factura import Factura
from .validaciones import validar_factura_data
from src.services.database_service import DatabaseService
from src.funcional import filtrar_por_estado, total_por_mes


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
            id = row[0]
            facturas.append(
                Factura(
                    tipo=tipo,
                    entidad=entidad,
                    estado=estado,
                    fecha_emision=fecha_e,
                    fecha_vencimiento=fecha_v,
                    monto=monto,
                    descripcion=desc,
                    path_pdf=path,
                    id=id
                )
            )

        return facturas

    def actualizar_factura(self, factura_id, nuevos_datos):
        return self.db.actualizar_factura(factura_id, nuevos_datos)

    def eliminar_factura(self, factura_id):
        self.db.eliminar_factura(factura_id)

    def obtener_factura_por_id(self, factura_id):
        filas = self.db.consultar_facturas({"id": factura_id})
        if not filas:
            return None
        
        row = filas[0]
        _, tipo, entidad, estado, fecha_e, fecha_v, monto, desc, path = row

        return Factura(
            tipo=tipo,
            entidad=entidad,
            estado=estado,
            fecha_emision=fecha_e,
            fecha_vencimiento=fecha_v,
            monto=monto,
            descripcion=desc,
            path_pdf=path
        )

    def actualizar_estado(self, factura_id, nuevo_estado):
        self.db.actualizar_factura(factura_id, {"estado": nuevo_estado})

    def buscar_por_rango_fechas(self, inicio, fin):
        query = """
            SELECT * FROM facturas
            WHERE fecha_emision BETWEEN ? AND ?
        """
        cursor = self.db.conn.execute(query, (inicio, fin))
        rows = cursor.fetchall()

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

    def total_por_entidad(self, entidad):
        query = "SELECT SUM(monto) FROM facturas WHERE entidad = ?"
        cursor = self.db.conn.execute(query, (entidad,))
        resultado = cursor.fetchone()[0]
        return resultado or 0
    
    def obtener_pendientes(self):
        filas = self.obtener_facturas()
        return filtrar_por_estado("pendiente")
    
    def obtener_total_mensual(self, year, month):
        filas = self.obtener_facturas()
        return total_por_mes(filas, year, month)
