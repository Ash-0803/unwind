import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import type { Team } from '../types';

// Extend THREE.Mesh to include custom properties for confetti particles
interface ConfettiParticle extends THREE.Mesh {
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
}

interface EndScreenPageProps {
  teams: Team[];
  onNewGame?: () => void;
}

const EndScreenPage: React.FC<EndScreenPageProps> = ({ teams, onNewGame }) => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement>(null);
  const [winner, setWinner] = useState<Team | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [confettiActive, setConfettiActive] = useState(true);

  useEffect(() => {
    // Determine winner or draw
    if (teams.length > 0) {
      const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
      const topTeam = sortedTeams[0];
      
      // Check if it's a draw (top two teams have same score)
      if (sortedTeams.length > 1 && sortedTeams[1].score === topTeam.score) {
        setIsDraw(true);
        setWinner(null);
      } else {
        setIsDraw(false);
        setWinner(topTeam);
      }
    }
  }, [teams]);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Only run Three.js if there's a winner or it's a draw
    if (!winner && !isDraw) return;

    // Three.js celebration scene
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create trophy
    const trophyGroup = new THREE.Group();

    // Trophy base
    const baseGeometry = new THREE.CylinderGeometry(2, 2.5, 0.5, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.1
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -2;
    trophyGroup.add(base);

    // Trophy cup
    const cupGeometry = new THREE.CylinderGeometry(1.5, 1, 2, 32);
    const cupMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.2,
      shininess: 100
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.y = -0.5;
    trophyGroup.add(cup);

    // Trophy handles
    const handleGeometry = new THREE.TorusGeometry(0.5, 0.1, 8, 16);
    const handleMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.1
    });

    const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    leftHandle.position.set(-1.5, -0.5, 0);
    leftHandle.rotation.y = Math.PI / 2;
    trophyGroup.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    rightHandle.position.set(1.5, -0.5, 0);
    rightHandle.rotation.y = Math.PI / 2;
    trophyGroup.add(rightHandle);

    // Add winner's color accent
    if (winner.color) {
      const accentGeometry = new THREE.RingGeometry(1.6, 1.8, 32);
      const accentMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(winner.color),
        emissive: new THREE.Color(winner.color),
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide
      });
      const accent = new THREE.Mesh(accentGeometry, accentMaterial);
      accent.position.y = 0.5;
      accent.rotation.x = Math.PI / 2;
      trophyGroup.add(accent);
    }

    scene.add(trophyGroup);

    // Create confetti particles
    const confettiCount = 200;
    const confetti: ConfettiParticle[] = [];
    const confettiColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500, 0xff69b4];

    for (let i = 0; i < confettiCount; i++) {
      const geometry = Math.random() > 0.5 
        ? new THREE.BoxGeometry(0.1, 0.1, 0.1)
        : new THREE.SphereGeometry(0.05, 8, 6);
      
      const material = new THREE.MeshPhongMaterial({
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        emissive: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        emissiveIntensity: 0.2
      });
      
      const particle = new THREE.Mesh(geometry, material) as unknown as ConfettiParticle;
      particle.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 10 + 5,
        (Math.random() - 0.5) * 20
      );
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        -Math.random() * 0.1 - 0.05,
        (Math.random() - 0.5) * 0.1
      );
      particle.rotationSpeed = new THREE.Vector3(
        Math.random() * 0.1,
        Math.random() * 0.1,
        Math.random() * 0.1
      );
      confetti.push(particle);
      scene.add(particle);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 10, 10);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.2;
    scene.add(spotLight);

    const coloredLight = new THREE.PointLight(winner ? new THREE.Color(winner.color) : 0xffffff, 0.5);
    coloredLight.position.set(-5, 5, 5);
    scene.add(coloredLight);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate trophy
      trophyGroup.rotation.y += 0.005;
      trophyGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2;

      // Animate confetti
      if (confettiActive) {
        confetti.forEach((particle) => {
          particle.position.add(particle.velocity);
          particle.rotation.x += particle.rotationSpeed.x;
          particle.rotation.y += particle.rotationSpeed.y;
          particle.rotation.z += particle.rotationSpeed.z;

          // Reset particle if it falls too low
          if (particle.position.y < -5) {
            particle.position.y = 10;
            particle.position.x = (Math.random() - 0.5) * 20;
            particle.position.z = (Math.random() - 0.5) * 20;
          }
        });
      }

      renderer.render(scene, camera);
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

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      baseGeometry.dispose();
      baseMaterial.dispose();
      cupGeometry.dispose();
      cupMaterial.dispose();
      handleGeometry.dispose();
      handleMaterial.dispose();
      confetti.forEach(particle => {
        particle.geometry.dispose();
        (particle.material as THREE.Material).dispose();
      });
    };
  }, [winner, isDraw, confettiActive]);

  const handleNewGame = () => {
    if (onNewGame) {
      onNewGame();
    } else {
      navigate('/teams');
    }
  };

  if (!winner && !isDraw) {
    return (
      <div className="page center-empty">
        <div className="empty-state">
          <div className="empty-icon">?</div>
          <h2>Determining Winner...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page end-screen">
      <div className="end-screen-content">
        <div className="celebration-header">
          <h1 className="winner-title">
            {isDraw ? (
              <>
                <span className="winner-name">It's a Draw!</span>
              </>
            ) : (
              <>
                <span className="winner-name" style={{ color: winner.color }}>
                  {winner.name}
                </span> Wins! 
              </>
            )}
          </h1>
          <div className="final-score">
            {isDraw ? (
              `Final Score: ${teams[0]?.score || 0} - ${teams[1]?.score || 0}`
            ) : (
              <>Final Score: <span style={{ color: winner.color }}>{winner.score}</span></>
            )}
          </div>
        </div>

        <div ref={mountRef} className="trophy-container" />

        <div className="final-standings">
          <h2>Final Standings</h2>
          <div className="standings-list">
            {teams
              .sort((a, b) => b.score - a.score)
              .map((team, index) => (
                <div key={team.id} className="standing-item">
                  <div className="standing-rank">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </div>
                  <div className="standing-team" style={{ color: team.color }}>
                    {team.name}
                  </div>
                  <div className="standing-score">
                    {team.score}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="end-screen-actions">
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleNewGame}
          >
            New Game 🎮
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
          <button 
            className="btn btn-ghost"
            onClick={() => setConfettiActive(!confettiActive)}
          >
            {confettiActive ? '🎊' : '🎊'} Toggle Confetti
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndScreenPage;
