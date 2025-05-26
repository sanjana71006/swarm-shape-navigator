
import { useRef, useEffect, useState } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import type { FormationType, ColorMode } from '@/pages/Index';

// Extend the JSX namespace to include Three.js elements
extend(THREE);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      pointLight: any;
      gridHelper: any;
    }
  }
}

interface DroneSwarmProps {
  formation: FormationType;
  isAnimating: boolean;
  colorMode: ColorMode;
  targetPosition: number[];
  swarmSize: number;
  animationSpeed: number;
  formationSize: number;
}

interface DroneData {
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  id: number;
}

export const DroneSwarm = ({ 
  formation, 
  isAnimating, 
  colorMode, 
  targetPosition, 
  swarmSize, 
  animationSpeed, 
  formationSize 
}: DroneSwarmProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [drones, setDrones] = useState<DroneData[]>([]);
  const timeRef = useRef(0);

  // Initialize drones when swarmSize changes
  useEffect(() => {
    const initialDrones: DroneData[] = [];
    for (let i = 0; i < swarmSize; i++) {
      initialDrones.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        targetPosition: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        id: i,
      });
    }
    setDrones(initialDrones);
  }, [swarmSize]);

  // Formation calculation functions
  const getFormationPositions = (type: FormationType): THREE.Vector3[] => {
    const positions: THREE.Vector3[] = [];
    const offset = new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]);
    const size = formationSize;

    switch (type) {
      case 'line':
        for (let i = 0; i < swarmSize; i++) {
          positions.push(new THREE.Vector3(i * 0.8 - (swarmSize * 0.8) / 2, 0, 0).add(offset));
        }
        break;

      case 'circle':
        for (let i = 0; i < swarmSize; i++) {
          const angle = (i / swarmSize) * Math.PI * 2;
          positions.push(new THREE.Vector3(
            Math.cos(angle) * size,
            0,
            Math.sin(angle) * size
          ).add(offset));
        }
        break;

      case 'square':
        const sideLength = Math.ceil(Math.sqrt(swarmSize));
        const spacing = size / sideLength;
        const centerOffset = (sideLength - 1) * spacing / 2;
        for (let i = 0; i < swarmSize; i++) {
          const row = Math.floor(i / sideLength);
          const col = i % sideLength;
          positions.push(new THREE.Vector3(
            col * spacing - centerOffset,
            0,
            row * spacing - centerOffset
          ).add(offset));
        }
        break;

      case 'triangle':
        const rows = Math.ceil(Math.sqrt(swarmSize * 2));
        let droneIndex = 0;
        for (let row = 0; row < rows && droneIndex < swarmSize; row++) {
          const dronesInRow = row + 1;
          for (let col = 0; col < dronesInRow && droneIndex < swarmSize; col++) {
            positions.push(new THREE.Vector3(
              (col - row / 2) * size / 3,
              0,
              row * size / 3 - size / 2
            ).add(offset));
            droneIndex++;
          }
        }
        break;

      case 'diamond':
        const half = Math.ceil(swarmSize / 2);
        for (let i = 0; i < swarmSize; i++) {
          const angle = (i / swarmSize) * Math.PI * 2;
          const radius = i < half ? (i / half) * size : ((swarmSize - i) / half) * size;
          positions.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          ).add(offset));
        }
        break;

      case 'star':
        for (let i = 0; i < swarmSize; i++) {
          const angle = (i / swarmSize) * Math.PI * 2;
          const radius = (i % 2 === 0) ? size : size * 0.5;
          positions.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          ).add(offset));
        }
        break;

      case 'heart':
        for (let i = 0; i < swarmSize; i++) {
          const t = (i / swarmSize) * Math.PI * 2;
          const x = size * 0.5 * (16 * Math.sin(t) ** 3) / 16;
          const z = size * 0.5 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;
          positions.push(new THREE.Vector3(x, 0, -z).add(offset));
        }
        break;

      case 'spiral':
        for (let i = 0; i < swarmSize; i++) {
          const angle = (i / swarmSize) * Math.PI * 6;
          const radius = (i / swarmSize) * size;
          positions.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          ).add(offset));
        }
        break;

      case 'airplane':
        // Fuselage
        const fuselageLength = size * 1.5;
        const wingSpan = size;
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.4) {
            // Fuselage
            const x = (i / (swarmSize * 0.4)) * fuselageLength - fuselageLength / 2;
            positions.push(new THREE.Vector3(x, 0, 0).add(offset));
          } else if (i < swarmSize * 0.7) {
            // Left wing
            const wingProgress = (i - swarmSize * 0.4) / (swarmSize * 0.15);
            positions.push(new THREE.Vector3(0, 0, wingProgress * wingSpan).add(offset));
          } else {
            // Right wing
            const wingProgress = (i - swarmSize * 0.7) / (swarmSize * 0.15);
            positions.push(new THREE.Vector3(0, 0, -wingProgress * wingSpan).add(offset));
          }
        }
        break;

      case 'helix':
        for (let i = 0; i < swarmSize; i++) {
          const angle = (i / swarmSize) * Math.PI * 8;
          const height = (i / swarmSize) * size * 2 - size;
          positions.push(new THREE.Vector3(
            Math.cos(angle) * size * 0.5,
            height,
            Math.sin(angle) * size * 0.5
          ).add(offset));
        }
        break;

      case 'sphere':
        for (let i = 0; i < swarmSize; i++) {
          const phi = Math.acos(1 - 2 * (i / swarmSize));
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          positions.push(new THREE.Vector3(
            size * Math.sin(phi) * Math.cos(theta),
            size * Math.sin(phi) * Math.sin(theta),
            size * Math.cos(phi)
          ).add(offset));
        }
        break;

      case 'cylinder':
        const layers = Math.ceil(swarmSize / 20);
        for (let i = 0; i < swarmSize; i++) {
          const layer = Math.floor(i / (swarmSize / layers));
          const angleIndex = i % Math.ceil(swarmSize / layers);
          const angle = (angleIndex / Math.ceil(swarmSize / layers)) * Math.PI * 2;
          positions.push(new THREE.Vector3(
            Math.cos(angle) * size,
            (layer / layers) * size * 2 - size,
            Math.sin(angle) * size
          ).add(offset));
        }
        break;

      case 'pyramid':
        const pyramidLayers = Math.ceil(Math.sqrt(swarmSize));
        let pyramidIndex = 0;
        for (let layer = 0; layer < pyramidLayers && pyramidIndex < swarmSize; layer++) {
          const layerSize = (pyramidLayers - layer);
          const layerDrones = layerSize * layerSize;
          for (let j = 0; j < layerDrones && pyramidIndex < swarmSize; j++) {
            const row = Math.floor(j / layerSize);
            const col = j % layerSize;
            positions.push(new THREE.Vector3(
              (col - layerSize / 2) * size / pyramidLayers,
              layer * size / pyramidLayers,
              (row - layerSize / 2) * size / pyramidLayers
            ).add(offset));
            pyramidIndex++;
          }
        }
        break;

      case 'wave':
        for (let i = 0; i < swarmSize; i++) {
          const x = (i / swarmSize) * size * 2 - size;
          const z = Math.sin((i / swarmSize) * Math.PI * 4) * size * 0.3;
          positions.push(new THREE.Vector3(x, 0, z).add(offset));
        }
        break;

      case 'figure8':
        for (let i = 0; i < swarmSize; i++) {
          const t = (i / swarmSize) * Math.PI * 2;
          const scale = size * 0.5;
          positions.push(new THREE.Vector3(
            scale * Math.sin(t),
            0,
            scale * Math.sin(t) * Math.cos(t)
          ).add(offset));
        }
        break;

      case 'cross':
        const armLength = size;
        const crossWidth = size * 0.3;
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize / 2) {
            // Horizontal arm
            const x = (i / (swarmSize / 2)) * armLength * 2 - armLength;
            positions.push(new THREE.Vector3(x, 0, 0).add(offset));
          } else {
            // Vertical arm
            const z = ((i - swarmSize / 2) / (swarmSize / 2)) * armLength * 2 - armLength;
            positions.push(new THREE.Vector3(0, 0, z).add(offset));
          }
        }
        break;

      case 'arrow':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.6) {
            // Arrow body
            const x = (i / (swarmSize * 0.6)) * size - size / 2;
            positions.push(new THREE.Vector3(x, 0, 0).add(offset));
          } else if (i < swarmSize * 0.8) {
            // Arrow head top
            const progress = (i - swarmSize * 0.6) / (swarmSize * 0.1);
            positions.push(new THREE.Vector3(size / 2, 0, progress * size * 0.5).add(offset));
          } else {
            // Arrow head bottom
            const progress = (i - swarmSize * 0.8) / (swarmSize * 0.1);
            positions.push(new THREE.Vector3(size / 2, 0, -progress * size * 0.5).add(offset));
          }
        }
        break;

      case 'random':
        for (let i = 0; i < swarmSize; i++) {
          positions.push(new THREE.Vector3(
            (Math.random() - 0.5) * size * 2,
            (Math.random() - 0.5) * size * 2,
            (Math.random() - 0.5) * size * 2
          ).add(offset));
        }
        break;
    }

    return positions;
  };

  // Update target positions when formation or parameters change
  useEffect(() => {
    if (drones.length === 0) return;

    const formationPositions = getFormationPositions(formation);
    setDrones(prevDrones =>
      prevDrones.map((drone, index) => ({
        ...drone,
        targetPosition: formationPositions[index] || drone.targetPosition,
      }))
    );
  }, [formation, targetPosition, drones.length, formationSize]);

  // Animation loop
  useFrame((state, delta) => {
    timeRef.current += delta * animationSpeed;

    if (!isAnimating || !groupRef.current) return;

    setDrones(prevDrones =>
      prevDrones.map(drone => {
        // Calculate direction to target
        const direction = drone.targetPosition.clone().sub(drone.position);
        const distance = direction.length();

        if (distance > 0.05) {
          // Smooth movement towards target
          const moveSpeed = Math.min(distance * 0.02 * animationSpeed, 0.15 * animationSpeed);
          direction.normalize().multiplyScalar(moveSpeed);
          
          const newPosition = drone.position.clone().add(direction);
          
          return {
            ...drone,
            position: newPosition,
            velocity: direction,
          };
        }

        return drone;
      })
    );
  });

  // Get color based on mode
  const getDroneColor = (drone: DroneData, index: number): string => {
    switch (colorMode) {
      case 'by_index':
        const hue = (index / swarmSize) * 360;
        return `hsl(${hue}, 70%, 60%)`;
      
      case 'by_distance':
        const distance = drone.position.length();
        const normalizedDistance = Math.min(distance / 30, 1);
        const distanceHue = (1 - normalizedDistance) * 240;
        return `hsl(${distanceHue}, 80%, 60%)`;
      
      case 'by_velocity':
        const speed = drone.velocity.length();
        const normalizedSpeed = Math.min(speed * 10, 1);
        const speedHue = normalizedSpeed * 120;
        return `hsl(${speedHue}, 90%, 65%)`;
      
      case 'rainbow':
        const rainbowHue = (timeRef.current * 50 + index * 10) % 360;
        return `hsl(${rainbowHue}, 80%, 60%)`;
      
      case 'temperature':
        const temp = Math.sin(timeRef.current + index * 0.1) * 0.5 + 0.5;
        const tempHue = temp * 60; // Blue to red
        return `hsl(${tempHue}, 90%, 60%)`;
      
      default:
        return '#60a5fa';
    }
  };

  return (
    <group ref={groupRef}>
      {drones.map((drone, index) => (
        <mesh key={drone.id} position={drone.position}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color={getDroneColor(drone, index)}
            emissive={getDroneColor(drone, index)}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      {/* Target position indicator */}
      <mesh position={targetPosition}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
          emissive="#ffffff"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
};
