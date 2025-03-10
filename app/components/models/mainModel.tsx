// components/ModelViewer.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Suspense, useState, useImperativeHandle, forwardRef } from "react";
import { CrystallBall } from "./crystallBall";
import ChatSimulatorV2 from "./ChatSimulatorV2";

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

// not used - cameraPosition = [0, 0, 16],
// create/update person -      cameraPosition = [0, 0, 0.8],
// talking - cameraPosition = [0, 0, 2.5],
// loading -  speed = 1,
// not loading  -  speed = 0.2,

const CrystallViewer = forwardRef<{
    createUpdateView: () => void;
    resetView: () => void;
    talkingView: () => void;
}>(({
    animationName = "Animation",
    playing = true,
    speed = 0.2,
    // Default camera settings
    cameraPosition = [0, 0, 16],
    cameraFov = 50,
    enableZoom = false,
    autoRotate = false,
    autoRotateSpeed = 1,
    minDistance = 2,
    maxDistance = 10
}: CrystallViewerProps, ref) => {
    // Add state to manage camera position and speed
    const [currentSpeed, setCurrentSpeed] = useState(speed);
    const [currentCameraPosition, setCurrentCameraPosition] = useState<[number, number, number]>(cameraPosition);

    const createUpdateView = () => {
        setCurrentSpeed(1);
        // wait 2 seconds
        setTimeout(() => {
            setCurrentCameraPosition([0, 0, 0.8]);
            setCurrentSpeed(0.2);
        }, 2000);
    }
    
    const resetView = () => {
        setCurrentSpeed(1);
        // wait 2 seconds
        setTimeout(() => {
            setCurrentCameraPosition([0, 0, 16]);
            setCurrentSpeed(0.2);
        }, 2000);
    }
    
    const talkingView = () => {
        setCurrentSpeed(1);
        // wait 2 seconds
        setTimeout(() => {
            setCurrentCameraPosition([0, 0, 2.5]);
            setCurrentSpeed(0.2);
        }, 2000);
    }

    // Export functions if needed
    useImperativeHandle(ref, () => ({
        createUpdateView,
        resetView,
        talkingView
    }));

    return (
        <div className="w-full h-[500px]">
            <Canvas className="bg-black" gl={{ alpha: false }}>
                {/* Configurable camera */}
                <PerspectiveCamera
                    makeDefault
                    position={currentCameraPosition}
                    fov={cameraFov}
                />
                {/* Lighting */}
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {/* Crystal Ball */}
                <Suspense fallback={null}>
                    <CrystallBall animationName={animationName} playing={playing} speed={currentSpeed} />
                </Suspense>
                <OrbitControls
                    enableRotate={false}
                    enablePan={false}
                    enableZoom={false}
                />
            </Canvas>
        </div>
    );
});

export default CrystallViewer;
