"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles, Stars, MeshTransmissionMaterial, ContactShadows, useCursor } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

// --- ELEGANT BUNNY COMPONENT ---
function ElegantBunny() {
    const group = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const eyesRef = useRef<THREE.Group>(null);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    const [blink, setBlink] = useState(false);
    useEffect(() => {
        const blinkLoop = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(blinkLoop);
    }, []);

    useFrame((state) => {
        const { mouse } = state;
        if (headRef.current) {
            const rx = -mouse.y * 0.2;
            const ry = mouse.x * 0.4;
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, rx, 0.05);
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, ry, 0.05);
        }
        if (eyesRef.current) {
            const ex = mouse.x * 0.1;
            const ey = mouse.y * 0.1;
            eyesRef.current.position.x = THREE.MathUtils.lerp(eyesRef.current.position.x, ex, 0.1);
            eyesRef.current.position.y = THREE.MathUtils.lerp(eyesRef.current.position.y, ey + 0.1, 0.1);
        }
    });

    return (
        <group
            ref={group}
            scale={1.4}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <group ref={headRef}>

                {/* HEAD: Porcelain - Optimized Geometry */}
                <mesh>
                    {/* Reduced segments from 64 to 32 for mobile performance (visually identical) */}
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#db00f3ff"
                        roughness={0.15}
                        metalness={0.1}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        transmission={0}
                        reflectivity={1}
                        emissive="#8c00ffff"
                        emissiveIntensity={0.1}
                    />
                </mesh>

                {/* --- FACE FEATURES --- */}
                <group ref={eyesRef} position={[0, 0.1, 0.92]}>

                    {/* LEFT EYE (Anime Style) */}
                    <group position={[-0.35, 0, 0]}>
                        <mesh scale={[1, blink ? 0.1 : 1, 1]} rotation={[0.1, 0, 0]}>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshStandardMaterial color="#0a000a" roughness={0} />
                        </mesh>
                        {/* Top Highlight */}
                        <mesh position={[0.08, 0.08, 0.12]} scale={blink ? 0 : 1}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshBasicMaterial color="white" />
                        </mesh>
                        {/* Bottom Crescent */}
                        <mesh position={[0, -0.05, 0.11]} scale={blink ? 0 : [0.8, 0.6, 0.1]}>
                            <sphereGeometry args={[0.08]} />
                            <meshBasicMaterial color="#301030" transparent opacity={0.6} />
                        </mesh>
                    </group>

                    {/* RIGHT EYE */}
                    <group position={[0.35, 0, 0]}>
                        <mesh scale={[1, blink ? 0.1 : 1, 1]} rotation={[0.1, 0, 0]}>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshStandardMaterial color="#0a000a" roughness={0} />
                        </mesh>
                        <mesh position={[0.08, 0.08, 0.12]} scale={blink ? 0 : 1}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshBasicMaterial color="white" />
                        </mesh>
                        <mesh position={[0, -0.05, 0.11]} scale={blink ? 0 : [0.8, 0.6, 0.1]}>
                            <sphereGeometry args={[0.08]} />
                            <meshBasicMaterial color="#301030" transparent opacity={0.6} />
                        </mesh>
                    </group>

                    <group position={[0, -0.2, 0.08]} scale={0.8}>
                        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, -2.5]}>
                            <torusGeometry args={[0.1, 0.02, 12, 24, 2.5]} />
                            <meshBasicMaterial color="#FF4DA6" />
                        </mesh>
                        <mesh position={[0.1, 0, 0]} rotation={[0, 0, -3.2]}>
                            <torusGeometry args={[0.1, 0.02, 12, 24, 2.5]} />
                            <meshBasicMaterial color="#FF4DA6" />
                        </mesh>
                    </group>

                    <mesh position={[0, -0.12, 0.1]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshPhysicalMaterial color="#FF4DA6" roughness={0.4} />
                    </mesh>

                    {/* CHEEKS */}
                    <mesh position={[-0.6, -0.15, -0.1]} scale={[1.2, 0.8, 1]}>
                        <sphereGeometry args={[0.22, 16, 16]} />
                        <meshBasicMaterial color="#ff9ec3" transparent opacity={0.3} depthWrite={false} />
                    </mesh>
                    <mesh position={[0.6, -0.15, -0.1]} scale={[1.2, 0.8, 1]}>
                        <sphereGeometry args={[0.22, 16, 16]} />
                        <meshBasicMaterial color="#ff9ec3" transparent opacity={0.3} depthWrite={false} />
                    </mesh>

                </group>


                {/* --- EARS -- */}
                <group position={[-0.65, 0.85, -0.3]} rotation={[0.1, 0, -0.4]}>
                    <mesh position={[0, 0.6, 0]}>
                        <capsuleGeometry args={[0.22, 1.2, 8, 16]} />
                        <MeshTransmissionMaterial
                            backside
                            thickness={0.2}
                            roughness={0.1}
                            anisotropy={0.1}
                            chromaticAberration={0.2}
                            color="#fff0ff"
                            samples={6} // Optimization: Limit samples
                            resolution={512} // Optimization: Limit texture resolution
                        />
                    </mesh>
                    <mesh position={[0, 0.5, 0]}>
                        <capsuleGeometry args={[0.08, 0.8, 4, 8]} />
                        <meshBasicMaterial color="#FF4DA6" toneMapped={false} />
                    </mesh>
                </group>

                <group position={[0.65, 0.85, -0.3]} rotation={[0.1, 0, 0.4]}>
                    <mesh position={[0, 0.6, 0]}>
                        <capsuleGeometry args={[0.22, 1.2, 8, 16]} />
                        <MeshTransmissionMaterial
                            backside
                            thickness={0.2}
                            roughness={0.1}
                            anisotropy={0.1}
                            chromaticAberration={0.2}
                            color="#f0f0ff"
                            samples={6}
                            resolution={512}
                        />
                    </mesh>
                    <mesh position={[0, 0.5, 0]}>
                        <capsuleGeometry args={[0.08, 0.8, 4, 8]} />
                        <meshBasicMaterial color="#9B5CFF" toneMapped={false} />
                    </mesh>
                </group>

            </group>

            <mesh position={[0, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.1, 0.015, 16, 64]} />
                <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
            </mesh>

        </group>
    )
}

export function HeroScene() {
    return (
        <div className="absolute inset-0 z-0 w-full h-full bg-black">
            {/* Optimization: Cap DPR at 2. Main performance saver for mobile */}
            <Canvas dpr={[1, 2]} eventSource={typeof window !== 'undefined' ? window.document.body : undefined}>
                <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={35} />
                <color attach="background" args={['#000000']} />
                <ambientLight intensity={0.4} color="#ffd1dc" />
                <spotLight position={[5, 5, 5]} angle={0.5} penumbra={1} intensity={15} color="#fff" />
                <spotLight position={[-5, 5, -5]} angle={0.5} penumbra={1} intensity={20} color="#FF4DA6" />
                <spotLight position={[5, -5, -5]} angle={0.5} penumbra={1} intensity={20} color="#9B5CFF" />
                <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
                    <ElegantBunny />
                </Float>
                <Sparkles count={30} scale={8} size={2} speed={0.2} opacity={0.4} color="#FFF" />
                <Stars radius={100} depth={50} count={1000} factor={3} saturation={0} fade speed={1} />
                <fog attach="fog" args={['#000000', 8, 20]} />
            </Canvas>
        </div>
    );
}
