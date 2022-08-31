import { Suspense } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import {  GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'

const Model = ({modelSrc, position}) => {
    const model = useLoader( GLTFLoader, modelSrc );
    
    
    let mixer
    if (model.animations.length) {
        mixer = new THREE.AnimationMixer(model.scene);
        model.animations.forEach(clip => {
            const action = mixer.clipAction(clip)
            action.play();
        });
    }

    useFrame((state, delta) => {
        mixer?.update(delta)
    })

    model.scene.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            child.material.side = THREE.FrontSide
        }
    })
    

    return (
        <primitive 
            object={model.scene}
            scale={10}             // 10
            position={position} // [40, 20, 0]
        />
    )
}

export const Animation = ({modelSrc, camera, position, modelPosition}) => {
  return (
    <Canvas style={{'position': position, 'left': '0', 'top': '0' }}>
        <Suspense>
            <spotLight angle={1} position={[-80, 200, -100]} intensity={0.5} />
            <spotLight angle={1} position={[120, 40, 60]} intensity={1} />
            <Model modelSrc={modelSrc} position={modelPosition} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.25} makeDefault />
        <PerspectiveCamera makeDefault position={camera} fov={35} />
    </Canvas>  
  )

}
