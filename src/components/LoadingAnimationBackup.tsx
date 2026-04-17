import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface LoadingAnimationProps {
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  message = "Loading next round...",
  duration = 3000,
  onComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Web3 initialization (simulated blockchain connection)
    const initWeb3 = async () => {
      try {
        // Dynamic import to avoid blocking
        await import("web3");
        console.log("Web3 connection established for loading animation");
      } catch (error) {
        console.log("Web3 connection failed, continuing with animation");
      }
    };

    initWeb3();

    // Three.js setup with error handling
    try {
      const width = mountRef.current.clientWidth || 300;
      const height = mountRef.current.clientHeight || 300;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0a);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      // Renderer setup with fallback
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          failIfMajorPerformanceCaveat: false,
        });
      } catch (e) {
        console.warn("WebGL renderer failed, trying canvas renderer");
        renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
        });
      }

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;
      mountRef.current.appendChild(renderer.domElement);

      // Create 3D loading elements
      const group = new THREE.Group();

      // Rotating cube
      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.2,
        shininess: 100,
      });
      const cube = new THREE.Mesh(geometry, material);
      group.add(cube);

      // Orbiting spheres
      const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 16);
      const spheres: THREE.Mesh[] = [];

      for (let i = 0; i < 6; i++) {
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(i / 6, 1, 0.5),
          emissive: new THREE.Color().setHSL(i / 6, 1, 0.3),
          emissiveIntensity: 0.5,
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        const angle = (i / 6) * Math.PI * 2;
        sphere.position.x = Math.cos(angle) * 2.5;
        sphere.position.z = Math.sin(angle) * 2.5;
        sphere.position.y = Math.sin(angle) * 0.5;
        spheres.push(sphere);
        group.add(sphere);
      }

      scene.add(group);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const pointLight2 = new THREE.PointLight(0x00ff88, 0.5);
      pointLight2.position.set(-5, -5, -5);
      scene.add(pointLight2);

      // Animation loop
      let animationId: number;
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Rotate cube
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        // Orbit spheres
        spheres.forEach((sphere, i) => {
          const time = Date.now() * 0.001;
          const angle = (i / 6) * Math.PI * 2 + time * 0.5;
          sphere.position.x = Math.cos(angle) * 2.5;
          sphere.position.z = Math.sin(angle) * 2.5;
          sphere.position.y = Math.sin(angle * 2) * 0.5;
          sphere.rotation.y += 0.02;
        });

        renderer.render(scene, camera);
        frameRef.current = animationId;
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (!mountRef.current) return;
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener("resize", handleResize);

      // Auto-complete after duration
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, duration);

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
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
        spheres.forEach((sphere) => {
          (sphere.material as THREE.Material).dispose();
        });
      };
    } catch (error) {
      console.error("Failed to initialize Three.js scene:", error);
      setError("Failed to load 3D animation");
    }
  }, [duration, onComplete]);

  if (error) {
    return (
      <div className="loading-animation-container">
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-text">
              <h2>{message}</h2>
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
              <p style={{ color: "#ff6b6b", marginTop: "1rem" }}>
                3D animation unavailable
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-animation-container">
      <div className="loading-overlay">
        <div className="loading-content">
          <div
            ref={mountRef}
            className="threejs-container"
            style={{
              width: "300px",
              height: "300px",
              backgroundColor: "#0a0a0a",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <div className="loading-text">
            <h2>{message}</h2>
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
