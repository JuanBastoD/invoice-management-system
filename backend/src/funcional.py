from functools import reduce
from datetime import datetime


def filtrar_facturas(facturas, predicado):
    return list(filter(predicado, facturas))


def mapear_montos(facturas):
    # en la posicion 6 se encuentra el campo monto
    return list(map(lambda f: float(f[7]), facturas))


def total_facturado(facturas):
    montos = map(lambda f: float(f[7]), facturas)
    return reduce(lambda acc, x: acc + x, montos, 0)


def contar_pendientes(facturas):
    pendientes = filter(lambda f: f[4] == "pendiente", facturas)  # estado
    return len(list(pendientes))


def filtrar_por_estado(facturas, estado):
    return list(filter(lambda f: f[4] == estado, facturas))


def total_por_mes(facturas, year, month):
    # filtramos por facturas que el mes y el año coincidan
    facturas_mes = filter(lambda f: (
        datetime.strptime(f[5], "%Y-%m-%d").year == year and
        datetime.strptime(f[5], "%Y-%m-%d").month == month
    ), facturas)

    # extraemos los montos y aseguramos que sean float
    montos = map(lambda f: float(f[7]), facturas_mes)

    # sumamos
    return reduce(lambda acc, x: acc + x, montos, 0)
