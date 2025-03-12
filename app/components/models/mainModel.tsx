// components/ModelViewer.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Suspense, useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import { CrystallBall } from "./crystallBall";
import ChatSimulatorV2 from "./ChatSimulatorV2";
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletMultiButtonDynamic } from "../NavBar";

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

// First, create an animated camera component
const AnimatedPerspectiveCamera = animated(PerspectiveCamera);

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
    const { publicKey, connected, connect, disconnect, signMessage, wallet } = useWallet();
    const { connection } = useConnection();
    const [action, setAction] = useState("talk");
    // Add state to manage camera position and speed
    const [currentSpeed, setCurrentSpeed] = useState(speed);
    
    // Use spring for smooth camera animation
    const [cameraProps, setCameraProps] = useSpring(() => ({
        position: cameraPosition,
        fov: cameraFov,
        config: { mass: 1, tension: 120, friction: 14 }, // Adjust for desired feel
    }));

    useEffect(() => {
        if (action === "talk") {
            setCameraProps({ position: [0, 0, 16] });
        } else if (action === "create") {
            setCameraProps({ position: [0, 0, 2.5] });
        }
    }, [action, setCameraProps]);

    const createUpdateView = () => {
        setCurrentSpeed(1);
        // First transition
        setCameraProps({ position: [0, 0, 5] }); // Intermediate position
        
        // Second transition after delay
        setTimeout(() => {
            setCameraProps({ position: [0, 0, 0.8] });
            setCurrentSpeed(0.2);
        }, 1000);
    };

    const resetView = () => {
        setCurrentSpeed(1);
        // Smooth transition back
        setCameraProps({ position: [0, 0, 16] });
        
        setTimeout(() => {
            setCurrentSpeed(0.2);
        }, 1000);
    };

    const talkingView = () => {
        setCurrentSpeed(1);
        // Smooth transition to talking view
        setCameraProps({ position: [0, 0, 2.5] });
        
        setTimeout(() => {
            setCurrentSpeed(0.2);
        }, 1000);
    };

    // Export functions if needed
    useImperativeHandle(ref, () => ({
        createUpdateView,
        resetView,
        talkingView
    }));

    return (
        <>
            <div className="w-full relative h-full bg-black pt-40 pb-40">
                <>
                    <div className="flex justify-center gap-4 mb-6">
                        <button 
                            onClick={() => setAction("talk")} 
                            className={`px-4 py-2 rounded-lg transition-all ${action === "talk" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                        >
                            Communicate
                        </button>
                        <button 
                            onClick={() => setAction("create")} 
                            className={`px-4 py-2 rounded-lg transition-all ${action === "create" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                        >
                            Create
                        </button>
                    </div>
                </>
                <div className="w-full h-[800px]">
                    <Canvas className="bg-black" gl={{ alpha: false }}>
                        {/* Animated camera */}
                        <AnimatedPerspectiveCamera
                            makeDefault
                            position={cameraProps.position}
                            fov={cameraProps.fov}
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
                <div className="absolute bottom-40 left-0 right-0">
                    {connected ? (
                        <ChatSimulatorV2 action={action} createUpdateView={createUpdateView} resetView={resetView} talkingView={talkingView} />
                    ) : (
                        <div className="text-center p-6 backdrop-blur-sm bg-black/30 max-w-md mx-auto rounded-lg">
                            {/* <h2 className="text-2xl font-light text-white mb-3">Connect to Experience</h2> */}
                            <p className="text-gray-400 mb-5 text-sm">Interract with your love ones</p>
                            <p className="text-gray-400 mb-5 text-sm">Coming Soon</p>
                            <WalletMultiButtonDynamic
                                style={{
                                    // background: "linear-gradient(to right, #00ffe1, #00d9ff, #00a3ff)",
                                    background: "transparent",
                                    color: "#ffffff",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 0 15px rgba(0, 217, 255, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backdropFilter: "blur(4px)"
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
});

export default CrystallViewer;
