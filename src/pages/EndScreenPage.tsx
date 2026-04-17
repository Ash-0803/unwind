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
    try {
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
      } else {
        setIsDraw(false);
        setWinner(null);
      }
    } catch (error) {
      console.error('Error determining winner:', error);
      setIsDraw(false);
      setWinner(null);
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
    
    // Trophy cup
    const cupGeometry = new THREE.CylinderGeometry(2, 1.5, 3, 32);
    const cupMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFD700,
      emissive: 0xFFD700,
      emissiveIntensity: 0.2,
      shininess: 100
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.y = 2;
    trophyGroup.add(cup);

    // Trophy handles
    const handleGeometry = new THREE.TorusGeometry(0.8, 0.2, 8, 16);
    const handleMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFD700,
      emissive: 0xFFD700,
      emissiveIntensity: 0.1
    });
    
    const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    leftHandle.position.set(-2.5, 2, 0);
    leftHandle.rotation.z = Math.PI / 2;
    trophyGroup.add(leftHandle);
    
    const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    rightHandle.position.set(2.5, 2, 0);
    rightHandle.rotation.z = Math.PI / 2;
    trophyGroup.add(rightHandle);

    // Trophy base
    const baseGeometry = new THREE.CylinderGeometry(3, 3, 1, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      emissive: 0x8B4513,
      emissiveIntensity: 0.1
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.5;
    trophyGroup.add(base);

    scene.add(trophyGroup);

    // Create confetti
    const confetti: ConfettiParticle[] = [];
    const confettiColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
    
    for (let i = 0; i < 100; i++) {
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshPhongMaterial({
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)]
      });
      const particle = new THREE.Mesh(geometry, material) as unknown as ConfettiParticle;
      
      particle.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 20 - 5,
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
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate trophy
      trophyGroup.rotation.y += 0.01;
      
      // Animate confetti
      if (confettiActive) {
        confetti.forEach(particle => {
          particle.position.add(particle.velocity);
          particle.rotation.x += particle.rotationSpeed.x;
          particle.rotation.y += particle.rotationSpeed.y;
          particle.rotation.z += particle.rotationSpeed.z;
          
          // Reset confetti that falls too low
          if (particle.position.y < -10) {
            particle.position.y = 20;
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
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cupGeometry.dispose();
      cupMaterial.dispose();
      handleGeometry.dispose();
      handleMaterial.dispose();
      baseGeometry.dispose();
      baseMaterial.dispose();
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
            ) : winner ? (
              <>
                <span className="winner-name" style={{ color: winner.color }}>
                  {winner.name}
                </span> Wins! 
              </>
            ) : (
              <>
                <span className="winner-name">Loading...</span>
              </>
            )}
          </h1>
          <div className="final-score">
            {isDraw ? (
              `Final Score: ${teams[0]?.score || 0} - ${teams[1]?.score || 0}`
            ) : winner ? (
              <>Final Score: <span style={{ color: winner.color }}>{winner.score}</span></>
            ) : (
              <>Final Score: Loading...</>
            )}
          </div>
        </div>

        <div ref={mountRef} className="trophy-container" />

        <div className="final-standings">
          <h2>Final Standings</h2>
          <div className="standings-list">
            {teams && teams.length > 0 ? (
              teams
                .sort((a, b) => (b?.score || 0) - (a?.score || 0))
                .map((team, index) => (
                  <div key={team?.id || `team-${index}`} className="standing-item">
                    <div className="standing-rank">
                      {index === 0 ? '??' : index === 1 ? '??' : index === 2 ? '??' : `${index + 1}.`}
                    </div>
                    <div className="standing-team" style={{ color: team?.color || '#666' }}>
                      {team?.name || 'Unknown Team'}
                    </div>
                    <div className="standing-score">
                      {team?.score || 0}
                    </div>
                  </div>
                ))
            ) : (
              <div className="standing-item">
                <div className="standing-rank">-</div>
                <div className="standing-team">No teams available</div>
                <div className="standing-score">0</div>
              </div>
            )}
          </div>
        </div>

        <div className="end-screen-actions">
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleNewGame}
          >
            New Game 
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
            {confettiActive ? '??' : '??'} Toggle Confetti
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndScreenPage;
