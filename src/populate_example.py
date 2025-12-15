from models.gestor_facturas import GestorDeFacturas

def poblar(gestor):
    ejemplos = [
        {
            "tipo": "entrada",
            "entidad": "Proveedor A",
            "estado": "pagada",
            "fecha_emision": "2025-02-01",
            "fecha_vencimiento": "2025-02-15",
            "monto": 200000,
            "descripcion": "Compra de insumos",
            "path_pdf": "facturas/a.pdf"
        },
        {
            "tipo": "salida",
            "entidad": "Cliente B",
            "estado": "pendiente",
            "fecha_emision": "2025-02-05",
            "fecha_vencimiento": "2025-02-20",
            "monto": 350000,
            "descripcion": "Venta de producto",
            "path_pdf": "facturas/b.pdf"
        }
    ]

    for f in ejemplos:
        gestor.crear_factura(**f)

if __name__ == "__main__":
    g = GestorDeFacturas()
    poblar(g)
    print("Base de datos poblada con datos de ejemplo")
