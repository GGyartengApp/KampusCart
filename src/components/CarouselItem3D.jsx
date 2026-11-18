import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Headphones3D({ color = '#e11d48' }) {
  return (
    <group scale={1.15}>
      {/* Padded Headband */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <torusGeometry args={[0.42, 0.045, 16, 48, Math.PI]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.27, 0]} castShadow>
        <torusGeometry args={[0.42, 0.052, 16, 36, Math.PI * 0.72]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>
      {/* Left & Right Earcups */}
      {[-0.43, 0.43].map((x, idx) => (
        <group key={x} position={[x, 0.04, 0]} rotation={[0, 0, idx === 0 ? 0.12 : -0.12]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.12, 32]} />
            <meshStandardMaterial color={color} metalness={0.35} roughness={0.35} />
          </mesh>
          <mesh position={[idx === 0 ? 0.065 : -0.065, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.145, 0.048, 16, 32]} />
            <meshStandardMaterial color="#1e293b" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function EarbudsCase3D({ color = '#0f172a' }) {
  return (
    <group scale={1.25} rotation={[0.18, 0, 0]}>
      {/* Charging Case Base */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.72, 0.42, 0.38]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Open Lid */}
      <mesh position={[0, 0.22, -0.16]} rotation={[-0.45, 0, 0]} castShadow>
        <boxGeometry args={[0.72, 0.26, 0.36]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Left & Right Earbuds */}
      {[-0.16, 0.16].map((x) => (
        <group key={x} position={[x, 0.16, 0.02]}>
          <mesh castShadow>
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.1, 0.04]} rotation={[0.25, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.018, 0.16, 12]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* LED Indicator */}
      <mesh position={[0, -0.05, 0.195]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

function LaptopSleeve3D({ color = '#475569' }) {
  return (
    <group scale={1.15} rotation={[0.1, -0.15, 0]}>
      {/* Felt Sleeve */}
      <mesh position={[0, -0.08, 0]} castShadow>
        <boxGeometry args={[0.96, 0.68, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.92} />
      </mesh>
      {/* Brushed Aluminum MacBook Peeking Out */}
      <mesh position={[0, 0.14, 0.005]} castShadow>
        <boxGeometry args={[0.88, 0.56, 0.045]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.22} />
      </mesh>
      {/* Magnetic Front Pocket */}
      <mesh position={[0, -0.16, 0.048]}>
        <boxGeometry args={[0.88, 0.32, 0.02]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
    </group>
  );
}

function JollofBowl3D() {
  return (
    <group scale={1.25} rotation={[0.25, 0, 0]}>
      {/* Insulated Bowl */}
      <mesh position={[0, -0.12, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.34, 0.36, 36]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.51, 0.025, 12, 36]} />
        <meshStandardMaterial color="#ea580c" roughness={0.4} />
      </mesh>
      {/* Smoky Jollof Rice Mound */}
      <mesh position={[0, 0.05, 0]} scale={[1, 0.42, 1]} castShadow>
        <sphereGeometry args={[0.47, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#dc4c18" roughness={0.85} />
      </mesh>
      {/* Grilled Chicken Drumsticks / Pieces */}
      <mesh position={[0.14, 0.18, 0.06]} rotation={[0.3, 0.4, 0.5]} castShadow>
        <capsuleGeometry args={[0.1, 0.18, 8, 16]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} />
      </mesh>
      <mesh position={[-0.16, 0.17, -0.05]} rotation={[-0.2, 0.2, -0.4]} castShadow>
        <capsuleGeometry args={[0.09, 0.16, 8, 16]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>
      {/* Fried Plantain Slices */}
      {[
        [-0.22, 0.16, 0.18],
        [-0.08, 0.17, 0.24],
        [0.06, 0.16, 0.23],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0.5, 0.2 * i, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.03, 16]} />
          <meshStandardMaterial color="#facc15" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function BobaDuo3D() {
  const cups = [
    { x: -0.26, z: 0.04, rotZ: 0.06, liquid: '#4ade80', label: '#16a34a' }, // Iced Matcha
    { x: 0.26, z: -0.04, rotZ: -0.06, liquid: '#d97706', label: '#78350f' }, // Brown Sugar Boba
  ];
  return (
    <group scale={1.15}>
      {cups.map((c, idx) => (
        <group key={idx} position={[c.x, -0.05, c.z]} rotation={[0.08, 0, c.rotZ]}>
          {/* Cup Body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.21, 0.15, 0.66, 28]} />
            <meshStandardMaterial color={c.liquid} roughness={0.25} transparent opacity={0.9} />
          </mesh>
          {/* Tapioca Pearls Band at Bottom */}
          <mesh position={[0, -0.24, 0]}>
            <cylinderGeometry args={[0.165, 0.148, 0.16, 24]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.4} />
          </mesh>
          {/* Dome Lid */}
          <mesh position={[0, 0.34, 0]}>
            <sphereGeometry args={[0.21, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} transparent opacity={0.7} />
          </mesh>
          {/* Wide Boba Straw */}
          <mesh position={[0.04, 0.48, 0]} rotation={[0, 0, -0.14]}>
            <cylinderGeometry args={[0.022, 0.022, 0.42, 16]} />
            <meshStandardMaterial color={c.label} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function CarouselItem3D({ modelType, color, offset, dragProgress, isMobile = false, onClick }) {
  const groupRef = useRef();

  const isActive = offset === 0;
  const isVisible = Math.abs(offset) <= 2;

  const centerX = isMobile ? 0 : -1.35;
  let targetX = isActive ? centerX + dragProgress * 1.15 : 0;
  const targetZ = isActive ? 0.45 : -0.35 - Math.abs(offset) * 0.25;
  const targetScale = isActive ? (isMobile ? 1.15 : 1.1) : 0.78;
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
    if (!g) return;
    const dt = Math.min(delta, 0.04);
    const lerpSpeed = Math.min(1, dt * 7.5);
    const t = state.clock.elapsedTime;

    g.position.x = THREE.MathUtils.lerp(g.position.x, targetX, lerpSpeed);
    g.position.z = THREE.MathUtils.lerp(g.position.z, targetZ, lerpSpeed);
    const bob = isActive ? Math.sin(t * 1.8) * 0.035 : 0;
    g.position.y = THREE.MathUtils.lerp(g.position.y, bob, lerpSpeed);

    const sc = THREE.MathUtils.lerp(g.scale.x, targetScale, lerpSpeed);
    g.scale.set(sc, sc, sc);

    const desiredRotY = isActive
      ? THREE.MathUtils.clamp(dragProgress * 0.7, -0.8, 0.8) + Math.sin(t * 0.8) * 0.22
      : targetRotY;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, desiredRotY, lerpSpeed);
  });

  return (
    <group
      ref={groupRef}
      visible={isVisible}
      position={[targetX, 0, targetZ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {modelType === 'headphones' && <Headphones3D color={color} />}
      {modelType === 'earbuds' && <EarbudsCase3D color={color} />}
      {modelType === 'laptop' && <LaptopSleeve3D color={color} />}
      {modelType === 'jollof' && <JollofBowl3D />}
      {modelType === 'boba' && <BobaDuo3D />}
    </group>
  );
}
