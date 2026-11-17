import { Component, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Vector3, type MeshStandardMaterial } from "three";
import {
  STATUS_META,
  type AgentStatus,
  type Department,
} from "../data/sampleRoster";

interface CityProps {
  departments: Department[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

interface BoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface BoundaryState {
  failed: boolean;
}

class CityErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const PINES: [number, number, number][] = [
  [-5.2, 0, -1.4],
  [-4.4, 0, 2.2],
  [5.1, 0, -1.6],
  [4.8, 0, 2.4],
  [-1.4, 0, -4.3],
  [1.6, 0, -4.2],
  [-5.4, 0, -3.6],
  [5.3, 0, -3.8],
];

function Pine({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.55, 6]} />
        <meshStandardMaterial color="#3d2c24" />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <coneGeometry args={[0.42, 1.05, 7]} />
        <meshStandardMaterial color="#1b3b34" />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.28, 0.75, 7]} />
        <meshStandardMaterial color="#246056" />
      </mesh>
    </group>
  );
}

function Windows({
  width,
  height,
  depth,
}: {
  width: number;
  height: number;
  depth: number;
}) {
  const spots: [number, number, number][] = [];
  const cols = Math.max(1, Math.floor(width / 0.62));
  const rows = Math.max(1, Math.floor(height / 0.72));
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const y = 0.42 + row * 0.62;
      if (y > height - 0.28) continue;
      const x = -width / 2 + ((col + 0.5) * width) / cols;
      spots.push([x, y, depth / 2 + 0.03]);
    }
  }
  return (
    <group>
      {spots.map((position) => (
        <mesh key={position.join(":")} position={position}>
          <boxGeometry args={[0.18, 0.26, 0.04]} />
          <meshStandardMaterial color="#f6e2b8" emissive="#e7b15a" emissiveIntensity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Building({
  department,
  selected,
  reduceMotion,
  onSelect,
}: {
  department: Department;
  selected: boolean;
  reduceMotion: boolean;
  onSelect: (id: string) => void;
}) {
  const material = useRef<MeshStandardMaterial>(null);
  const statusColor = STATUS_META[department.status].color;
  const [width, depth] = department.footprint;

  useFrame(({ clock }) => {
    const mat = material.current;
    if (!mat) return;
    const base = department.status === "idle" ? 0.08 : 0.28;
    if (reduceMotion || department.status !== "waiting") {
      mat.emissiveIntensity = selected ? base + 0.45 : base;
      return;
    }
    const pulse = 0.2 + Math.sin(clock.elapsedTime * 2.4 + department.position[0]) * 0.12;
    mat.emissiveIntensity = selected ? pulse + 0.4 : pulse;
  });

  return (
    <group
      position={department.position}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(department.id);
      }}
    >
      <mesh position={[0, department.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, department.height, depth]} />
        <meshStandardMaterial
          ref={material}
          color={department.body}
          emissive={statusColor}
          emissiveIntensity={0.2}
          roughness={0.82}
        />
      </mesh>
      {department.height > 2.6 ? (
        <mesh position={[0, department.height + 0.45, 0]} castShadow>
          <coneGeometry args={[width * 0.62, 0.95, 4]} />
          <meshStandardMaterial color="#1a1422" />
        </mesh>
      ) : (
        <mesh position={[0, department.height + 0.16, 0]} castShadow>
          <boxGeometry args={[width + 0.18, 0.28, depth + 0.18]} />
          <meshStandardMaterial color="#1a1422" />
        </mesh>
      )}
      <Windows width={width} height={department.height} depth={depth} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[Math.max(width, depth) * 0.62, Math.max(width, depth) * 0.74, 28]} />
        <meshBasicMaterial
          color={statusColor}
          transparent
          opacity={selected ? 0.95 : department.status === "idle" ? 0.28 : 0.7}
        />
      </mesh>
      <pointLight
        position={[0, department.height + 0.3, depth]}
        color={statusColor}
        intensity={department.status === "idle" ? 0.25 : 1.15}
        distance={5.5}
      />
    </group>
  );
}

function LabelProjector({
  departments,
  labelRefs,
}: {
  departments: Department[];
  labelRefs: RefObject<Record<string, HTMLButtonElement | null>>;
}) {
  const { camera, size } = useThree();
  const point = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const refs = labelRefs.current;
    if (!refs) return;
    for (const department of departments) {
      const label = refs[department.id];
      if (!label) continue;
      point.set(department.position[0], department.height + 0.35, department.position[2]);
      point.project(camera);
      const x = (point.x * 0.5 + 0.5) * size.width;
      const y = (-point.y * 0.5 + 0.5) * size.height;
      const behind = point.z < 0 || point.z > 1;
      const nudgeX = department.id === "review-requests" ? 18 : 0;
      label.hidden = behind;
      label.style.transform = `translate(${x + nudgeX}px, ${y}px) translate(-50%, -130%)`;
      label.dataset.placed = "true";
    }
  });

  return null;
}

function LotScene({
  departments,
  selectedId,
  onSelect,
  reduceMotion,
}: CityProps & { reduceMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#100d16"]} />
      <fog attach="fog" args={["#100d16", 14, 32]} />
      <ambientLight intensity={0.22} />
      <hemisphereLight args={["#243044", "#2a2118", 0.4]} />
      <directionalLight
        position={[-8, 10, -6]}
        intensity={0.9}
        color="#d5e2ff"
        castShadow
      />
      <mesh position={[-7.2, 7.2, -9]}>
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshBasicMaterial color="#f4e6c4" />
      </mesh>
      <Stars radius={42} depth={18} count={500} factor={2.4} saturation={0} fade speed={0.25} />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          onSelect(null);
        }}
      >
        <circleGeometry args={[12, 48]} />
        <meshStandardMaterial color="#171d22" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1.15]}>
        <planeGeometry args={[9.5, 0.62]} />
        <meshStandardMaterial color="#2a241c" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.6, 0.025, 1.15]}>
        <planeGeometry args={[0.55, 0.08]} />
        <meshStandardMaterial color="#c4a36a" emissive="#c4a36a" emissiveIntensity={0.2} />
      </mesh>
      {PINES.map((position) => (
        <Pine key={position.join(":")} position={position} />
      ))}
      {departments.map((department) => (
        <Building
          key={department.id}
          department={department}
          selected={department.id === selectedId}
          reduceMotion={reduceMotion}
          onSelect={(id) => onSelect(id)}
        />
      ))}
      <OrbitControls
        makeDefault
        enablePan={false}
        maxPolarAngle={Math.PI / 2.12}
        minPolarAngle={0.4}
        minDistance={7}
        maxDistance={16}
        target={[0, 1.05, 0.2]}
      />
    </>
  );
}

export function LotFallback({ departments, selectedId, onSelect }: CityProps) {
  return (
    <div className="lot-fallback" role="group" aria-label="Flat lot of sample departments">
      {departments.map((department) => {
        const meta = STATUS_META[department.status];
        const selected = department.id === selectedId;
        return (
          <button
            key={department.id}
            type="button"
            data-slot={department.id}
            className={selected ? "lot-building is-selected" : "lot-building"}
            style={{ borderColor: meta.color }}
            aria-pressed={selected}
            onClick={() => onSelect(selected ? null : department.id)}
          >
            <span className="lot-kicker">{department.building}</span>
            <span className="lot-name">{department.name}</span>
            <span className="lot-status" style={{ color: meta.color }}>
              {meta.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function NightCity({ departments, selectedId, onSelect }: CityProps) {
  const [webgl] = useState(hasWebGL);
  const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const fallback = (
    <LotFallback departments={departments} selectedId={selectedId} onSelect={onSelect} />
  );

  return (
    <section className="panel city-panel" aria-labelledby="city-title">
      <div className="panel-head">
        <h2 id="city-title">Night-shift city</h2>
        <p>Hollow Pines departments, glowing by sample status. Drag to look around the lot.</p>
      </div>
      <div className="city-stage">
        {webgl ? (
          <CityErrorBoundary fallback={fallback}>
            <Canvas
              shadows
              camera={{ position: [8.4, 6.1, 9.6], fov: 38 }}
              dpr={[1, 1.6]}
              gl={{ antialias: true, alpha: false }}
              aria-label="Three-dimensional lot of Hollow Pines departments"
            >
              <LotScene
                departments={departments}
                selectedId={selectedId}
                onSelect={onSelect}
                reduceMotion={reduceMotion}
              />
              <LabelProjector departments={departments} labelRefs={labelRefs} />
            </Canvas>
          </CityErrorBoundary>
        ) : (
          fallback
        )}
        {webgl ? (
          <div className="label-layer">
            {departments.map((department) => {
              const selected = department.id === selectedId;
              return (
                <button
                  key={department.id}
                  type="button"
                  ref={(node) => {
                    labelRefs.current[department.id] = node;
                  }}
                  className={selected ? "pin is-selected" : "pin"}
                  aria-pressed={selected}
                  onClick={() => onSelect(department.id)}
                >
                  {department.building}
                </button>
              );
            })}
          </div>
        ) : null}
        <ul className="legend">
          {(Object.keys(STATUS_META) as AgentStatus[]).map((status) => (
            <li key={status}>
              <span className="swatch" style={{ background: STATUS_META[status].color }} />
              {STATUS_META[status].label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
