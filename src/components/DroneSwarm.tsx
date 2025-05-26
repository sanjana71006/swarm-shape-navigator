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

  // Formation calculation functions - EXPANDED with all new formations
  const getFormationPositions = (type: FormationType): THREE.Vector3[] => {
    const positions: THREE.Vector3[] = [];
    const offset = new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]);
    const size = formationSize;

    switch (type) {
      // Indian Heritage Formations
      case 'indian_flag':
        const flagHeight = size * 1.5;
        const flagWidth = size * 2;
        for (let i = 0; i < swarmSize; i++) {
          const row = Math.floor(i / Math.ceil(swarmSize / 3));
          const col = i % Math.ceil(swarmSize / 3);
          const y = row < Math.ceil(swarmSize / 9) ? flagHeight / 3 : 
                   row < Math.ceil(swarmSize * 2 / 9) ? 0 : -flagHeight / 3;
          positions.push(new THREE.Vector3(
            (col / Math.ceil(swarmSize / 3)) * flagWidth - flagWidth / 2,
            y,
            0
          ).add(offset));
        }
        break;

      case 'ashoka_chakra':
        const spokes = 24;
        const radius = size;
        for (let i = 0; i < swarmSize; i++) {
          if (i < spokes) {
            // Spokes
            const angle = (i / spokes) * Math.PI * 2;
            const spokeLength = radius * (0.3 + 0.7 * ((i % 3) / 2));
            positions.push(new THREE.Vector3(
              Math.cos(angle) * spokeLength,
              0,
              Math.sin(angle) * spokeLength
            ).add(offset));
          } else {
            // Outer ring
            const angle = ((i - spokes) / (swarmSize - spokes)) * Math.PI * 2;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ).add(offset));
          }
        }
        break;

      case 'peacock':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.3) {
            // Body
            const bodyLength = size;
            const x = (i / (swarmSize * 0.3)) * bodyLength - bodyLength / 2;
            positions.push(new THREE.Vector3(x, 0, 0).add(offset));
          } else if (i < swarmSize * 0.5) {
            // Neck and head
            const neckProgress = (i - swarmSize * 0.3) / (swarmSize * 0.2);
            positions.push(new THREE.Vector3(
              -size / 2,
              neckProgress * size * 0.5,
              neckProgress * size * 0.3
            ).add(offset));
          } else {
            // Feather tail fan
            const featherIndex = i - swarmSize * 0.5;
            const totalFeathers = swarmSize * 0.5;
            const angle = (featherIndex / totalFeathers) * Math.PI - Math.PI / 2;
            const featherRadius = size * 1.5;
            positions.push(new THREE.Vector3(
              size / 2 + Math.cos(angle) * featherRadius,
              Math.sin(angle) * featherRadius * 0.5,
              Math.sin(angle) * featherRadius * 0.3
            ).add(offset));
          }
        }
        break;

      case 'lotus':
        const petalCount = 8;
        const centerRadius = size * 0.3;
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.2) {
            // Center
            const angle = (i / (swarmSize * 0.2)) * Math.PI * 2;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * centerRadius,
              0,
              Math.sin(angle) * centerRadius
            ).add(offset));
          } else {
            // Petals
            const petalIndex = Math.floor((i - swarmSize * 0.2) / ((swarmSize * 0.8) / petalCount));
            const petalProgress = ((i - swarmSize * 0.2) % ((swarmSize * 0.8) / petalCount)) / ((swarmSize * 0.8) / petalCount);
            const petalAngle = (petalIndex / petalCount) * Math.PI * 2;
            const petalRadius = centerRadius + petalProgress * size;
            positions.push(new THREE.Vector3(
              Math.cos(petalAngle) * petalRadius,
              0,
              Math.sin(petalAngle) * petalRadius
            ).add(offset));
          }
        }
        break;

      case 'elephant':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.4) {
            // Body
            const bodyProgress = i / (swarmSize * 0.4);
            positions.push(new THREE.Vector3(
              bodyProgress * size - size / 2,
              0,
              0
            ).add(offset));
          } else if (i < swarmSize * 0.6) {
            // Head
            const headProgress = (i - swarmSize * 0.4) / (swarmSize * 0.2);
            positions.push(new THREE.Vector3(
              -size / 2 - headProgress * size * 0.5,
              headProgress * size * 0.3,
              0
            ).add(offset));
          } else if (i < swarmSize * 0.8) {
            // Trunk
            const trunkProgress = (i - swarmSize * 0.6) / (swarmSize * 0.2);
            const trunkCurve = Math.sin(trunkProgress * Math.PI);
            positions.push(new THREE.Vector3(
              -size * 0.75 - trunkProgress * size * 0.5,
              -trunkProgress * size * 0.8,
              trunkCurve * size * 0.3
            ).add(offset));
          } else {
            // Legs
            const legIndex = i - swarmSize * 0.8;
            const legsPerLeg = (swarmSize * 0.2) / 4;
            const legNumber = Math.floor(legIndex / legsPerLeg);
            const legProgress = (legIndex % legsPerLeg) / legsPerLeg;
            const legX = (legNumber % 2) * size * 0.3 - size * 0.15;
            const legZ = Math.floor(legNumber / 2) * size * 0.6 - size * 0.3;
            positions.push(new THREE.Vector3(
              legX,
              -legProgress * size * 0.5,
              legZ
            ).add(offset));
          }
        }
        break;

      case 'taj_mahal':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.3) {
            // Main dome
            const angle = (i / (swarmSize * 0.3)) * Math.PI * 2;
            const domeRadius = size * 0.5;
            const domeHeight = Math.sin((i / (swarmSize * 0.3)) * Math.PI) * size * 0.5;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * domeRadius,
              domeHeight + size * 0.5,
              Math.sin(angle) * domeRadius
            ).add(offset));
          } else if (i < swarmSize * 0.6) {
            // Base structure
            const baseIndex = i - swarmSize * 0.3;
            const baseSize = size * 1.2;
            const row = Math.floor(baseIndex / Math.ceil(Math.sqrt(swarmSize * 0.3)));
            const col = baseIndex % Math.ceil(Math.sqrt(swarmSize * 0.3));
            positions.push(new THREE.Vector3(
              (col / Math.ceil(Math.sqrt(swarmSize * 0.3))) * baseSize - baseSize / 2,
              0,
              (row / Math.ceil(Math.sqrt(swarmSize * 0.3))) * baseSize - baseSize / 2
            ).add(offset));
          } else {
            // Minarets
            const minaretIndex = i - swarmSize * 0.6;
            const minaretNumber = Math.floor(minaretIndex / (swarmSize * 0.1));
            const minaretHeight = (minaretIndex % (swarmSize * 0.1)) / (swarmSize * 0.1);
            const minaretPositions = [
              [-size, 0, -size], [size, 0, -size], [size, 0, size], [-size, 0, size]
            ];
            const minaretPos = minaretPositions[minaretNumber % 4];
            positions.push(new THREE.Vector3(
              minaretPos[0],
              minaretHeight * size * 1.5,
              minaretPos[2]
            ).add(offset));
          }
        }
        break;

      // Basic 2D Shapes - Enhanced
      case 'rectangle':
        const rectWidth = size * 1.5;
        const rectHeight = size;
        const perimeterDrones = Math.ceil(swarmSize * 0.6);
        const interiorDrones = swarmSize - perimeterDrones;
        for (let i = 0; i < swarmSize; i++) {
          if (i < perimeterDrones) {
            const perimeterProgress = i / perimeterDrones;
            const totalPerimeter = 2 * (rectWidth + rectHeight);
            const currentPos = perimeterProgress * totalPerimeter;
            
            if (currentPos < rectWidth) {
              positions.push(new THREE.Vector3(currentPos - rectWidth/2, -rectHeight/2, 0).add(offset));
            } else if (currentPos < rectWidth + rectHeight) {
              positions.push(new THREE.Vector3(rectWidth/2, currentPos - rectWidth - rectHeight/2, 0).add(offset));
            } else if (currentPos < 2 * rectWidth + rectHeight) {
              positions.push(new THREE.Vector3(rectWidth/2 - (currentPos - rectWidth - rectHeight), rectHeight/2, 0).add(offset));
            } else {
              positions.push(new THREE.Vector3(-rectWidth/2, rectHeight/2 - (currentPos - 2 * rectWidth - rectHeight), 0).add(offset));
            }
          } else {
            const interiorIndex = i - perimeterDrones;
            positions.push(new THREE.Vector3(
              (Math.random() - 0.5) * rectWidth * 0.8,
              (Math.random() - 0.5) * rectHeight * 0.8,
              0
            ).add(offset));
          }
        }
        break;

      case 'pentagon':
        const pentagonRadius = size;
        for (let i = 0; i < swarmSize; i++) {
          if (i < 5) {
            // Vertices
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * pentagonRadius,
              0,
              Math.sin(angle) * pentagonRadius
            ).add(offset));
          } else {
            // Interior points
            const interiorRadius = (Math.random() * 0.8 + 0.1) * pentagonRadius;
            const angle = Math.random() * Math.PI * 2;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * interiorRadius,
              0,
              Math.sin(angle) * interiorRadius
            ).add(offset));
          }
        }
        break;

      case 'hexagon':
        const hexRadius = size;
        for (let i = 0; i < swarmSize; i++) {
          if (i < 6) {
            // Vertices
            const angle = (i / 6) * Math.PI * 2;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * hexRadius,
              0,
              Math.sin(angle) * hexRadius
            ).add(offset));
          } else {
            // Honeycomb pattern
            const layer = Math.floor((i - 6) / 6) + 1;
            const posInLayer = (i - 6) % 6;
            const layerRadius = hexRadius * (1 - layer * 0.15);
            const angle = (posInLayer / 6) * Math.PI * 2 + (layer * Math.PI / 6);
            positions.push(new THREE.Vector3(
              Math.cos(angle) * layerRadius,
              0,
              Math.sin(angle) * layerRadius
            ).add(offset));
          }
        }
        break;

      // Special Symbols - Enhanced
      case 'smiley':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.6) {
            // Face circle
            const angle = (i / (swarmSize * 0.6)) * Math.PI * 2;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * size,
              0,
              Math.sin(angle) * size
            ).add(offset));
          } else if (i < swarmSize * 0.75) {
            // Eyes
            const eyeIndex = i - swarmSize * 0.6;
            const isLeftEye = eyeIndex < (swarmSize * 0.15) / 2;
            const eyeX = isLeftEye ? -size * 0.3 : size * 0.3;
            const eyeAngle = (eyeIndex % ((swarmSize * 0.15) / 2)) / ((swarmSize * 0.15) / 2) * Math.PI * 2;
            positions.push(new THREE.Vector3(
              eyeX + Math.cos(eyeAngle) * size * 0.1,
              0,
              size * 0.3 + Math.sin(eyeAngle) * size * 0.1
            ).add(offset));
          } else {
            // Smile
            const smileIndex = i - swarmSize * 0.75;
            const smileProgress = smileIndex / (swarmSize * 0.25);
            const smileAngle = smileProgress * Math.PI;
            positions.push(new THREE.Vector3(
              Math.cos(smileAngle + Math.PI) * size * 0.5,
              0,
              Math.sin(smileAngle + Math.PI) * size * 0.3 - size * 0.2
            ).add(offset));
          }
        }
        break;

      case 'peace':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.4) {
            // Outer circle
            const angle = (i / (swarmSize * 0.4)) * Math.PI * 2;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * size,
              0,
              Math.sin(angle) * size
            ).add(offset));
          } else if (i < swarmSize * 0.6) {
            // Vertical line
            const lineProgress = (i - swarmSize * 0.4) / (swarmSize * 0.2);
            positions.push(new THREE.Vector3(0, 0, (lineProgress - 0.5) * size * 2).add(offset));
          } else if (i < swarmSize * 0.8) {
            // Left diagonal
            const diagProgress = (i - swarmSize * 0.6) / (swarmSize * 0.2);
            positions.push(new THREE.Vector3(
              -diagProgress * size,
              0,
              diagProgress * size
            ).add(offset));
          } else {
            // Right diagonal
            const diagProgress = (i - swarmSize * 0.8) / (swarmSize * 0.2);
            positions.push(new THREE.Vector3(
              diagProgress * size,
              0,
              diagProgress * size
            ).add(offset));
          }
        }
        break;

      case 'infinity':
        for (let i = 0; i < swarmSize; i++) {
          const t = (i / swarmSize) * Math.PI * 4;
          const scale = size * 0.8;
          positions.push(new THREE.Vector3(
            scale * Math.cos(t) / (1 + Math.sin(t) ** 2),
            0,
            scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) ** 2)
          ).add(offset));
        }
        break;

      case 'yin_yang':
        for (let i = 0; i < swarmSize; i++) {
          const angle = (i / swarmSize) * Math.PI * 2;
          const radius = size * (0.5 + 0.3 * Math.sin(angle * 2));
          if (i < swarmSize / 2) {
            // Yin (dark) side
            positions.push(new THREE.Vector3(
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ).add(offset));
          } else {
            // Yang (light) side  
            positions.push(new THREE.Vector3(
              Math.cos(angle + Math.PI) * radius,
              0,
              Math.sin(angle + Math.PI) * radius
            ).add(offset));
          }
        }
        break;

      // Numbers & Letters
      case 'number_0':
        for (let i = 0; i < swarmSize; i++) {
          const angle = (i / swarmSize) * Math.PI * 2;
          const radiusX = size * 0.8;
          const radiusY = size * 1.2;
          positions.push(new THREE.Vector3(
            Math.cos(angle) * radiusX,
            0,
            Math.sin(angle) * radiusY
          ).add(offset));
        }
        break;

      case 'number_1':
        for (let i = 0; i < swarmSize; i++) {
          const progress = i / swarmSize;
          positions.push(new THREE.Vector3(0, 0, (progress - 0.5) * size * 2).add(offset));
        }
        break;

      case 'number_2':
        for (let i = 0; i < swarmSize; i++) {
          const segmentSize = swarmSize / 3;
          if (i < segmentSize) {
            // Top horizontal
            const progress = i / segmentSize;
            positions.push(new THREE.Vector3((progress - 0.5) * size, 0, size).add(offset));
          } else if (i < segmentSize * 2) {
            // Middle diagonal
            const progress = (i - segmentSize) / segmentSize;
            positions.push(new THREE.Vector3(
              (0.5 - progress) * size,
              0,
              (1 - progress) * size
            ).add(offset));
          } else {
            // Bottom horizontal
            const progress = (i - segmentSize * 2) / segmentSize;
            positions.push(new THREE.Vector3((progress - 0.5) * size, 0, -size).add(offset));
          }
        }
        break;

      case 'letter_a':
        for (let i = 0; i < swarmSize; i++) {
          const segmentSize = swarmSize / 3;
          if (i < segmentSize) {
            // Left side
            const progress = i / segmentSize;
            positions.push(new THREE.Vector3(
              -size * 0.5,
              0,
              (progress - 0.5) * size * 1.5
            ).add(offset));
          } else if (i < segmentSize * 2) {
            // Right side
            const progress = (i - segmentSize) / segmentSize;
            positions.push(new THREE.Vector3(
              size * 0.5,
              0,
              (progress - 0.5) * size * 1.5
            ).add(offset));
          } else {
            // Cross bar
            const progress = (i - segmentSize * 2) / segmentSize;
            positions.push(new THREE.Vector3(
              (progress - 0.5) * size,
              0,
              0
            ).add(offset));
          }
        }
        break;

      case 'letter_i':
        for (let i = 0; i < swarmSize; i++) {
          const segmentSize = swarmSize / 3;
          if (i < segmentSize) {
            // Top horizontal
            const progress = i / segmentSize;
            positions.push(new THREE.Vector3((progress - 0.5) * size * 0.6, 0, size).add(offset));
          } else if (i < segmentSize * 2) {
            // Vertical line
            const progress = (i - segmentSize) / segmentSize;
            positions.push(new THREE.Vector3(0, 0, (1 - progress * 2) * size).add(offset));
          } else {
            // Bottom horizontal
            const progress = (i - segmentSize * 2) / segmentSize;
            positions.push(new THREE.Vector3((progress - 0.5) * size * 0.6, 0, -size).add(offset));
          }
        }
        break;

      case 'letter_love':
        // Spell out LOVE with heart shape
        for (let i = 0; i < swarmSize; i++) {
          const t = (i / swarmSize) * Math.PI * 2;
          const x = size * 0.5 * (16 * Math.sin(t) ** 3) / 16;
          const z = size * 0.5 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;
          positions.push(new THREE.Vector3(x, 0, -z).add(offset));
        }
        break;

      // Technology & Objects
      case 'phone':
        for (let i = 0; i < swarmSize; i++) {
          const phoneWidth = size * 0.4;
          const phoneHeight = size * 1.2;
          if (i < swarmSize * 0.8) {
            // Screen area
            const row = Math.floor(i / Math.ceil(Math.sqrt(swarmSize * 0.8)));
            const col = i % Math.ceil(Math.sqrt(swarmSize * 0.8));
            const rows = Math.ceil(Math.sqrt(swarmSize * 0.8));
            const cols = Math.ceil(Math.sqrt(swarmSize * 0.8));
            positions.push(new THREE.Vector3(
              (col / cols - 0.5) * phoneWidth * 0.8,
              0,
              (row / rows - 0.5) * phoneHeight * 0.7
            ).add(offset));
          } else {
            // Frame
            const frameIndex = i - swarmSize * 0.8;
            const frameProgress = frameIndex / (swarmSize * 0.2);
            const framePerimeter = 2 * (phoneWidth + phoneHeight);
            const currentPos = frameProgress * framePerimeter;
            
            if (currentPos < phoneWidth) {
              positions.push(new THREE.Vector3(
                currentPos - phoneWidth/2,
                0,
                -phoneHeight/2
              ).add(offset));
            } else if (currentPos < phoneWidth + phoneHeight) {
              positions.push(new THREE.Vector3(
                phoneWidth/2,
                0,
                currentPos - phoneWidth - phoneHeight/2
              ).add(offset));
            } else if (currentPos < 2 * phoneWidth + phoneHeight) {
              positions.push(new THREE.Vector3(
                phoneWidth/2 - (currentPos - phoneWidth - phoneHeight),
                0,
                phoneHeight/2
              ).add(offset));
            } else {
              positions.push(new THREE.Vector3(
                -phoneWidth/2,
                0,
                phoneHeight/2 - (currentPos - 2 * phoneWidth - phoneHeight)
              ).add(offset));
            }
          }
        }
        break;

      case 'laptop':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.6) {
            // Screen
            const screenIndex = i;
            const screenRows = Math.ceil(Math.sqrt(swarmSize * 0.6));
            const row = Math.floor(screenIndex / screenRows);
            const col = screenIndex % screenRows;
            positions.push(new THREE.Vector3(
              (col / screenRows - 0.5) * size * 1.2,
              (row / screenRows) * size * 0.8,
              0
            ).add(offset));
          } else {
            // Keyboard/base
            const baseIndex = i - swarmSize * 0.6;
            const baseRows = Math.ceil(Math.sqrt(swarmSize * 0.4));
            const row = Math.floor(baseIndex / baseRows);
            const col = baseIndex % baseRows;
            positions.push(new THREE.Vector3(
              (col / baseRows - 0.5) * size * 1.2,
              -size * 0.2,
              (row / baseRows - 0.5) * size * 0.8
            ).add(offset));
          }
        }
        break;

      case 'car':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.7) {
            // Body
            const bodyLength = size * 1.5;
            const bodyWidth = size * 0.8;
            const row = Math.floor(i / Math.ceil(Math.sqrt(swarmSize * 0.7)));
            const col = i % Math.ceil(Math.sqrt(swarmSize * 0.7));
            const rows = Math.ceil(Math.sqrt(swarmSize * 0.7));
            const cols = Math.ceil(Math.sqrt(swarmSize * 0.7));
            positions.push(new THREE.Vector3(
              (col / cols - 0.5) * bodyLength,
              0,
              (row / rows - 0.5) * bodyWidth
            ).add(offset));
          } else {
            // Wheels
            const wheelIndex = i - swarmSize * 0.7;
            const wheelNumber = Math.floor(wheelIndex / ((swarmSize * 0.3) / 4));
            const wheelPositions = [
              [-size * 0.6, 0, -size * 0.3], [size * 0.6, 0, -size * 0.3],
              [-size * 0.6, 0, size * 0.3], [size * 0.6, 0, size * 0.3]
            ];
            const wheelPos = wheelPositions[wheelNumber % 4];
            const wheelAngle = (wheelIndex % ((swarmSize * 0.3) / 4)) / ((swarmSize * 0.3) / 4) * Math.PI * 2;
            positions.push(new THREE.Vector3(
              wheelPos[0] + Math.cos(wheelAngle) * size * 0.1,
              wheelPos[1],
              wheelPos[2] + Math.sin(wheelAngle) * size * 0.1
            ).add(offset));
          }
        }
        break;

      case 'house':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.3) {
            // Roof
            const roofIndex = i;
            const roofProgress = roofIndex / (swarmSize * 0.3);
            const roofAngle = roofProgress * Math.PI;
            const roofHeight = Math.sin(roofAngle) * size * 0.5;
            const roofX = (roofProgress - 0.5) * size;
            positions.push(new THREE.Vector3(roofX, roofHeight + size * 0.5, 0).add(offset));
          } else if (i < swarmSize * 0.8) {
            // Walls
            const wallIndex = i - swarmSize * 0.3;
            const wallRows = Math.ceil(Math.sqrt(swarmSize * 0.5));
            const row = Math.floor(wallIndex / wallRows);
            const col = wallIndex % wallRows;
            positions.push(new THREE.Vector3(
              (col / wallRows - 0.5) * size,
              (row / wallRows - 0.5) * size * 0.8,
              0
            ).add(offset));
          } else {
            // Door
            const doorIndex = i - swarmSize * 0.8;
            const doorProgress = doorIndex / (swarmSize * 0.2);
            positions.push(new THREE.Vector3(
              0,
              (doorProgress - 1) * size * 0.4,
              size * 0.01
            ).add(offset));
          }
        }
        break;

      // Entertainment & Shows
      case 'fireworks':
        for (let i = 0; i < swarmSize; i++) {
          const explosion = Math.floor(i / (swarmSize / 5));
          const particleInExplosion = i % (swarmSize / 5);
          const angle = (particleInExplosion / (swarmSize / 5)) * Math.PI * 2;
          const radius = (particleInExplosion / (swarmSize / 5)) * size;
          const explosionCenter = [
            Math.cos(explosion * 1.2) * size * 0.5,
            explosion * size * 0.3,
            Math.sin(explosion * 1.2) * size * 0.5
          ];
          positions.push(new THREE.Vector3(
            explosionCenter[0] + Math.cos(angle) * radius,
            explosionCenter[1] + Math.sin(angle) * radius * 0.5,
            explosionCenter[2] + Math.sin(angle * 2) * radius * 0.3
          ).add(offset));
        }
        break;

      case 'christmas_tree':
        for (let i = 0; i < swarmSize; i++) {
          const layer = Math.floor(i / (swarmSize / 4));
          const particleInLayer = i % (swarmSize / 4);
          const layerRadius = size * (1 - layer * 0.2);
          const layerHeight = layer * size * 0.4;
          if (layer < 3) {
            // Tree layers
            const angle = (particleInLayer / (swarmSize / 4)) * Math.PI * 2;
            const radius = (particleInLayer / (swarmSize / 4)) * layerRadius;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * radius,
              layerHeight,
              Math.sin(angle) * radius
            ).add(offset));
          } else {
            // Trunk
            positions.push(new THREE.Vector3(
              (Math.random() - 0.5) * size * 0.2,
              -particleInLayer / (swarmSize / 4) * size * 0.5,
              (Math.random() - 0.5) * size * 0.2
            ).add(offset));
          }
        }
        break;

      case 'snowflake':
        const arms = 6;
        for (let i = 0; i < swarmSize; i++) {
          const armIndex = i % arms;
          const positionOnArm = Math.floor(i / arms) / Math.floor(swarmSize / arms);
          const armAngle = (armIndex / arms) * Math.PI * 2;
          const armRadius = positionOnArm * size;
          
          // Add some branching
          const branchOffset = Math.sin(positionOnArm * Math.PI * 4) * size * 0.1;
          
          positions.push(new THREE.Vector3(
            Math.cos(armAngle) * armRadius + Math.cos(armAngle + Math.PI/2) * branchOffset,
            0,
            Math.sin(armAngle) * armRadius + Math.sin(armAngle + Math.PI/2) * branchOffset
          ).add(offset));
        }
        break;

      case 'olympic_rings':
        const rings = 5;
        const ringRadius = size * 0.3;
        const ringPositions = [
          [-size * 0.6, 0, size * 0.3],
          [-size * 0.3, 0, 0],
          [0, 0, size * 0.3],
          [size * 0.3, 0, 0],
          [size * 0.6, 0, size * 0.3]
        ];
        
        for (let i = 0; i < swarmSize; i++) {
          const ringIndex = i % rings;
          const positionInRing = Math.floor(i / rings) / Math.floor(swarmSize / rings);
          const angle = positionInRing * Math.PI * 2;
          const ringCenter = ringPositions[ringIndex];
          
          positions.push(new THREE.Vector3(
            ringCenter[0] + Math.cos(angle) * ringRadius,
            ringCenter[1],
            ringCenter[2] + Math.sin(angle) * ringRadius
          ).add(offset));
        }
        break;

      case 'crown':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.3) {
            // Base band
            const angle = (i / (swarmSize * 0.3)) * Math.PI * 2;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * size,
              -size * 0.3,
              Math.sin(angle) * size
            ).add(offset));
          } else {
            // Crown peaks
            const peakIndex = i - swarmSize * 0.3;
            const peakCount = 7;
            const currentPeak = peakIndex % peakCount;
            const heightInPeak = Math.floor(peakIndex / peakCount) / Math.floor((swarmSize * 0.7) / peakCount);
            const peakAngle = (currentPeak / peakCount) * Math.PI * 2;
            const peakHeight = (currentPeak % 2 === 0 ? 1 : 0.7) * heightInPeak * size;
            
            positions.push(new THREE.Vector3(
              Math.cos(peakAngle) * size,
              -size * 0.3 + peakHeight,
              Math.sin(peakAngle) * size
            ).add(offset));
          }
        }
        break;

      case 'trophy':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.4) {
            // Cup
            const cupIndex = i;
            const cupAngle = (cupIndex / (swarmSize * 0.4)) * Math.PI * 2;
            const cupHeight = Math.sin((cupIndex / (swarmSize * 0.4)) * Math.PI) * size * 0.5;
            positions.push(new THREE.Vector3(
              Math.cos(cupAngle) * size * 0.6,
              cupHeight + size * 0.3,
              Math.sin(cupAngle) * size * 0.6
            ).add(offset));
          } else if (i < swarmSize * 0.6) {
            // Handles
            const handleIndex = i - swarmSize * 0.4;
            const isLeftHandle = handleIndex < (swarmSize * 0.2) / 2;
            const handleSide = isLeftHandle ? -1 : 1;
            const handleProgress = (handleIndex % ((swarmSize * 0.2) / 2)) / ((swarmSize * 0.2) / 2);
            const handleAngle = handleProgress * Math.PI;
            positions.push(new THREE.Vector3(
              handleSide * (size * 0.6 + Math.cos(handleAngle) * size * 0.3),
              size * 0.5 + Math.sin(handleAngle) * size * 0.2,
              0
            ).add(offset));
          } else if (i < swarmSize * 0.8) {
            // Stem
            const stemProgress = (i - swarmSize * 0.6) / (swarmSize * 0.2);
            positions.push(new THREE.Vector3(
              0,
              size * 0.3 - stemProgress * size * 0.4,
              0
            ).add(offset));
          } else {
            // Base
            const baseIndex = i - swarmSize * 0.8;
            const baseAngle = (baseIndex / (swarmSize * 0.2)) * Math.PI * 2;
            positions.push(new THREE.Vector3(
              Math.cos(baseAngle) * size * 0.8,
              -size * 0.2,
              Math.sin(baseAngle) * size * 0.8
            ).add(offset));
          }
        }
        break;

      case 'musical_note':
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.3) {
            // Note head
            const angle = (i / (swarmSize * 0.3)) * Math.PI * 2;
            positions.push(new THREE.Vector3(
              Math.cos(angle) * size * 0.3 - size * 0.5,
              Math.sin(angle) * size * 0.2 - size * 0.8,
              0
            ).add(offset));
          } else if (i < swarmSize * 0.7) {
            // Stem
            const stemProgress = (i - swarmSize * 0.3) / (swarmSize * 0.4);
            positions.push(new THREE.Vector3(
              -size * 0.2,
              -size * 0.8 + stemProgress * size * 1.2,
              0
            ).add(offset));
          } else {
            // Flag
            const flagProgress = (i - swarmSize * 0.7) / (swarmSize * 0.3);
            const flagCurve = Math.sin(flagProgress * Math.PI * 2) * size * 0.2;
            positions.push(new THREE.Vector3(
              -size * 0.2 + flagProgress * size * 0.4,
              size * 0.4 - flagProgress * size * 0.3,
              flagCurve
            ).add(offset));
          }
        }
        break;

      // Abstract & Artistic
      case 'galaxy':
        for (let i = 0; i < swarmSize; i++) {
          const armIndex = i % 4;
          const positionInArm = Math.floor(i / 4) / Math.floor(swarmSize / 4);
          const armAngle = (armIndex / 4) * Math.PI * 2 + positionInArm * Math.PI * 4;
          const armRadius = positionInArm * size * (1 + Math.sin(positionInArm * Math.PI * 3) * 0.3);
          
          positions.push(new THREE.Vector3(
            Math.cos(armAngle) * armRadius,
            (Math.random() - 0.5) * size * 0.2,
            Math.sin(armAngle) * armRadius
          ).add(offset));
        }
        break;

      case 'mandala':
        const mandalaLayers = 5;
        for (let i = 0; i < swarmSize; i++) {
          const layer = i % mandalaLayers;
          const positionInLayer = Math.floor(i / mandalaLayers) / Math.floor(swarmSize / mandalaLayers);
          const layerRadius = (layer + 1) * size / mandalaLayers;
          const petalCount = (layer + 1) * 8;
          const angle = positionInLayer * Math.PI * 2 * petalCount / 8;
          const petalPattern = Math.sin(angle * petalCount / 2) * 0.3 + 1;
          
          positions.push(new THREE.Vector3(
            Math.cos(angle) * layerRadius * petalPattern,
            0,
            Math.sin(angle) * layerRadius * petalPattern
          ).add(offset));
        }
        break;

      // Keep existing formations (line, circle, square, etc.)
      case 'line':
        for (let i = 0; i < swarmSize; i++) {
          positions.push(new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          ).add(offset));
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
          const height = (i / swarmSize) * size * 2 - size;
          positions.push(new THREE.Vector3(
            Math.cos(angle) * size * 0.5,
            height,
            Math.sin(angle) * size * 0.5
          ).add(offset));
        }
        break;

      case 'airplane':
        // ENHANCED REALISTIC AIRPLANE FORMATION - like in the reference image
        const fuselageLength = size * 2.0; // Longer fuselage
        const wingSpan = size * 1.8; // Wider wingspan
        const tailHeight = size * 0.6; // Vertical tail
        
        for (let i = 0; i < swarmSize; i++) {
          if (i < swarmSize * 0.35) {
            // Main fuselage - longer and more detailed
            const fuselageProgress = i / (swarmSize * 0.35);
            const x = fuselageProgress * fuselageLength - fuselageLength / 2;
            // Add some width variation for realistic fuselage shape
            const fuselageWidth = Math.sin(fuselageProgress * Math.PI) * size * 0.15;
            const z = (Math.random() - 0.5) * fuselageWidth;
            positions.push(new THREE.Vector3(x, 0, z).add(offset));
          } else if (i < swarmSize * 0.55) {
            // Main wings - more spread out and realistic
            const wingIndex = i - swarmSize * 0.35;
            const wingsPerSide = (swarmSize * 0.2) / 2;
            const isLeftWing = wingIndex < wingsPerSide;
            const wingProgress = (wingIndex % wingsPerSide) / wingsPerSide;
            
            // Wing sweep and taper
            const wingX = -fuselageLength * 0.1 + wingProgress * size * 0.4; // Slight forward sweep
            const wingZ = (isLeftWing ? 1 : -1) * (wingProgress * wingSpan / 2 + size * 0.1);
            const wingY = wingProgress * size * 0.1; // Slight dihedral angle
            
            positions.push(new THREE.Vector3(wingX, wingY, wingZ).add(offset));
          } else if (i < swarmSize * 0.7) {
            // Wing tips and winglets
            const wingTipIndex = i - swarmSize * 0.55;
            const tipsPerSide = (swarmSize * 0.15) / 2;
            const isLeftTip = wingTipIndex < tipsPerSide;
            const tipProgress = (wingTipIndex % tipsPerSide) / tipsPerSide;
            
            const tipX = size * 0.3 + tipProgress * size * 0.2;
            const tipZ = (isLeftTip ? 1 : -1) * (wingSpan / 2 + tipProgress * size * 0.3);
            const tipY = tipProgress * size * 0.3; // Winglet height
            
            positions.push(new THREE.Vector3(tipX, tipY, tipZ).add(offset));
          } else if (i < swarmSize * 0.85) {
            // Horizontal tail/stabilizer
            const tailIndex = i - swarmSize * 0.7;
            const tailProgress = (tailIndex / (swarmSize * 0.15)) - 0.5;
            const tailX = fuselageLength * 0.4; // Near the back
            const tailZ = tailProgress * size * 0.8; // Horizontal span
            
            positions.push(new THREE.Vector3(tailX, 0, tailZ).add(offset));
          } else {
            // Vertical tail/rudder
            const rudderIndex = i - swarmSize * 0.85;
            const rudderProgress = rudderIndex / (swarmSize * 0.15);
            const rudderX = fuselageLength * 0.35 + rudderProgress * size * 0.3;
            const rudderY = rudderProgress * tailHeight;
            
            positions.push(new THREE.Vector3(rudderX, rudderY, 0).add(offset));
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
        const cylinderLayers = Math.ceil(swarmSize / 20);
        for (let i = 0; i < swarmSize; i++) {
          const layer = Math.floor(i / (swarmSize / cylinderLayers));
          const angleIndex = i % Math.ceil(swarmSize / cylinderLayers);
          const angle = (angleIndex / Math.ceil(swarmSize / cylinderLayers)) * Math.PI * 2;
          positions.push(new THREE.Vector3(
            Math.cos(angle) * size,
            (layer / cylinderLayers) * size * 2 - size,
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

  // Enhanced color system with new modes
  const getDroneColor = (drone: DroneData, index: number): string => {
    switch (colorMode) {
      case 'indian_flag':
        const flagThird = swarmSize / 3;
        if (index < flagThird) return '#FF9933'; // Saffron
        if (index < flagThird * 2) return '#FFFFFF'; // White  
        return '#138808'; // Green
      
      case 'peacock':
        const peacockColors = ['#0F4C75', '#3282B8', '#BBE1FA', '#1BA1E2', '#00A0B0'];
        return peacockColors[index % peacockColors.length];
      
      case 'fire':
        const fireHue = 20 + (index / swarmSize) * 40; // Red to yellow
        return `hsl(${fireHue}, 100%, ${60 + Math.sin(timeRef.current + index * 0.1) * 20}%)`;
      
      case 'ocean':
        const oceanHue = 180 + (index / swarmSize) * 60; // Cyan to blue
        return `hsl(${oceanHue}, 80%, ${50 + Math.sin(timeRef.current * 0.5 + index * 0.05) * 30}%)`;
      
      case 'galaxy':
        const galaxyColors = ['#4A0E4E', '#81159A', '#C62D42', '#FF7B25', '#FFCD3C'];
        const colorIndex = Math.floor((index / swarmSize) * galaxyColors.length);
        return galaxyColors[Math.min(colorIndex, galaxyColors.length - 1)];
      
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
      
      {/* Enhanced Target position indicator */}
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
