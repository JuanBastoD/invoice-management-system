import pytest
from src.models.gestor_facturas import GestorDeFacturas
from src.models.validaciones import validar_factura_data
from src.funcional import filtrar_facturas, total_facturado

# PRUEBAS DE VALIDACION


def test_validacion_correcta():
    data = {
        "tipo": "entrada",
        "entidad": "Proveedor X",
        "estado": "pendiente",
        "fecha_emision": "2025-01-10",
        "fecha_vencimiento": "2025-01-20",
        "monto": 1000,
        "descripcion": "Compra",
        "path_pdf": "facturas/prueba.pdf"
    }

    # Simular un archivo PDF
    open("facturas/prueba.pdf", "w").close()

    assert validar_factura_data(data) == True


def test_validacion_tipo_invalido():
    data = {
        "tipo": "otro",
        "entidad": "Proveedor X",
        "estado": "pendiente",
        "fecha_emision": "2025-01-10",
        "fecha_vencimiento": "2025-01-20",
        "monto": 1000,
        "descripcion": "",
        "path_pdf": "facturas/prueba.pdf"
    }
    open("facturas/prueba.pdf", "w").close()

    with pytest.raises(ValueError):
        validar_factura_data(data)

# Pruebas base de datos


def test_insertar_factura(temp_db):
    gestor = GestorDeFacturas()

    # PDF temporal
    open("facturas/test.pdf", "w").close()
    factura = gestor.crear_factura(
        tipo="entrada",
        entidad="Test Inc",
        estado="pendiente",
        fecha_emision="2025-01-01",
        fecha_vencimiento=None,
        monto=500,
        descripcion="Test",
        path_pdf="facturas/test.pdf"
    )

    result = gestor.obtener_facturas()
    assert len(result) == 1
    assert result[0].entidad == "Test Inc"


def test_actualizar_factura(temp_db):
    gestor = GestorDeFacturas()

    open("facturas/test2.pdf", "w").close()

    factura = gestor.crear_factura(
        tipo="entrada",
        entidad="Empresa A",
        estado="pendiente",
        fecha_emision="2025-01-01",
        fecha_vencimiento="2025-01-10",
        monto=200,
        descripcion="Test",
        path_pdf="facturas/test2.pdf"
    )

    gestor.actualizar_factura(1, {"estado": "pagada"})
    result = gestor.obtener_facturas()

    assert result[0].estado == "pagada"


def test_eliminar_factura(temp_db):
    gestor = GestorDeFacturas()

    open("facturas/test3.pdf", "w").close()
    gestor.crear_factura(
        tipo="entrada",
        entidad="Empresa A",
        estado="pendiente",
        fecha_emision="2025-01-01",
        fecha_vencimiento=None,
        monto=300,
        descripcion="Test",
        path_pdf="facturas/test3.pdf"
    )

    gestor.eliminar_factura(1)
    result = gestor.obtener_facturas()
    
    assert len(result) == 0

# Prueba paradigma funcional

def test_total_facturado():
    facturas = [
        (1, "entrada", "X", "pendiente", "2025-01-01", None, 100, "", ""),
        (2, "entrada", "Y", "pendiente", "2025-01-01", None, 200, "", "")
    ]
    
    total = total_facturado(facturas)
    assert total == 300
    
def test_filtrar_facturas():
    facturas = [
        (1, "entrada", "A", "pendiente", "2025-01-01", None, 100, "", ""),
        (2, "entrada", "B", "pagada", "2025-01-01", None, 200, "", "")
    ]
    pendientes = filtrar_facturas(
        facturas,
        lambda f: f[3] == "pendiente"
    )
    assert len(pendientes) == 1
    assert pendientes [0][2]== "A"