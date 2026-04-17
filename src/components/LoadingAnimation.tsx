import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LoadingAnimationProps {
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Loading next round...", 
  duration = 3000,
  onComplete 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Skip WebGL check and try to initialize Three.js directly
    console.log('Initializing Three.js...');

    // Three.js setup
    const width = 300;
    const height = 300;

    try {
      console.log('Creating Three.js scene...');
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0a);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;
      
      // Clear any existing content and add renderer
      mountRef.current.innerHTML = '';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.backgroundColor = '#0a0a0a';
      mountRef.current.appendChild(renderer.domElement);
      console.log('Three.js canvas appended successfully');

      // Create 3D loading elements
      const group = new THREE.Group();

      // Rotating cube - larger and brighter
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.4,
        shininess: 100
      });
      const cube = new THREE.Mesh(geometry, material);
      group.add(cube);

      // Orbiting spheres - larger and brighter
      const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 16);
      const spheres: THREE.Mesh[] = [];
      
      for (let i = 0; i < 6; i++) {
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(i / 6, 1, 0.6),
          emissive: new THREE.Color().setHSL(i / 6, 1, 0.4),
          emissiveIntensity: 0.8
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        const angle = (i / 6) * Math.PI * 2;
        sphere.position.x = Math.cos(angle) * 3;
        sphere.position.z = Math.sin(angle) * 3;
        sphere.position.y = Math.sin(angle * 2) * 0.5;
        spheres.push(sphere);
        group.add(sphere);
      }

      scene.add(group);

      // Enhanced lighting for better visibility
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1.5);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const pointLight2 = new THREE.PointLight(0x00ffff, 1);
      pointLight2.position.set(-5, -5, -5);
      scene.add(pointLight2);

      const pointLight3 = new THREE.PointLight(0xff00ff, 0.8);
      pointLight3.position.set(0, 10, 0);
      scene.add(pointLight3);

      // Animation loop
      let animationId: number;
      let frameCount = 0;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        frameCount++;

        // Rotate cube - faster rotation
        cube.rotation.x += 0.03;
        cube.rotation.y += 0.03;

        // Orbit spheres - faster orbit
        spheres.forEach((sphere, i) => {
          const time = Date.now() * 0.002;
          const angle = (i / 6) * Math.PI * 2 + time * 1.5;
          sphere.position.x = Math.cos(angle) * 2.5;
          sphere.position.z = Math.sin(angle) * 2.5;
          sphere.position.y = Math.sin(angle * 2) * 0.5;
          sphere.rotation.y += 0.05;
        });

        renderer.render(scene, camera);
        frameRef.current = animationId;
        
        };

      animate();

      // Auto-complete after duration
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, duration);

      // Cleanup
      return () => {
        clearTimeout(timer);
        
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
        
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        sphereGeometry.dispose();
        spheres.forEach(sphere => {
          (sphere.material as THREE.Material).dispose();
        });
      };
    } catch (error) {
      console.error('Failed to initialize Three.js scene:', error);
    }
  }, [duration, onComplete]);

  return (
    <div className="loading-animation-container">
      <div className="loading-overlay">
        <div className="loading-content">
          <div ref={mountRef} className="threejs-container" />
          <div className="loading-text">
            <h2>{message}</h2>
            <div className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
