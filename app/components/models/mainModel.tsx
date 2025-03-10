// components/ModelViewer.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { CrystallBall } from "./crystallBall";

interface CrystallViewerProps {
    animationName?: string;
    playing?: boolean;
    speed?: number;
    // Camera props
    cameraPosition?: [number, number, number];
    cameraFov?: number;
    enableZoom?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    minDistance?: number;
    maxDistance?: number;
}

const CrystallViewer = ({
    animationName = "Animation",
    playing = true,
    speed = 0.2,
    // Default camera settings
    cameraPosition = [0, 16, 5],
    cameraFov = 50,
    enableZoom = true,
    autoRotate = false,
    autoRotateSpeed = 1,
    minDistance = 2,
    maxDistance = 10
}: CrystallViewerProps) => {
    return (
        <div className="w-full h-[500px]">
            <Canvas>
                {/* Configurable camera */}
                <PerspectiveCamera
                    makeDefault
                    position={cameraPosition}
                    fov={cameraFov}
                />
                {/* Lighting */}
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {/* Crystal Ball */}
                <Suspense fallback={null}>
                    <CrystallBall animationName={animationName} playing={playing} speed={speed} />
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default CrystallViewer;
