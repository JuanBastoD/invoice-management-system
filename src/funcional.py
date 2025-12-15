from functools import reduce
from datetime import datetime


def filtrar_facturas(facturas, predicado):
    return list(filter(predicado, facturas))


def mapear_montos(facturas):
    # en la posicion 6 se encuentra el campo monto
    return list(map(lambda f: f[6], facturas))


def total_facturado(facturas):
    montos = map(lambda f: f[6], facturas)
    return reduce(lambda acc, x: acc + x, montos, 0)


def contar_pendientes(facturas):
    pendientes = filter(lambda f: f[3] == "pendiente", facturas)  # estado
    return len(list(pendientes))


def filtrar_por_estado(facturas, estado):
    return list(filter(lambda f: f[3] == estado, facturas))


def total_por_mes(facturas, year, month):
    # filtramos por facturas que el mes y el año coincidan
    facturas_mes = filter(lambda f: (
        datetime.strftime(f[4], "%Y-%m-%d").year == year and
        datetime.strftime(f[4], "%Y-%m-%d").month == month
    ), facturas)

    # extraemos los montos
    montos = map(lambda f: f[6], facturas_mes)

    # sumamos
    return reduce(lambda acc, x: acc + x, montos, 0)
