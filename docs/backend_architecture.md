# 📘 Documentación Técnica — Sistema Local de Gestión de Facturas

## 1. Descripción General

Este proyecto es un sistema local para la gestión de facturas en PDF, pensado para pequeños negocios o trabajadores independientes.  
Permite cargar, almacenar, consultar y organizar facturas usando una base de datos SQLite y una arquitectura multiparadigma.

El sistema será la base para una futura interfaz gráfica.

---

## 2. Arquitectura General

El sistema utiliza tres paradigmas:

### ✔ Imperativo
- Manejo del sistema de archivos
- Validaciones
- Flujo secuencial de carga de datos
- Ejecución paso a paso de consultas SQL

### ✔ Orientado a Objetos
Clases principales:
- Factura
- GestorDeFacturas
- (Futuro) ControladorGUI

### ✔ Funcional (Persona B)
- Filtros: facturas vencidas, facturas por estado, facturas por tipo
- Map: transformar facturas a estadísticas  
- Reduce: totales por mes, totales por estado, totales globales

---

## 3. Estructura del Proyecto

Estructura recomendada del proyecto:
```
/
├── readme.md
├── database
│   ├── facturas.db
│   └── schema.sql
├── docs
│   ├── arquitectura.md
│   ├── backend_architecture.md
│   ├── clases.md
│   ├── funcional.md
│   └── pruebas.md
├── facturas
├── src
│   ├── funcional.py
│   ├── main.py
│   ├── populate_example.py
│   ├── __init__.py
│   ├── models
│   │   ├── factura.py
│   │   ├── gestor_facturas.py
│   │   └── validaciones.py
│   └── services
│       └── database_service.py
└── test
    ├── conftest.py
    └── test_backend.py
```
---

## 4. Base de Datos

SQLite — archivo: facturas.db  
Tabla principal: facturas

| Campo              | Tipo        |
|-------------------|-------------|
| id                | INTEGER PK  |
| tipo              | TEXT        |
| entidad           | TEXT        |
| estado            | TEXT        |
| fecha_emision     | TEXT        |
| fecha_vencimiento | TEXT        |
| monto             | REAL        |
| descripcion       | TEXT        |
| ruta_pdf          | TEXT        |

---

## 5. Clase Factura

Representa una factura con todos sus atributos.

Atributos:
- tipo
- entidad
- estado
- fecha_emision
- fecha_vencimiento
- monto
- descripcion
- ruta_pdf

---

## 6. Clase GestorDeFacturas

Cumple con todas las operaciones CRUD.

### Métodos implementados:
- agregar_factura()
- obtener_facturas()
- obtener_factura_por_id()
- actualizar_factura()
- eliminar_factura()

Incluye validaciones sobre:
- rutas
- tipos
- estados
- fechas
- monto

---

## 7. Pruebas Unitarias

Ubicadas en: tests/test_crud.py

Incluyen validación de:
- creación de factura
- lectura desde SQLite
- actualización
- eliminación
- validación de datos inválidos
- integridad de DB

---

## 8. Flujo de Uso

1. Usuario selecciona PDF  
2. Se valida la ruta y el archivo  
3. Se completan los metadatos  
4. Se crea un objeto Factura  
5. Se inserta en la base de datos  
6. La factura queda disponible para listados y filtros

---