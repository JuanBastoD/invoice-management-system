import sqlite3
import os
DB_PATH = os.path.join("database", "facturas.db")
SCHEMA_PATH = os.path.join("database", "schema.sql")


class DatabaseService:
    def __init__(self):
        self.conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row  # <--- importante
        self.create_schema()


    def create_schema(self):
        with open(SCHEMA_PATH, "r") as f:
            schema = f.read()
        self.conn.executescript(schema)

    def insertar_factura(self, factura):
        query = """
            INSERT INTO facturas (
                numero_factura, tipo, entidad, estado,
                fecha_emision, fecha_vencimiento,
                monto, descripcion, path_pdf
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        cursor = self.conn.execute(query, (
            factura.numero_factura,
            factura.tipo,
            factura.entidad,
            factura.estado,
            factura.fecha_emision,
            factura.fecha_vencimiento,
            factura.monto,
            factura.descripcion,
            factura.path_pdf
            ))
        self.conn.commit()
        print("Insertando en DB:", factura.numero_factura)
        return cursor.lastrowid

    def consultar_facturas(self, filtros=None):
        base_query = "SELECT * FROM facturas"
        valores = []

        if filtros:
            condiciones = [f"{k} = ?" for k in filtros.keys()]
            valores = list(filtros.values())
            base_query += " WHERE " + " AND ".join(condiciones)

        cursor = self.conn.execute(base_query, valores)
        return cursor.fetchall()  # ahora devuelve dict-like rows



    def actualizar_factura(self, factura_id, nuevos_datos):
        campos = ", ".join([f"{k} = ?" for k in nuevos_datos.keys()])
        valores = list(nuevos_datos.values())
        valores.append(factura_id)

        query = f"UPDATE facturas SET {campos} WHERE id = ?"
        self.conn.execute(query, valores)
        self.conn.commit()

    def eliminar_factura(self, factura_id):
        query = "DELETE FROM facturas WHERE id =  ?"
        self.conn.execute(query, (factura_id,))
        self.conn.commit()
