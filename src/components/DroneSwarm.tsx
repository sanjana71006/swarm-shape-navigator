
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { FormationType, ColorMode } from '@/pages/Index';

interface DroneSwarmProps {
  formation: FormationType;
  isAnimating: boolean;
  colorMode: ColorMode;
  targetPosition: number[];
}

interface DroneData {
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  id: number;
}

const NUM_DRONES = 50;

export const DroneSwarm = ({ formation, isAnimating, colorMode, targetPosition }: DroneSwarmProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [drones, setDrones] = useState<DroneData[]>([]);

  // Initialize drones
  useEffect(() => {
    const initialDrones: DroneData[] = [];
    for (let i = 0; i < NUM_DRONES; i++) {
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
  }, []);

  // Formation calculation functions
  const getFormationPositions = (type: FormationType): THREE.Vector3[] => {
    const positions: THREE.Vector3[] = [];
    const offset = new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]);

    switch (type) {
      case 'line':
        for (let i = 0; i < NUM_DRONES; i++) {
          positions.push(new THREE.Vector3(i * 0.8 - (NUM_DRONES * 0.8) / 2, 0, 0).add(offset));
        }
        break;

      case 'circle':
        const radius = 8;
        for (let i = 0; i < NUM_DRONES; i++) {
          const angle = (i / NUM_DRONES) * Math.PI * 2;
          positions.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          ).add(offset));
        }
        break;

      case 'square':
        const sideLength = Math.ceil(Math.sqrt(NUM_DRONES));
        const spacing = 1.2;
        const centerOffset = (sideLength - 1) * spacing / 2;
        for (let i = 0; i < NUM_DRONES; i++) {
          const row = Math.floor(i / sideLength);
          const col = i % sideLength;
          positions.push(new THREE.Vector3(
            col * spacing - centerOffset,
            0,
            row * spacing - centerOffset
          ).add(offset));
        }
        break;

      case 'random':
        for (let i = 0; i < NUM_DRONES; i++) {
          positions.push(new THREE.Vector3(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          ).add(offset));
        }
        break;
    }

    return positions;
  };

  // Update target positions when formation or target changes
  useEffect(() => {
    if (drones.length === 0) return;

    const formationPositions = getFormationPositions(formation);
    setDrones(prevDrones =>
      prevDrones.map((drone, index) => ({
        ...drone,
        targetPosition: formationPositions[index] || drone.targetPosition,
      }))
    );
  }, [formation, targetPosition, drones.length]);

  // Animation loop
  useFrame((state, delta) => {
    if (!isAnimating || !groupRef.current) return;

    setDrones(prevDrones =>
      prevDrones.map(drone => {
        // Calculate direction to target
        const direction = drone.targetPosition.clone().sub(drone.position);
        const distance = direction.length();

        if (distance > 0.1) {
          // Smooth movement towards target
          const moveSpeed = Math.min(distance * 0.02, 0.1);
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
    if (colorMode === 'by_index') {
      const hue = (index / NUM_DRONES) * 360;
      return `hsl(${hue}, 70%, 60%)`;
    } else {
      // Color by distance from origin
      const distance = drone.position.length();
      const normalizedDistance = Math.min(distance / 20, 1);
      const hue = (1 - normalizedDistance) * 240; // Blue to red
      return `hsl(${hue}, 80%, 60%)`;
    }
  };

  return (
    <group ref={groupRef}>
      {drones.map((drone, index) => (
        <mesh key={drone.id} position={drone.position}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial
            color={getDroneColor(drone, index)}
            emissive={getDroneColor(drone, index)}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      
      {/* Target position indicator */}
      <mesh position={targetPosition}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.5}
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};
