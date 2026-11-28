"""Biblioteca de modelagem no estilo "brinquedo de montar" (peças com pinos, bonecos articulados).

Tudo é genérico: nenhuma marca, logotipo ou peça licenciada é reproduzida.
Uso: /opt/tools/bpyenv/bin/python <script>.py   (bpy 5.3, Cycles na CPU + OpenImageDenoise)
"""
import math
import bpy
from mathutils import Vector

STUD_R, STUD_H = 0.3, 0.17  # proporções de um pino (unidade = 1 módulo)


# ------------------------------------------------------------------ cena e render

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = 64
    sc.cycles.use_denoising = True
    sc.view_settings.view_transform = 'AgX'
    try:
        sc.view_settings.look = 'AgX - Medium High Contrast'
    except Exception:
        pass
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    return sc


def world(color=(0.01, 0.03, 0.08), strength=1.0):
    w = bpy.data.worlds.new('w')
    bpy.context.scene.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs[0].default_value = (*color, 1)
    bg.inputs[1].default_value = strength


def area_light(loc, energy, size, color=(1, 1, 1), target=(0, 0, 1)):
    bpy.ops.object.light_add(type='AREA', location=loc)
    l = bpy.context.object
    l.data.energy = energy
    l.data.size = size
    l.data.color = color
    d = Vector(target) - Vector(loc)
    l.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return l


def studio(key=1.0, warm=False):
    """Iluminação de estúdio: luz principal suave, preenchimento e contorno."""
    kc = (1.0, 0.92, 0.8) if warm else (1, 0.98, 0.95)
    area_light((5, -6, 8), 1800 * key, 6, kc)
    area_light((-7, -3, 4), 500 * key, 8, (0.75, 0.85, 1.0))
    area_light((0, 7, 6), 900 * key, 5, (0.7, 0.85, 1.0))  # contorno azulado


def camera(loc, target, lens=50, ortho=None, dof=None):
    bpy.ops.object.camera_add(location=loc)
    cam = bpy.context.object
    d = Vector(target) - Vector(loc)
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    cam.data.lens = lens
    if ortho:
        cam.data.type = 'ORTHO'
        cam.data.ortho_scale = ortho
    if dof:
        cam.data.dof.use_dof = True
        cam.data.dof.focus_distance = d.length
        cam.data.dof.aperture_fstop = dof
    bpy.context.scene.camera = cam
    return cam


def render(path, w, h, transparent=True, samples=64):
    sc = bpy.context.scene
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = w, h, 100
    sc.render.film_transparent = transparent
    sc.cycles.samples = samples
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)


# ------------------------------------------------------------------ materiais

_mats = {}


def plastic(rgb, rough=0.22, name=None, emit=0.0):
    key = (tuple(round(c, 3) for c in rgb), rough, emit)
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new(name or f'p{len(_mats)}')
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Specular IOR Level'].default_value = 0.55
    b.inputs['Coat Weight'].default_value = 0.25
    b.inputs['Coat Roughness'].default_value = 0.08
    if emit:
        b.inputs['Emission Color'].default_value = (*rgb, 1)
        b.inputs['Emission Strength'].default_value = emit
    _mats[key] = m
    return m


def metal(rgb, rough=0.25):
    m = bpy.data.materials.new('metal')
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1)
    b.inputs['Metallic'].default_value = 1.0
    b.inputs['Roughness'].default_value = rough
    return m


# cores (lineares) da paleta: azul-marinho, azul-claro, branco, âmbar
NAVY = (0.012, 0.035, 0.11)
NAVY2 = (0.02, 0.07, 0.2)
SKY = (0.2, 0.52, 0.85)
WHITE = (0.85, 0.86, 0.88)
AMBER = (1.0, 0.38, 0.015)
SKIN = (0.95, 0.7, 0.08)     # tom amarelo clássico dos bonecos de montar
SUIT = (0.025, 0.03, 0.045)
SHIRT = (0.9, 0.9, 0.92)
HAIR = (0.06, 0.035, 0.02)
BLACK = (0.01, 0.01, 0.012)


# ------------------------------------------------------------------ primitivas

def _finish(o, mat, bevel, segs=3, smooth=True):
    if bevel:
        mod = o.modifiers.new('bevel', 'BEVEL')
        mod.width = bevel
        mod.segments = segs
        mod.limit_method = 'ANGLE'
    if mat:
        o.data.materials.append(mat)
    if smooth:
        bpy.ops.object.shade_smooth()
    return o


def box(loc, size, mat, bevel=0.05, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.object
    o.scale = [s / 2 for s in size]
    bpy.ops.object.transform_apply(scale=True)
    return _finish(o, mat, bevel)


def cyl(loc, r, d, mat, bevel=0.03, rot=(0, 0, 0), verts=48):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc, rotation=rot, vertices=verts)
    return _finish(bpy.context.object, mat, min(bevel, d / 4, r / 3))


def sphere(loc, r, mat, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=48, ring_count=24)
    o = bpy.context.object
    o.scale = scale
    return _finish(o, mat, 0)


def stud(x, y, z, mat, r=STUD_R):
    return cyl((x, y, z + STUD_H / 2), r, STUD_H, mat, bevel=0.025)


def brick(x, y, z, w, d, mat, h=1.2, studs=True):
    """Peça w×d módulos, canto inferior em (x, y, z)."""
    box((x + w / 2, y + d / 2, z + h / 2), (w - 0.02, d - 0.02, h), mat, bevel=0.04)
    if studs:
        for i in range(w):
            for j in range(d):
                stud(x + i + 0.5, y + j + 0.5, z + h, mat)


def plate(x, y, z, w, d, mat, studs=True):
    brick(x, y, z, w, d, mat, h=0.4, studs=studs)


def join(objs, name='obj'):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    o = bpy.context.object
    o.name = name
    return o


def group(name, objs, loc=(0, 0, 0), rot=(0, 0, 0)):
    """Agrupa objetos sob um empty (para posar braços, cabeça etc.)."""
    bpy.ops.object.empty_add(location=loc)
    e = bpy.context.object
    e.name = name
    for o in objs:
        o.parent = e
        o.matrix_parent_inverse = e.matrix_world.inverted()
    e.rotation_euler = rot  # gira depois de parentear: os filhos acompanham
    return e


# ------------------------------------------------------------------ boneco de montar (genérico)

def minifig(name, torso=SUIT, legs=SUIT, hair=HAIR, skin=SKIN, shirt=SHIRT, tie=NAVY2, hood=None,
            arm_l=0.0, arm_r=0.0, head_turn=0.0, smile=True, back=False, loc=(0, 0, 0), rot_z=0.0, scale=1.0, hand_item=None):
    """Boneco estilizado (~4 unidades de altura). arm_l/arm_r: ângulo (graus) de levantar o braço para a frente."""
    S = plastic(skin, 0.3)
    T = plastic(torso, 0.3)
    L = plastic(legs, 0.3)
    parts = []
    # quadril e pernas
    parts.append(box((0, 0, 1.55), (1.55, 0.75, 0.28), L, 0.04))
    for sx in (-0.4, 0.4):
        parts.append(box((sx, 0.02, 0.75), (0.74, 0.8, 1.3), L, 0.06))
        parts.append(box((sx, -0.1, 0.12), (0.74, 1.0, 0.24), L, 0.05))  # pé
    # tronco trapezoidal
    bpy.ops.mesh.primitive_cube_add(location=(0, 0, 2.35))
    t = bpy.context.object
    t.scale = (0.78, 0.38, 0.65)
    bpy.ops.object.transform_apply(scale=True)
    for v in t.data.vertices:
        if v.co.z > 2.35:
            v.co.x *= 0.78
    _finish(t, T, 0.06)
    parts.append(t)
    if not back and shirt:
        # camisa (V) e gravata na frente
        bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -0.385, 2.68), rotation=(math.radians(90), 0, 0))
        p = bpy.context.object
        p.data.vertices[0].co = Vector((-0.28, 0.32, 0))
        p.data.vertices[1].co = Vector((0.28, 0.32, 0))
        p.data.vertices[2].co = Vector((0, -0.42, 0))
        p.data.vertices[3].co = Vector((0, -0.42, 0))
        bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.remove_doubles(); bpy.ops.object.mode_set(mode='OBJECT')
        p.data.materials.append(plastic(shirt, 0.35))
        parts.append(p)
        if tie:
            parts.append(box((0, -0.39, 2.45), (0.14, 0.02, 0.62), plastic(tie, 0.3), 0.01))
    # pescoço e cabeça
    parts.append(cyl((0, 0, 3.05), 0.22, 0.12, S))
    head = cyl((0, 0, 3.42), 0.48, 0.62, S, bevel=0.12)
    face = []
    if not back:
        for ex in (-0.17, 0.17):
            face.append(cyl((ex, -0.475, 3.5), 0.055, 0.03, plastic(BLACK, 0.4), rot=(math.radians(90), 0, 0), bevel=0.0, verts=24))
        if smile:
            bpy.ops.mesh.primitive_torus_add(major_radius=0.17, minor_radius=0.025, location=(0, -0.47, 3.35), rotation=(math.radians(90), 0, 0))
            tr = bpy.context.object
            bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='DESELECT'); bpy.ops.object.mode_set(mode='OBJECT')
            for v in tr.data.vertices:
                v.select = v.co.y > -0.02  # metade de cima (em coordenadas locais) some → arco do sorriso
            bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.delete(type='VERT'); bpy.ops.object.mode_set(mode='OBJECT')
            tr.data.materials.append(plastic(BLACK, 0.4))
            face.append(tr)
        # sobrancelhas
        for ex in (-0.17, 0.17):
            face.append(box((ex, -0.48, 3.62), (0.16, 0.02, 0.035), plastic(BLACK, 0.4), 0.005))
    # cabelo / capuz
    if hood:
        hd = sphere((0, 0.05, 3.55), 0.62, plastic(hood, 0.45), scale=(1, 1, 0.95))
        parts.append(hd)
    elif hair:
        hr = sphere((0, 0.04, 3.62), 0.53, plastic(hair, 0.4), scale=(1, 1, 0.72))
        parts.append(hr)
        if not back:
            # franja: corta a frente baixa do cabelo com um cubo
            pass
    head_grp = group(name + '_head', [head] + face, loc=(0, 0, 3.1), rot=(0, 0, math.radians(head_turn)))
    # braços (giram no ombro)
    arms = []
    for side, ang in ((-1, arm_l), (1, arm_r)):
        sh = Vector((side * 0.78, 0, 2.78))
        a = cyl((side * 0.86, 0, 2.38), 0.17, 0.85, T, rot=(0, math.radians(side * 8), 0))
        hand = cyl((side * 0.9, -0.05, 1.85), 0.16, 0.3, S)
        extra = []
        if hand_item and side == 1:
            extra = hand_item((side * 0.9, -0.25, 1.75))
        g = group(f'{name}_arm{side}', [a, hand] + extra, loc=tuple(sh), rot=(math.radians(-ang), 0, 0))
        arms.append(g)
    root = group(name, parts + [head_grp] + arms, loc=(0, 0, 0))
    root.location = loc
    root.rotation_euler = (0, 0, math.radians(rot_z))
    root.scale = (scale, scale, scale)
    return root


def bounds(objs):
    pts = []
    for o in objs:
        for c in o.bound_box:
            pts.append(o.matrix_world @ Vector(c))
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return mn, mx
