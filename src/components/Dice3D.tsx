'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface DiceProps {
  value: number;
  isRolling: boolean;
}

function DiceMesh({ value, isRolling }: DiceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current && isRolling) {
      meshRef.current.rotation.x += delta * 12;
      meshRef.current.rotation.y += delta * 8;
      meshRef.current.rotation.z += delta * 6;
    }
  });

  useEffect(() => {
    if (!isRolling && groupRef.current) {
      // Set the dice to show the correct face flat
      const rotations = [
        [0, 0, 0], // 1 - front face
        [0, Math.PI / 2, 0], // 2 - right face  
        [0, Math.PI, 0], // 3 - back face
        [0, -Math.PI / 2, 0], // 4 - left face
        [-Math.PI / 2, 0, 0], // 5 - top face
        [Math.PI / 2, 0, 0] // 6 - bottom face
      ];
      
      const [rotX, rotY, rotZ] = rotations[value - 1];
      groupRef.current.rotation.set(rotX, rotY, rotZ);
    }
  }, [value, isRolling]);

  return (
    <group ref={groupRef}>
      <group ref={meshRef}>
        {/* Main dice body - larger and higher contrast */}
        <Box args={[2.5, 2.5, 2.5]} castShadow receiveShadow>
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.2}
            metalness={0.05}
          />
        </Box>
        
        {/* Large bold numbers on each face */}
        {!isRolling && (
          <>
            {/* Face 1 - front */}
            <Text
              position={[0, 0, 1.26]}
              fontSize={1.2}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Arial-Bold.woff"
            >
              1
            </Text>
            
            {/* Face 2 - right */}
            <Text
              position={[1.26, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
              fontSize={1.2}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Arial-Bold.woff"
            >
              2
            </Text>
            
            {/* Face 3 - back */}
            <Text
              position={[0, 0, -1.26]}
              rotation={[0, Math.PI, 0]}
              fontSize={1.2}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Arial-Bold.woff"
            >
              3
            </Text>
            
            {/* Face 4 - left */}
            <Text
              position={[-1.26, 0, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              fontSize={1.2}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Arial-Bold.woff"
            >
              4
            </Text>
            
            {/* Face 5 - top */}
            <Text
              position={[0, 1.26, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={1.2}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Arial-Bold.woff"
            >
              5
            </Text>
            
            {/* Face 6 - bottom */}
            <Text
              position={[0, -1.26, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              fontSize={1.2}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Arial-Bold.woff"
            >
              6
            </Text>
          </>
        )}
        
        {/* Black edges for better contrast */}
        <Box args={[2.52, 2.52, 2.52]}>
          <meshBasicMaterial 
            color="#000000" 
            transparent
            opacity={0.1}
            wireframe
          />
        </Box>
      </group>
    </group>
  );
}

interface Dice3DProps {
  onRoll: () => void;
  isRolling: boolean;
  result: number | null;
  autoRoll?: boolean;
  onToggleAutoRoll?: () => void;
}

export default function Dice3D({ onRoll, isRolling, result, autoRoll = false, onToggleAutoRoll }: Dice3DProps) {
  const [diceValue, setDiceValue] = useState(1);

  useEffect(() => {
    if (result !== null) {
      setDiceValue(result + 1); // Convert from 0-5 to 1-6
    }
  }, [result]);

  return (
    <motion.div className="flex flex-col items-center space-y-6">
      {/* Auto Roll Toggle */}
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Manual</span>
        <button
          onClick={onToggleAutoRoll}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            autoRoll ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              autoRoll ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Auto</span>
      </div>

      {/* Large 3D Dice */}
      <motion.div
        className="w-80 h-80 cursor-pointer"
        whileHover={!isRolling ? { scale: 1.02 } : {}}
        whileTap={!isRolling ? { scale: 0.98 } : {}}
        onClick={onRoll}
      >
        <Canvas
          shadows
          camera={{ position: [4, 4, 8], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          {/* Enhanced lighting for better contrast */}
          <ambientLight intensity={0.8} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.8} />
          <pointLight position={[10, -10, 10]} intensity={0.6} />
          
          {/* Dice */}
          <DiceMesh value={diceValue} isRolling={isRolling} />
          
          {/* Ground plane for shadow */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.3} />
          </mesh>
        </Canvas>
      </motion.div>
      
      {/* Current value display */}
      <div className="text-center">
        <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-2">
          {!isRolling ? diceValue : '?'}
        </div>
        <p className="text-purple-600 dark:text-purple-400 font-medium text-xl">
          {isRolling ? 'Rolling the dice...' : autoRoll ? 'Auto rolling...' : 'Click to roll!'}
        </p>
        {autoRoll && !isRolling && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Click to stop auto-rolling
          </p>
        )}
      </div>
    </motion.div>
  );
}