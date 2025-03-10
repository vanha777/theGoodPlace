// components/ModelViewer.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { CrystallBall } from "./crystallBall";

const CrystallViewer =() => {
  return (
    <div className="w-full h-[500px]">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <CrystallBall />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default CrystallViewer;
