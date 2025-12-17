from src.models.gestor_facturas import GestorDeFacturas

gestor = GestorDeFacturas()

print("Todas las facturas existentes en la base de datos:")
for f in gestor.obtener_facturas():
    print(f)
