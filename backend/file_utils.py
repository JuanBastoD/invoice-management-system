import os, sys, subprocess

def abrir_pdf(path):
    if not os.path.exists(path):
        raise FileNotFoundError("El PDF no existe")

    if sys.platform.startswith("darwin"):
        subprocess.Popen(["open", path])
    elif os.name == "nt":
        os.startfile(path)
    else:
        subprocess.Popen(["xdg-open", path])

def fila_a_dict(fila):
    keys = ["id","tipo","entidad","estado","fecha_emision","fecha_vencimiento","monto","descripcion","path_pdf"]
    return dict(zip(keys, fila))
