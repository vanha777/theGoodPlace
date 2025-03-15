// components/ModelViewer.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Suspense, useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import { CrystallBall } from "./crystallBall";
import ChatSimulatorV2 from "./ChatSimulatorV2";
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletMultiButtonDynamic } from "../NavBar";
import { useAppContext } from "@/app/utils/AppContext";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

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
    const { userData } = useAppContext();
    const { publicKey, connected, connect, disconnect, signMessage, wallet } = useWallet();
    const { connection } = useConnection();
    const [action, setAction] = useState<string | null>(null);
    // Add state to manage camera position and speed
    const [currentSpeed, setCurrentSpeed] = useState(speed);
    const [showOverlay, setShowOverlay] = useState(true);

    // Use spring for smooth camera animation
    const [cameraProps, setCameraProps] = useSpring(() => ({
        position: cameraPosition,
        fov: cameraFov,
        config: { 
            mass: 4,             // Significantly increased mass for slower movement
            tension: 40,         // Much lower tension for extended transition time
            friction: 35,        // Higher friction for controlled movement
            precision: 0.0001,   // Even higher precision for smoother finish
            clamp: false,        // Allow slight overshooting for natural feel
            velocity: 0,         // Start with zero velocity
            duration: 25000       // Set a minimum duration in milliseconds
        },
    }));

    useEffect(() => {
        console.log("userData.derivedPda", userData.derivedPda);
        if (userData.derivedPda !== null) {
            // Wait 3 seconds then set action to "talk"
            const timer = setTimeout(() => {
                setAction("talk");
                console.log("Setting action to talk after 3 second delay");
            }, 2000);

            // Clean up the timer when component unmounts or dependencies change
            return () => clearTimeout(timer);
        }
    }, [userData.derivedPda]);

    useEffect(() => {
        if (action === "talk") {
            setCameraProps({ position: [0, 0, 16] });
        } else if (action === "create") {
            setCameraProps({ position: [0, 0, 3] });
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
        }, 2500);
    };

    const resetView = () => {
        setCurrentSpeed(1);
        // Smooth transition back
        setCameraProps({ position: [0, 0, 16] });

        setTimeout(() => {
            setCurrentSpeed(0.2);
        }, 2500);
    };

    const talkingView = () => {
        setCurrentSpeed(2);
        // Smooth transition to talking view
        // setCameraProps({ position: [0, 0, 2.5] });

        setTimeout(() => {
            setCurrentSpeed(0.2);
        }, 3500);
    };

    // Function to open explorer in new tab
    const openExplorer = () => {
        if (userData.derivedPda) {
            window.open(`https://explorer.sonic.game/address/${userData.derivedPda}?cluster=testnet.v1`, '_blank');
        } else {
            console.error("No derivedPda available");
            // Optionally show a notification to the user
        }
    };

    // Add this function to handle continue button click
    const handleContinue = () => {
        setShowOverlay(false);
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
                {/* Main content always rendered */}
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
                        Initialize
                    </button>
                    <button
                        onClick={openExplorer}
                        className={`px-4 py-2 rounded-lg transition-all bg-gray-800 text-gray-300 hover:bg-gray-700 ${!userData.derivedPda ? 'opacity-50 cursor-not-allowed' : ''} flex items-center gap-2`}
                        disabled={!userData.derivedPda}
                        title={userData.derivedPda ? "View your blockchain storage" : "Connect wallet to view storage"}
                    >
                        {/* Sonic Logo */}
                        <img 
                            src="/sonic.jpg" 
                            alt="Sonic" 
                            className="h-5 w-5 rounded-full object-cover"
                        />
                        Explorer
                    </button>
                </div>
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
                
                {/* Overlay that appears on top when showOverlay is true */}
                {showOverlay && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/90"
                    >
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative bg-black/80 border border-[#00d9ff]/30 rounded-xl p-8 shadow-lg overflow-hidden max-w-md"
                        >
                            {/* Simple scanning line */}
                            <motion.div
                                className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent"
                                animate={{ 
                                    top: ["0%", "100%"],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 3,
                                    ease: "linear" 
                                }}
                            />
                            
                            {/* Logo/icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00ffe1] via-[#00d9ff] to-[#00a3ff] p-[2px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                        <img 
                                            src="/sonic.jpg" 
                                            alt="Sonic" 
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <motion.h2 
                                className="text-2xl font-semibold text-white text-center mb-4"
                            >
                                Welcome to Sonic Good Place
                            </motion.h2>
                            
                            <motion.p 
                                className="text-gray-300 mb-6 text-center"
                            >
                                You will interact with our Good Place Agent, who will assist you to create, 
                                update and store your persona forever on chain, and interact with our MVP clone interfaces.
                            </motion.p>
                            
                            {/* Simple button */}
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleContinue}
                                className="w-full py-3 px-6 bg-gradient-to-r from-[#00ffe1] via-[#00d9ff] to-[#00a3ff] text-black font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <span>Continue</span>
                                <FiArrowRight />
                            </motion.button>
                            
                            {/* Simple status text */}
                            <p className="text-gray-500 text-xs text-center mt-6">
                                Powered by Sonic blockchain technology
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </>
    );
});

export default CrystallViewer;
