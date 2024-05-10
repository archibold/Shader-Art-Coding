"use client";

import { Canvas } from "@react-three/fiber";
import Cone from "@/app/components/Cone";

export default function Home() {
    return (
        <Canvas camera={{ position: [0.0, 0.0, 1.0] }}>
            <Cone />
        </Canvas>
    );
}
