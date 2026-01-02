import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Chart3DProps {
    data: Array<{
        vendor: string;
        cpu: number;
        ram: number;
        disk: number;
        price: number;
        score: number;
    }>;
    width?: number;
    height?: number;
}

const Chart3D: React.FC<Chart3DProps> = ({ data, width = 800, height = 600 }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const animationRef = useRef<number>();

    useEffect(() => {
        if (!mountRef.current || !data.length) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Grid
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        scene.add(gridHelper);

        // Axes
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        // Data visualization
        const maxScore = Math.max(...data.map(d => d.score));
        const colors = [0x3b82f6, 0x10b981, 0xf59e0b, 0xef4444, 0x8b5cf6];

        data.forEach((item, index) => {
            // Bar height based on score
            const height = (item.score / maxScore) * 8;
            
            // Bar geometry
            const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
            const material = new THREE.MeshLambertMaterial({ 
                color: colors[index % colors.length],
                transparent: true,
                opacity: 0.8
            });
            
            const bar = new THREE.Mesh(geometry, material);
            bar.position.set(
                (index - data.length / 2) * 2,
                height / 2,
                0
            );
            bar.castShadow = true;
            bar.receiveShadow = true;
            
            // Animation
            bar.scale.y = 0;
            const targetScale = 1;
            
            const animateBar = () => {
                if (bar.scale.y < targetScale) {
                    bar.scale.y += 0.02;
                    requestAnimationFrame(animateBar);
                }
            };
            
            setTimeout(() => animateBar(), index * 100);
            
            scene.add(bar);

            // Label
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.width = 256;
            canvas.height = 64;
            context.fillStyle = '#ffffff';
            context.font = '20px Arial';
            context.textAlign = 'center';
            context.fillText(item.vendor, 128, 32);
            context.fillText(`${item.score.toFixed(3)}`, 128, 52);

            const texture = new THREE.CanvasTexture(canvas);
            const labelMaterial = new THREE.SpriteMaterial({ map: texture });
            const label = new THREE.Sprite(labelMaterial);
            label.position.set(
                (index - data.length / 2) * 2,
                height + 1,
                0
            );
            label.scale.set(2, 0.5, 1);
            scene.add(label);
        });

        // Controls (simple rotation)
        let mouseX = 0;
        let mouseY = 0;
        
        const onMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        
        window.addEventListener('mousemove', onMouseMove);

        // Animation loop
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            
            // Rotate camera based on mouse
            camera.position.x = Math.cos(mouseX * Math.PI) * 15;
            camera.position.z = Math.sin(mouseX * Math.PI) * 15;
            camera.position.y = mouseY * 10 + 10;
            camera.lookAt(0, 0, 0);
            
            renderer.render(scene, camera);
        };

        mountRef.current.appendChild(renderer.domElement);
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [data, width, height]);

    return (
        <div 
            ref={mountRef} 
            className="rounded-xl overflow-hidden border border-dark-700 bg-dark-800"
            style={{ width, height }}
        />
    );
};

export default Chart3D;
