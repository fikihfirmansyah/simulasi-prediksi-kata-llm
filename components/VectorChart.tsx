import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { VectorDictionary, Vector } from '../types';

interface VectorChartProps {
  dictionary: VectorDictionary;
  highlightedWord: string | null;
  targetContext: Vector | null;
}

const VectorChart: React.FC<VectorChartProps> = ({ dictionary, highlightedWord, targetContext }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  // FIX: Use refs to hold Three.js objects so they can be accessed across useEffect hooks.
  const sceneRef = useRef<THREE.Scene | null>(null);
  const dataGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(1, 1, 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setClearColor(0x111827); // bg-gray-900
    currentMount.appendChild(renderer.domElement);
    
    // Label Renderer
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( currentMount.clientWidth, currentMount.clientHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    currentMount.appendChild( labelRenderer.domElement );

    // Controls
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(1.5);
    scene.add(axesHelper);
    
    // Axis Labels
    const createAxisLabel = (text: string, position: [number, number, number], color: string) => {
        const div = document.createElement('div');
        div.className = 'label';
        div.textContent = text;
        div.style.color = color;
        const label = new CSS2DObject(div);
        label.position.set(...position);
        return label;
    };
    scene.add(createAxisLabel('Alam (X)', [1.6, 0, 0], '#ef4444')); // red-500
    scene.add(createAxisLabel('Emosi (Y)', [0, 1.6, 0], '#22c55e')); // green-500
    scene.add(createAxisLabel('Aksi (Z)', [0, 0, 1.6], '#3b82f6')); // blue-500

    // Data group to easily clear and add points
    const dataGroup = new THREE.Group();
    dataGroupRef.current = dataGroup;
    scene.add(dataGroup);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();
    
    // Resize handler
    const handleResize = () => {
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        labelRenderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
        currentMount.removeChild(labelRenderer.domElement);
      }
    };
  }, []);
  
  // Effect to update points when data changes
  useEffect(() => {
      // FIX: Access scene and dataGroup from refs. This resolves the "Cannot find name 'renderer'" error by correctly managing scene objects.
      const scene = sceneRef.current;
      const dataGroup = dataGroupRef.current;
      if (!scene || !dataGroup) return;

      // Clear previous objects
      while(dataGroup.children.length > 0){ 
          dataGroup.remove(dataGroup.children[0]); 
      }

      // Geometries and Materials
      const wordSphereGeo = new THREE.SphereGeometry(0.03, 16, 16);
      const targetBoxGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);

      const defaultMat = new THREE.MeshLambertMaterial({ color: 0x0ea5e9 }); // sky-500
      const highlightedMat = new THREE.MeshLambertMaterial({ color: 0x84cc16 }); // lime-500
      const targetMat = new THREE.MeshLambertMaterial({ color: 0xf97316 }); // orange-500

      // Add word vectors
      // FIX: Refactor from Object.entries to Object.keys to fix a TypeScript type inference issue, preventing the "must have a '[Symbol.iterator]()' method" error.
      Object.keys(dictionary).forEach(word => {
          const vector = dictionary[word];
          const isHighlighted = word === highlightedWord;
          const material = isHighlighted ? highlightedMat : defaultMat;
          const sphere = new THREE.Mesh(wordSphereGeo, material);
          sphere.position.set(...vector);
          dataGroup.add(sphere);

          // Add label
          const wordDiv = document.createElement('div');
          wordDiv.className = 'label';
          wordDiv.textContent = word;
          if (isHighlighted) {
            wordDiv.style.color = '#84cc16'; // lime-500
            wordDiv.style.fontSize = '16px';
            wordDiv.style.fontWeight = 'bold';
          }
          const wordLabel = new CSS2DObject(wordDiv);
          wordLabel.position.copy(sphere.position);
          wordLabel.position.y += 0.05;
          dataGroup.add(wordLabel);
      });

      // Add target context vector
      if (targetContext) {
          const targetCube = new THREE.Mesh(targetBoxGeo, targetMat);
          targetCube.position.set(...targetContext);
          dataGroup.add(targetCube);

          const targetDiv = document.createElement('div');
          targetDiv.className = 'label';
          targetDiv.textContent = 'Target';
          targetDiv.style.color = '#f97316'; // orange-500
          const targetLabel = new CSS2DObject(targetDiv);
          targetLabel.position.copy(targetCube.position);
          targetLabel.position.y += 0.07;
          dataGroup.add(targetLabel);

          // Add line from target to highlighted word
          if (highlightedWord && dictionary[highlightedWord]) {
              const lineMat = new THREE.LineBasicMaterial({ color: 0x84cc16, transparent: true, opacity: 0.7 });
              const points = [
                  new THREE.Vector3(...targetContext),
                  new THREE.Vector3(...dictionary[highlightedWord])
              ];
              const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
              const line = new THREE.Line(lineGeo, lineMat);
              dataGroup.add(line);
          }
      }
      
  }, [dictionary, highlightedWord, targetContext]);


  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg flex flex-col">
       <h2 className="text-2xl font-semibold mb-4 text-sky-400">Visualisasi Vektor 3D</h2>
       <div ref={mountRef} className="w-full h-[400px] lg:h-[450px] rounded-md relative overflow-hidden"></div>
       <p className="text-xs text-gray-500 mt-2 text-center">Klik & seret untuk memutar. Scroll untuk zoom. Klik kanan & seret untuk menggeser.</p>
    </div>
  );
};

export default VectorChart;
