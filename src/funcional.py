from functools import reduce

def filtrar_facturas(facturas,predicado):
    return list(filter(predicado, facturas))

def mapear_montos(facturas):
    return list(map(lambda f: f[6], facturas)) #en la posicion 6 se encuentra el campo monto

def total_facturado(facturas):
    montos = map (lambda f: f[6], facturas)
    return reduce(lambda acc, x : acc + x, montos, 0)

def contar_pendientes(facturas):
    pendientes = filter (lambda f: f[3] =="pendiente", facturas) #estado
    return len (list(pendientes))