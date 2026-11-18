import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('public', 'models');
fs.mkdirSync(OUT_DIR, { recursive: true });

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const n = parseInt(clean, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
}

// Build a clean 3D box primitive with optional X-taper & rotation
function createBoxGeometry({ width, height, depth, tx = 0, ty = 0, tz = 0, rotZ = 0, taperTop = 1 }) {
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;

  const corners = [
    [-hw * taperTop, hh, -hd],
    [hw * taperTop, hh, -hd],
    [hw, -hh, -hd],
    [-hw, -hh, -hd],
    [-hw * taperTop, hh, hd],
    [hw * taperTop, hh, hd],
    [hw, -hh, hd],
    [-hw, -hh, hd],
  ];

  const cos = Math.cos(rotZ);
  const sin = Math.sin(rotZ);

  const transformed = corners.map(([x, y, z]) => [
    x * cos - y * sin + tx,
    x * sin + y * cos + ty,
    z + tz,
  ]);

  // 6 faces, 4 vertices each = 24 vertices, 36 indices
  const faces = [
    { idx: [4, 5, 6, 7], n: [0, 0, 1] }, // front
    { idx: [1, 0, 3, 2], n: [0, 0, -1] }, // back
    { idx: [0, 1, 5, 4], n: [0, 1, 0] }, // top
    { idx: [3, 2, 6, 7], n: [0, -1, 0] }, // bottom (flipped winding below)
    { idx: [1, 2, 6, 5], n: [1, 0, 0] }, // right
    { idx: [0, 4, 7, 3], n: [-1, 0, 0] }, // left
  ];

  const positions = [];
  const normals = [];
  const indices = [];

  faces.forEach((f, faceIdx) => {
    const base = faceIdx * 4;
    const rn = [
      f.n[0] * cos - f.n[1] * sin,
      f.n[0] * sin + f.n[1] * cos,
      f.n[2],
    ];
    f.idx.forEach((cIdx) => {
      positions.push(...transformed[cIdx]);
      normals.push(...rn);
    });
    if (faceIdx === 3) {
      indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
    } else {
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
  });

  return { positions, normals, indices };
}

function mergeParts(parts) {
  const positions = [];
  const normals = [];
  const indices = [];
  let vertexOffset = 0;

  for (const p of parts) {
    positions.push(...p.positions);
    normals.push(...p.normals);
    for (const idx of p.indices) {
      indices.push(idx + vertexOffset);
    }
    vertexOffset += p.positions.length / 3;
  }
  return { positions, normals, indices };
}

function buildGlb(meshesWithMaterials) {
  const bufferChunks = [];
  const bufferViews = [];
  const accessors = [];
  const materials = [];
  const meshes = [];
  const nodes = [];

  let byteOffset = 0;

  function appendData(typedArray, target) {
    const bytes = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const pad = (4 - (bytes.byteLength % 4)) % 4;
    const chunk = new Uint8Array(bytes.byteLength + pad);
    chunk.set(bytes);
    bufferChunks.push(chunk);

    const viewIndex = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: bytes.byteLength,
      target,
    });
    byteOffset += chunk.byteLength;
    return viewIndex;
  }

  meshesWithMaterials.forEach((item, idx) => {
    const posArr = new Float32Array(item.geometry.positions);
    const normArr = new Float32Array(item.geometry.normals);
    const idxArr = new Uint16Array(item.geometry.indices);

    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < posArr.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        if (posArr[i + k] < min[k]) min[k] = posArr[i + k];
        if (posArr[i + k] > max[k]) max[k] = posArr[i + k];
      }
    }

    const posView = appendData(posArr, 34962);
    const normView = appendData(normArr, 34962);
    const idxView = appendData(idxArr, 34963);

    const posAccessor = accessors.length;
    accessors.push({
      bufferView: posView,
      componentType: 5126,
      count: posArr.length / 3,
      type: 'VEC3',
      min,
      max,
    });

    const normAccessor = accessors.length;
    accessors.push({
      bufferView: normView,
      componentType: 5126,
      count: normArr.length / 3,
      type: 'VEC3',
    });

    const idxAccessor = accessors.length;
    accessors.push({
      bufferView: idxView,
      componentType: 5123,
      count: idxArr.length,
      type: 'SCALAR',
    });

    materials.push({
      pbrMetallicRoughness: {
        baseColorFactor: item.color,
        metallicFactor: item.metallic ?? 0.0,
        roughnessFactor: item.roughness ?? 0.8,
      },
      doubleSided: true,
    });

    meshes.push({
      primitives: [
        {
          attributes: { POSITION: posAccessor, NORMAL: normAccessor },
          indices: idxAccessor,
          material: idx,
        },
      ],
    });

    nodes.push({ mesh: idx, name: item.name });
  });

  const gltf = {
    asset: { version: '2.0', generator: 'KampusCart-GLB-Generator' },
    scene: 0,
    scenes: [{ nodes: nodes.map((_, i) => i) }],
    nodes,
    meshes,
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: byteOffset }],
  };

  const jsonStr = JSON.stringify(gltf);
  const jsonBytes = Buffer.from(jsonStr, 'utf8');
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
  const jsonChunkLen = jsonBytes.length + jsonPad;

  const binChunk = Buffer.concat(bufferChunks.map((u) => Buffer.from(u)));
  const totalLen = 12 + 8 + jsonChunkLen + 8 + binChunk.length;

  const out = Buffer.alloc(totalLen);
  out.writeUInt32LE(0x46546c67, 0); // 'glTF'
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(totalLen, 8);

  // JSON chunk
  out.writeUInt32LE(jsonChunkLen, 12);
  out.writeUInt32LE(0x4e4f534a, 16); // 'JSON'
  jsonBytes.copy(out, 20);
  for (let i = 0; i < jsonPad; i++) out[20 + jsonBytes.length + i] = 0x20;

  // BIN chunk
  const binOffset = 20 + jsonChunkLen;
  out.writeUInt32LE(binChunk.length, binOffset);
  out.writeUInt32LE(0x004e4942, binOffset + 4); // 'BIN\0'
  binChunk.copy(out, binOffset + 8);

  return out;
}

function createGarmentModel({ fileName, mainHex, accentHex, type }) {
  const mainColor = hexToRgb(mainHex);
  const accentColor = hexToRgb(accentHex);
  const woodColor = hexToRgb('#b47b44');
  const chromeColor = hexToRgb('#e2e8f0');

  // Hook & wooden hanger centered at y=0 (pivot at top of hook)
  const hook = mergeParts([
    createBoxGeometry({ width: 0.035, height: 0.14, depth: 0.035, ty: -0.07 }),
    createBoxGeometry({ width: 0.09, height: 0.03, depth: 0.035, tx: 0.03, ty: -0.01 }),
  ]);

  const hanger = mergeParts([
    createBoxGeometry({ width: 0.56, height: 0.045, depth: 0.04, tx: -0.24, ty: -0.22, rotZ: 0.28 }),
    createBoxGeometry({ width: 0.56, height: 0.045, depth: 0.04, tx: 0.24, ty: -0.22, rotZ: -0.28 }),
    createBoxGeometry({ width: 0.88, height: 0.03, depth: 0.03, tx: 0, ty: -0.31 }),
  ]);

  // Garment torso + angled sleeves
  const garmentParts = [
    createBoxGeometry({ width: 0.92, height: 1.15, depth: 0.24, ty: -0.88, taperTop: 1.06 }),
    createBoxGeometry({ width: 0.28, height: 0.82, depth: 0.2, tx: -0.58, ty: -0.66, rotZ: -0.34 }),
    createBoxGeometry({ width: 0.28, height: 0.82, depth: 0.2, tx: 0.58, ty: -0.66, rotZ: 0.34 }),
  ];

  if (type === 'hoodie') {
    garmentParts.push(createBoxGeometry({ width: 0.42, height: 0.24, depth: 0.26, ty: -0.22 }));
  }

  const accentParts = [
    createBoxGeometry({ width: 0.46, height: 0.14, depth: 0.26, ty: -0.66 }),
  ];

  if (type === 'jacket') {
    accentParts.push(createBoxGeometry({ width: 0.06, height: 1.08, depth: 0.26, ty: -0.9 }));
  } else if (type === 'hoodie') {
    accentParts.push(createBoxGeometry({ width: 0.54, height: 0.24, depth: 0.27, ty: -1.16 }));
  }

  const glb = buildGlb([
    { name: 'Hook', geometry: hook, color: chromeColor, metallic: 0.9, roughness: 0.2 },
    { name: 'WoodenHanger', geometry: hanger, color: woodColor, metallic: 0.05, roughness: 0.55 },
    { name: 'GarmentBody', geometry: mergeParts(garmentParts), color: mainColor, metallic: 0.0, roughness: 0.85 },
    { name: 'GarmentAccent', geometry: mergeParts(accentParts), color: accentColor, metallic: 0.05, roughness: 0.65 },
  ]);

  fs.writeFileSync(path.join(OUT_DIR, fileName), glb);
  console.log(`Generated ${fileName} (${glb.length} bytes)`);
}

createGarmentModel({ fileName: 'hoodie.glb', mainHex: '#0b462d', accentHex: '#facc15', type: 'hoodie' });
createGarmentModel({ fileName: 'tee.glb', mainHex: '#ea580c', accentHex: '#fef3c7', type: 'tee' });
createGarmentModel({ fileName: 'jacket.glb', mainHex: '#1d4ed8', accentHex: '#f59e0b', type: 'jacket' });
