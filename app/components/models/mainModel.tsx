// components/ModelViewer.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { CrystallBall } from "./crystallBall";

interface CrystallViewerProps {
    animationName?: string;
    playing?: boolean;
    speed?: number;
  }
  
  const CrystallViewer = ({ 
    animationName = "Animation", 
    playing = true, 
    speed = 0.2 
  }: CrystallViewerProps) => {
  return (
    <div className="w-full h-[500px]">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <CrystallBall animationName={animationName} playing={playing} speed={speed} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default CrystallViewer;
