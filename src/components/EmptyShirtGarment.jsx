import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { getShirtDecalTexture } from '../utils/shirtDesigns';

const smooth = THREE.MathUtils.smoothstep;
const clamp = THREE.MathUtils.clamp;

/**
 * Converts the body-shaped T_Shirt_male mesh into an EMPTY shirt hanging on a hanger:
 *  - torso collapses flat (no body inside), sides pinch & cave in
 *  - sleeves droop down from the shoulders under gravity
 *  - hem flares slightly, vertical drape folds hang from the hanger shoulders
 * Returns rest geometry + per-vertex weights used by the soft-body animation.
 */
function buildEmptyShirtGeometry(srcGeometry) {
  const geo = srcGeometry.clone();
  geo.computeBoundingBox();
  const pos = geo.attributes.position;
  const arr = pos.array;
  const count = pos.count;

  // --- Detect which side is the FRONT (front neckline dips lower than the back) ---
  const bb0 = geo.boundingBox;
  const cx0 = (bb0.min.x + bb0.max.x) / 2;
  const cz0 = (bb0.min.z + bb0.max.z) / 2;
  let frontTop = -Infinity;
  let backTop = -Infinity;
  for (let i = 0; i < count; i++) {
    const x = arr[i * 3];
    const y = arr[i * 3 + 1];
    const z = arr[i * 3 + 2];
    if (Math.abs(x - cx0) < 0.03) {
      if (z > cz0) frontTop = Math.max(frontTop, y);
      else backTop = Math.max(backTop, y);
    }
  }
  if (frontTop > backTop) {
    // front is facing -Z: rotate 180deg around Y so the print side faces the camera
    for (let i = 0; i < count; i++) {
      arr[i * 3] = 2 * cx0 - arr[i * 3];
      arr[i * 3 + 2] = 2 * cz0 - arr[i * 3 + 2];
    }
  }

  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const minY = bb.min.y;
  const maxY = bb.max.y;
  const h = maxY - minY;
  const cx = (bb.min.x + bb.max.x) / 2;
  const cz = (bb.min.z + bb.max.z) / 2;
  const halfW = (bb.max.x - bb.min.x) / 2;

  // --- Measure the garment so the reshape adapts to the source model's pose ---
  // Torso half-width at the hem and just below the armpits (to relax the tight mannequin waist)
  let torsoHalf = 0;
  let chestHalf = 0;
  for (let i = 0; i < count; i++) {
    const ax = Math.abs(arr[i * 3] - cx);
    const y = arr[i * 3 + 1];
    if (y < minY + h * 0.15) torsoHalf = Math.max(torsoHalf, ax);
    if (y > minY + h * 0.56 && y < minY + h * 0.66) chestHalf = Math.max(chestHalf, ax);
  }
  if (torsoHalf <= 0) torsoHalf = halfW * 0.62;
  if (chestHalf <= 0) chestHalf = torsoHalf * 1.05;

  // Measure min torso half-width at each vertical slice in the waist so we can relax the tight pinch
  const slices = 16;
  const sliceMaxX = new Float32Array(slices);
  for (let i = 0; i < count; i++) {
    const y = arr[i * 3 + 1];
    const down = clamp((maxY - y) / h, 0, 1);
    const ax = Math.abs(arr[i * 3] - cx);
    if (down > 0.32 && ax < torsoHalf * 1.12) {
      const idx = Math.min(slices - 1, Math.floor(down * slices));
      if (ax > sliceMaxX[idx]) sliceMaxX[idx] = ax;
    }
  }

  const shoulderY = maxY - h * 0.13;
  const pivotX = torsoHalf * 0.98;

  // Current sleeve angle (centroid of right sleeve vs shoulder pivot)
  let sx = 0;
  let sy = 0;
  let sn = 0;
  for (let i = 0; i < count; i++) {
    const x = arr[i * 3] - cx;
    const y = arr[i * 3 + 1];
    if (x > torsoHalf * 1.08 && y > minY + h * 0.35) {
      sx += x;
      sy += y;
      sn++;
    }
  }
  const currentAngle = sn > 0 ? Math.atan2(sy / sn - shoulderY, sx / sn - pivotX) : -0.5;
  // Natural relaxed tee sleeves hanging ~47deg below horizontal (not sticking out stiffly)
  const sleeveDelta = clamp(-0.82 - currentAngle, -0.55, 0.45);

  const weightDown = new Float32Array(count); // 0 at collar -> 1 at hem
  const weightSide = new Float32Array(count); // 0 center -> 1 at side seams / sleeves
  const weightSleeve = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    let x = arr[i * 3] - cx;
    let y = arr[i * 3 + 1];
    let z = arr[i * 3 + 2] - cz;

    const down = clamp((maxY - y) / h, 0, 1);
    const ax = Math.abs(x);
    const sgn = Math.sign(x) || 1;

    // 1) Smooth shoulder-to-sleeve drape (wide transition so there is no kink at the armpit)
    const sleeve = smooth(ax, torsoHalf * 0.88, torsoHalf * 1.18);
    if (sleeve > 0) {
      const lx = ax - pivotX;
      const ly = y - shoulderY;
      const ang = sleeveDelta * sleeve;
      const rx = lx * Math.cos(ang) - ly * Math.sin(ang);
      const ry = lx * Math.sin(ang) + ly * Math.cos(ang);
      x = sgn * (pivotX + rx);
      y = shoulderY + ry - 0.012 * sleeve * sleeve;
    }

    // 2) Smooth, continuous waist relaxation so the t-shirt keeps crisp, normal edges
    const torsoMask = 1 - smooth(Math.abs(x), torsoHalf * 0.92, torsoHalf * 1.15);
    const waist = Math.sin(Math.PI * clamp((down - 0.30) / 0.65, 0, 1));
    x *= 1 + 0.14 * waist * torsoMask;

    // 3) Clean uniform empty-shirt thickness (preserves crisp natural side seams & edges)
    const side = clamp(Math.abs(x) / (torsoHalf * 1.4), 0, 1);
    z *= 0.42;

    // 4) Gentle vertical fabric drape folds (subtle, no sharp side kinks)
    const fold =
      Math.sin(x * 22 + 0.8) * 0.003 * down * (1 - 0.5 * side) +
      Math.sin(x * 10 - y * 3.5) * 0.0025 * down;
    z += fold * (z >= 0 ? 1 : -0.6);

    arr[i * 3] = x + cx;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z + cz;

    weightDown[i] = down;
    weightSide[i] = side;
    weightSleeve[i] = sleeve;
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.computeBoundingBox();

  // Rest pose copy used for both animation and print projection
  const restPos = new Float32Array(arr);
  geo.setAttribute('restPosition', new THREE.BufferAttribute(new Float32Array(arr), 3));

  return {
    geo,
    restPos,
    weightDown,
    weightSide,
    weightSleeve,
    info: { cx, cz, maxY, h, halfW, bbox: geo.boundingBox.clone() },
  };
}

/** Fabric material that paints the shirt print in the shader so it bends with every wrinkle. */
function createPrintedFabricMaterial(color, printTex, info) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.92,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  const printSize = info.halfW * 0.95;
  const uniforms = {
    uPrintMap: { value: printTex },
    uPrintCenter: { value: new THREE.Vector2(info.cx, info.maxY - info.h * 0.36) },
    uPrintSize: { value: printSize },
    uCenterZ: { value: info.cz },
  };

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         attribute vec3 restPosition;
         uniform vec2 uPrintCenter;
         uniform float uPrintSize;
         uniform float uCenterZ;
         varying vec2 vPrintUv;
         varying float vPrintMask;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vPrintUv = (restPosition.xy - uPrintCenter) / uPrintSize + 0.5;
         vPrintMask = smoothstep(uCenterZ, uCenterZ + 0.004, restPosition.z);`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform sampler2D uPrintMap;
         varying vec2 vPrintUv;
         varying float vPrintMask;`
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
         vec2 pUv = vPrintUv;
         float inBounds = step(0.0, pUv.x) * step(pUv.x, 1.0) * step(0.0, pUv.y) * step(pUv.y, 1.0);
         vec4 printCol = texture2D(uPrintMap, clamp(pUv, 0.0, 1.0));
         float printA = printCol.a * inBounds * vPrintMask * (gl_FrontFacing ? 1.0 : 0.0);
         // screen-print ink sits slightly flatter/brighter than the cotton
         diffuseColor.rgb = mix(diffuseColor.rgb, printCol.rgb * 0.94, printA);`
      );
  };
  mat.customProgramCacheKey = () => 'kc-printed-fabric-v1';
  return mat;
}

export default function EmptyShirtGarment({ shirtColor, designId, offset, dragProgress, isMobile = false, onClick, Hanger }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const { nodes } = useGLTF('/models/shirt_baked.glb');

  // Soft-body spring state (hem lag + side flaps)
  const sim = useRef({
    prevX: 0,
    prevVel: 0,
    swing: 0, // lateral hem lag
    swingV: 0,
    flap: 0, // in/out flutter of the loose sides
    flapV: 0,
    settled: false,
  });

  const shirt = useMemo(() => buildEmptyShirtGeometry(nodes.T_Shirt_male.geometry), [nodes]);
  const printTex = useMemo(() => getShirtDecalTexture(designId), [designId]);
  const material = useMemo(
    () => createPrintedFabricMaterial(shirtColor, printTex, shirt.info),
    [shirtColor, printTex, shirt]
  );

  const { normScale, normOffset } = useMemo(() => {
    const { bbox, cx, cz } = shirt.info;
    const s = 1.5 / (bbox.max.y - bbox.min.y);
    const cy = (bbox.max.y + bbox.min.y) / 2;
    return { normScale: s, normOffset: [-cx * s, -cy * s, -cz * s] };
  }, [shirt]);

  const isActive = offset === 0;
  const isVisible = Math.abs(offset) <= 2;

  // On mobile: centered at 0 above the description; on desktop: shifted left (-1.35) beside the card
  const centerX = isMobile ? 0 : -1.35;
  let targetX = isActive ? centerX + dragProgress * 1.15 : 0;
  const targetZ = isActive ? 0.45 : -0.35 - Math.abs(offset) * 0.25;
  const targetScale = isActive ? (isMobile ? 1.24 : 1.16) : 0.84;
  let targetRotY = 0;

  if (offset < 0) {
    targetX = centerX - 0.95 + (offset + 1) * 0.5;
    targetRotY = 0.45;
  } else if (offset > 0) {
    targetX = centerX + 0.97 + (offset - 1) * 0.5;
    targetRotY = -0.45;
  }

  useFrame((state, delta) => {
    const g = groupRef.current;
    const mesh = meshRef.current;
    if (!g || !mesh) return;

    const dt = Math.min(delta, 0.04);
    const lerpSpeed = Math.min(1, dt * 7.5);
    const S = sim.current;

    const nextX = THREE.MathUtils.lerp(g.position.x, targetX, lerpSpeed);
    const vel = (nextX - S.prevX) / Math.max(dt, 0.008);
    const acc = (vel - S.prevVel) / Math.max(dt, 0.008);
    S.prevX = nextX;
    S.prevVel = vel;

    g.position.x = nextX;
    g.position.z = THREE.MathUtils.lerp(g.position.z, targetZ, lerpSpeed);
    const sc = THREE.MathUtils.lerp(g.scale.x, targetScale, lerpSpeed);
    g.scale.set(sc, sc, sc);

    // Hanger pendulum on the hook
    const tiltZ = clamp(-vel * 0.025 - S.swing * 0.35, -0.2, 0.2);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, tiltZ, lerpSpeed);

    const t = state.clock.elapsedTime;
    const desiredRotY = isActive
      ? clamp(dragProgress * 0.55, -0.6, 0.6) + Math.sin(t * 0.6) * 0.04
      : targetRotY;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, desiredRotY, lerpSpeed);

    // --- Underdamped springs: fabric lags behind, overshoots, then settles softly ---
    const kSwing = 38;
    const cSwing = 4.2;
    S.swingV += (-kSwing * S.swing - cSwing * S.swingV - acc * 0.0042) * dt;
    S.swing += S.swingV * dt;
    S.swing = clamp(S.swing, -0.09, 0.09);

    const kFlap = 70;
    const cFlap = 5.5;
    const flapDrive = Math.abs(vel) * 0.02 + Math.abs(dragProgress) * (isActive ? 0.012 : 0);
    S.flapV += (-kFlap * S.flap - cFlap * S.flapV + flapDrive * 60) * dt;
    S.flap += S.flapV * dt;
    S.flap = clamp(S.flap, -0.05, 0.05);

    const energy = Math.abs(S.swing) + Math.abs(S.swingV) * 0.1 + Math.abs(S.flap) + Math.abs(S.flapV) * 0.1;
    const idle = isActive ? 0.0025 : 0; // tiny breathing sway on the featured shirt
    if (energy < 0.0006 && !idle) {
      if (S.settled) return;
      S.settled = true;
    } else {
      S.settled = false;
    }

    // --- Per-vertex soft-body deformation of the empty shirt ---
    const posAttr = mesh.geometry.attributes.position;
    const arr = posAttr.array;
    const rest = shirt.restPos;
    const wD = shirt.weightDown;
    const wS = shirt.weightSide;
    const wSl = shirt.weightSleeve;
    const { cx, cz } = shirt.info;

    for (let i = 0, n = wD.length; i < n; i++) {
      const i3 = i * 3;
      const rx = rest[i3];
      const ry = rest[i3 + 1];
      const rz = rest[i3 + 2];
      const d = wD[i];
      const s = wS[i];
      const sl = wSl[i];

      const hang = d * d * (1.6 - 0.6 * d); // collar pinned, hem free
      const looseSide = s * s * (0.4 + d * 0.6); // side seams & sleeves flap more than the center

      // lateral lag: hem trails behind the hanger, travelling wave up the fabric
      const wave = Math.sin(t * 7.5 - d * 4.2 + rx * 9);
      const lagX = S.swing * hang * 1.4 + wave * S.flap * 0.18 * hang;

      // loose sides & sleeves billow in/out independently (empty fabric, no body inside)
      const billow =
        Math.sin(t * 9.5 + ry * 14 + (rx - cx) * 6) * (S.flap * 0.9 + idle) * looseSide +
        Math.sin(t * 5.2 + rx * 11) * (S.flap * 0.5 + idle * 0.6) * hang;

      // sleeves swing a bit behind like empty tubes
      const sleeveSwing = S.swing * sl * 0.6;

      arr[i3] = rx + lagX + sleeveSwing;
      arr[i3 + 1] = ry + Math.abs(lagX) * -0.08; // fabric lifts slightly as it swings
      arr[i3 + 2] = rz + billow * (rz >= cz ? 1 : 0.7);
    }

    posAttr.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  });

  return (
    <group
      ref={groupRef}
      visible={isVisible}
      position={[targetX, 0.05, targetZ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <mesh
        ref={meshRef}
        geometry={shirt.geo}
        material={material}
        scale={normScale}
        position={normOffset}
        castShadow
        receiveShadow
      />
    </group>
  );
}
