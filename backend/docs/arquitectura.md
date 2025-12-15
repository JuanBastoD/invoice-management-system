# 🏗 Arquitectura del Sistema

## Objetivo
Documentar la estructura interna del sistema y las decisiones técnicas tomadas.

---

## Patrón principal
El proyecto combina:

- Arquitectura modular
- Clases para representar el dominio
- Paradigma funcional para procesar colecciones
- Uso de SQLite como almacenamiento local

---

## Módulos principales

### 1. `factura.py`
Responsable de representar una sola factura.

### 2. `gestor_facturas.py`
Capa de acceso a datos (DAO):
- CRUD
- Validaciones
- Conversión entre filas SQL y objetos

### 3. `funcional.py`
Funciones puras para:
- Filtrar
- Transformar
- Reducir datos

---

## Flujo interno

Usuario → Factura() → Gestor.de.Agregar() → SQLite → Consultas → Procesado funcional → Resultados


---

## Justificación de decisiones

- **SQLite**: simple, portable, perfecto para trabajo local.
- **OOP + Funcional**: requisito del proyecto y buen ejemplo de multiparadigma.
- **PDFs locales**: evita usar servidores externos.
