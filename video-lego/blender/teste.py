import bpy, math, time
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 48; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 50
def plastic(name, rgb, rough=0.25):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    return m
def box(loc, size, mat, bevel=0.04):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.scale = [s/2 for s in size]
    bpy.ops.object.transform_apply(scale=True); mod = o.modifiers.new('b', 'BEVEL'); mod.width = bevel; mod.segments = 3
    o.data.materials.append(mat); bpy.ops.object.shade_smooth(); return o
def cyl(loc, r, d, mat):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc, vertices=48); o = bpy.context.object
    mod = o.modifiers.new('b', 'BEVEL'); mod.width = min(0.03, d/4); mod.segments = 3; o.data.materials.append(mat); bpy.ops.object.shade_smooth(); return o
blue = plastic('blue', (0.05, 0.15, 0.45)); yellow = plastic('yel', (0.95, 0.75, 0.2)); white = plastic('white', (0.9, 0.9, 0.9))
# placa base com pinos
box((0, 0, -0.1), (8, 8, 0.2), blue)
for i in range(-3, 4):
    for j in range(-3, 4):
        cyl((i, j, 0.08), 0.3, 0.17, blue)
# tijolo 2x4
box((0, 0, 0.6), (4, 2, 1.0), yellow)
for i in (-1.5, -0.5, 0.5, 1.5):
    for j in (-0.5, 0.5): cyl((i, j, 1.18), 0.3, 0.17, yellow)
bpy.ops.object.light_add(type='AREA', location=(4, -4, 8)); l = bpy.context.object; l.data.energy = 2000; l.data.size = 5
bpy.ops.object.light_add(type='AREA', location=(-5, 3, 4)); l = bpy.context.object; l.data.energy = 600; l.data.size = 6
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.02, 0.05, 0.12, 1)
bpy.ops.object.camera_add(location=(7, -9, 7), rotation=(math.radians(60), 0, math.radians(38))); sc.camera = bpy.context.object
sc.render.filepath = '/home/user/ClaudeJF/video-lego/renders/teste.png'
t = time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SECONDS', round(time.time() - t, 1))
