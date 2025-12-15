# 📚 Documentación de Clases

## Clase Factura
Representa un documento del negocio.

### Atributos:
- tipo
- entidad
- estado
- fecha_emision
- fecha_vencimiento
- monto
- descripcion
- ruta_pdf

## Clase GestorDeFacturas
Encargada de manejar la base de datos.

### Métodos:
- crear_factura(**kwargs)
- obtener_facturas()
- obtener_factura_por_id(id)
- actualizar_factura(id, datos)
- actualizar_estado(id, estado)
- buscar_por_rango_de_fechas(inicio, fin)
- total_por_entidad(entidad)
- obtener_pendientes()
- obtener_total_mensual(year,month)
- eliminar_factura(id)
