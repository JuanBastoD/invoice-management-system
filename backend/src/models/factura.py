from datetime import datetime


class Factura:

    TIPOS_VALIDOS = {"entrada", "salida"}
    ESTADOS_VALIDOS = {"pagada", "pendiente", "vencida", "en revision"}

    def __init__(
        self,
        numero_factura,
        tipo,
        entidad,
        estado,
        fecha_emision,
        fecha_vencimiento,
        monto,
        descripcion,
        path_pdf=None
    ):
        if not numero_factura or not isinstance(numero_factura, str):
            raise ValueError("El número de factura es obligatorio")

        if tipo not in self.TIPOS_VALIDOS:
            raise ValueError(f"Tipo inválido: {tipo}")

        if estado not in self.ESTADOS_VALIDOS:
            raise ValueError(f"Estado inválido: {estado}")

        try:
            datetime.fromisoformat(str(fecha_emision))
        except:
            raise ValueError("Fecha de emisión debe tener formato YYYY-MM-DD")

        if fecha_vencimiento:
            try:
                datetime.fromisoformat(str(fecha_vencimiento))
            except:
                raise ValueError(
                    "Fecha de vencimiento debe tener formato YYYY-MM-DD")

        if not isinstance(monto, (int, float)) or monto <= 0:
            raise ValueError("El monto debe ser mayor que 0")

        self.id = id
        self.numero_factura = numero_factura
        self.tipo = tipo
        self.entidad = entidad
        self.estado = estado
        self.fecha_emision = fecha_emision
        self.fecha_vencimiento = fecha_vencimiento
        self.monto = monto
        self.descripcion = descripcion
        self.path_pdf = path_pdf
