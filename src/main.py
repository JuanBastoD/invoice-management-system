from src.models.gestor_facturas import GestorDeFacturas

gestor = GestorDeFacturas()

factura = gestor.crear_factura(
    tipo="entrada",
    entidad="Proveedor X",
    estado="pendiente",
    fecha_emision="2025-01-10",
    fecha_vencimiento="2025-01-20",
    monto=150000,
    descripcion="Compra de materiales",
    path_pdf="facturas/prueba.pdf"
)

print ("Factura creada:", factura)

print ("Todas las facturas: ")
for f in gestor.obtener_facturas():
    print(f)