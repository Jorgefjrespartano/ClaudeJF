import math, sys
sys.path.insert(0, '/home/user/ClaudeJF/video-lego/blender')
import bpy
from mathutils import Vector
from lib import *


def extruded(points, depth, mat, loc=(0, 0, 0), rot=(math.radians(90), 0, 0), bevel=0.08, name='shape'):
    """Peça plana extrudada a partir de um contorno 2D (x, y)."""
    me = bpy.data.meshes.new(name)
    me.from_pydata([(x, y, 0) for x, y in points], [], [list(range(len(points)))])
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    sol = o.modifiers.new('sol', 'SOLIDIFY'); sol.thickness = depth; sol.offset = 0
    bev = o.modifiers.new('bev', 'BEVEL'); bev.width = bevel; bev.segments = 4; bev.limit_method = 'ANGLE'
    o.data.materials.append(mat)
    o.location = loc
    o.rotation_euler = rot
    bpy.ops.object.shade_smooth()
    return o


def shield_pts(w=1.0, n=48):
    """Escudo clássico: topo levemente arqueado, laterais retas que se curvam até a ponta."""
    right = []
    for i in range(n + 1):
        t = i / n
        right.append((w * math.cos(t * math.pi / 2) ** 0.55, 0.85 - 2.25 * t))
    top = [(-w + 2 * w * i / 20, 0.85 + 0.12 * math.sin(math.pi * i / 20)) for i in range(1, 20)]
    left = [(-x, y) for x, y in reversed(right[:-1])]
    return [(-w, 0.85)] + top + right + left[:-1]


def heart_pts(s=0.5, n=80):
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        x = 16 * math.sin(a) ** 3
        y = 13 * math.cos(a) - 5 * math.cos(2 * a) - 2 * math.cos(3 * a) - math.cos(4 * a)
        pts.append((x / 17 * s, y / 17 * s))
    return pts


def shield_heart(loc, scale=1.0):
    objs = []
    objs.append(extruded([(x * 1.15, y * 1.15) for x, y in shield_pts()], 0.35, plastic(SKY, 0.2), loc=loc, name='shield_rim'))
    objs.append(extruded(shield_pts(), 0.5, plastic(NAVY2, 0.25), loc=(loc[0], loc[1] - 0.05, loc[2]), name='shield'))
    objs.append(extruded(heart_pts(0.62), 0.35, plastic(AMBER, 0.18, emit=0.12), loc=(loc[0], loc[1] - 0.35, loc[2] - 0.2), name='heart'))
    for o in objs:
        o.scale = (scale, scale, scale)
    return objs


sc = reset()
world((0.004, 0.012, 0.035), 1.0)
# chão de placas com pinos
navyM = plastic(NAVY, 0.3)
navy2M = plastic(NAVY2, 0.28)
plate(-14, -30, -0.4, 28, 40, navyM)
# parede de tijolos ao fundo (desfocada pela profundidade de campo)
for row in range(10):
    off = (row % 2) * 2
    for col in range(-8, 8):
        m = navy2M if (row + col) % 3 else plastic((0.03, 0.1, 0.26), 0.28)
        brick(col * 4 - off, 9, row * 1.2, 4, 2, m, studs=False)

fig = minifig('delegado', arm_r=70, head_turn=-12, loc=(-2.1, 0, 0), rot_z=16, scale=1.0)
shield_heart((2.3, 0.6, 2.4), scale=1.1)

studio(1.0)
area_light((4.5, -3, 3), 220, 2, (1.0, 0.75, 0.4), target=(2.3, 0.6, 2.4))  # brilho quente no escudo
camera((0.1, -24, 5.0), (0.1, 0, 2.3), lens=50, dof=2.8)
render('/home/user/ClaudeJF/video-lego/renders/style_test.png', 1080, 1920, transparent=False, samples=64)
print('OK')
