// 3D Architecture Visualization with Three.js
// Interactive WebGL-based visualization of system architecture diagrams

class ArchitectureViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.nodes = new Map();
        this.edges = [];
        this.currentDiagram = 'system-architecture';
        this.animationFrame = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedNode = null;
        this.autoRotate = true;
        this.showLabels = true;
        this.layoutType = '3d-force';
        
        this.init();
    }

    init() {
        try {
            console.log('Starting 3D viewer initialization...');
            
            // Check WebGL support
            if (!this.isWebGLSupported()) {
                throw new Error('WebGL is not supported in this browser');
            }
            console.log('WebGL support confirmed');

            this.createScene();
            console.log('Scene created');
            
            this.createCamera();
            console.log('Camera created');
            
            this.createRenderer();
            console.log('Renderer created');
            
            this.createControls();
            console.log('Controls created');
            
            this.createLights();
            console.log('Lights created');
            
            this.setupEventListeners();
            console.log('Event listeners set up');
            
            this.loadDiagram(this.currentDiagram);
            console.log('Diagram loaded');
            
            this.animate();
            console.log('Animation started');
            
            // Hide loading screen
            setTimeout(() => {
                document.getElementById('loading-screen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loading-screen').style.display = 'none';
                }, 500);
            }, 1500);
            
            console.log('3D viewer initialized successfully');
        } catch (error) {
            console.error('Failed to initialize 3D viewer:', error);
            throw error;
        }
    }

    isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(COLOR_SCHEMES.default.background);
        this.scene.fog = new THREE.Fog(COLOR_SCHEMES.default.fog, 20, 100);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // Set camera to a more suitable angle - slight overhead view
        this.camera.position.set(25, 15, 25);
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('three-canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    createControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = this.autoRotate;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        // Apply vertical rotation limits for better usability
        this.controls.minPolarAngle = Math.PI * 0.1;  // 18 degrees from top
        this.controls.maxPolarAngle = Math.PI * 0.8;  // 144 degrees from top
    }

    createLights() {
        // Ambient light - stronger for white background
        const ambientLight = new THREE.AmbientLight(COLOR_SCHEMES.default.ambient, 0.8);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(COLOR_SCHEMES.default.directional, 1.0);
        directionalLight.position.set(20, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        this.scene.add(directionalLight);

        // Secondary directional light for better illumination
        const directionalLight2 = new THREE.DirectionalLight(0x666666, 0.4);
        directionalLight2.position.set(-20, -20, -10);
        this.scene.add(directionalLight2);

        // Subtle accent lights with lower intensity
        const pointLight1 = new THREE.PointLight(0x4444ff, 0.2, 50);
        pointLight1.position.set(-20, 10, 10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff4444, 0.2, 50);
        pointLight2.position.set(20, 10, -10);
        this.scene.add(pointLight2);
    }

    createNodeGeometry(type) {
        const config = NODE_TYPES[type] || NODE_TYPES.frontend;
        const size = config.size;

        switch (config.geometry) {
            case 'sphere':
                return new THREE.SphereGeometry(size, 16, 12);
            case 'box':
                return new THREE.BoxGeometry(size * 1.5, size, size * 1.5);
            case 'cylinder':
                return new THREE.CylinderGeometry(size * 0.8, size * 0.8, size * 1.2, 12);
            case 'octahedron':
                return new THREE.OctahedronGeometry(size);
            case 'dodecahedron':
                return new THREE.DodecahedronGeometry(size);
            case 'tetrahedron':
                return new THREE.TetrahedronGeometry(size);
            case 'cone':
                return new THREE.ConeGeometry(size * 0.8, size * 1.5, 8);
            case 'torus':
                return new THREE.TorusGeometry(size * 0.8, size * 0.3, 8, 16);
            case 'icosahedron':
                return new THREE.IcosahedronGeometry(size);
            default:
                return new THREE.BoxGeometry(size, size, size);
        }
    }

    createNodeMaterial(color, type) {
        const config = NODE_TYPES[type] || NODE_TYPES.frontend;
        const baseColor = new THREE.Color(color);
        // Darken colors for better visibility on white background
        baseColor.multiplyScalar(0.8);
        
        return new THREE.MeshLambertMaterial({
            color: baseColor,
            emissive: baseColor.clone().multiplyScalar(config.emissive * 0.3),
            transparent: true,
            opacity: 0.9
        });
    }

    createNode(nodeData) {
        const geometry = this.createNodeGeometry(nodeData.group);
        const material = this.createNodeMaterial(nodeData.color, nodeData.group);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(
            nodeData.position.x,
            nodeData.position.y,
            nodeData.position.z
        );
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { nodeData, originalColor: nodeData.color };
        
        // Add subtle animation
        mesh.userData.originalPosition = mesh.position.clone();
        mesh.userData.animationOffset = Math.random() * Math.PI * 2;
        
        return mesh;
    }

    createEdge(fromNode, toNode) {
        const group = new THREE.Group();
        
        // Calculate direction and distance
        const direction = new THREE.Vector3()
            .subVectors(toNode.position, fromNode.position);
        const distance = direction.length();
        direction.normalize();
        
        // Create the line (arrow shaft)
        const lineGeometry = new THREE.BufferGeometry();
        const lineEnd = fromNode.position.clone().add(direction.clone().multiplyScalar(distance * 0.85));
        const positions = [
            fromNode.position.x, fromNode.position.y, fromNode.position.z,
            lineEnd.x, lineEnd.y, lineEnd.z
        ];
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.8,
            linewidth: 2
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);
        
        // Create arrow head (cone)
        const arrowGeometry = new THREE.ConeGeometry(0.3, 1.2, 8);
        const arrowMaterial = new THREE.MeshLambertMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const arrowHead = new THREE.Mesh(arrowGeometry, arrowMaterial);
        
        // Position and orient the arrow head
        arrowHead.position.copy(toNode.position)
            .sub(direction.clone().multiplyScalar(1.5)); // Move slightly back from target node
        arrowHead.lookAt(toNode.position);
        arrowHead.rotateX(Math.PI / 2); // Orient cone to point forward
        
        group.add(arrowHead);
        
        return group;
    }

    createLabel(text, position) {
        if (!this.showLabels) return null;
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const fontSize = 48;
        
        context.font = `bold ${fontSize}px Arial`;
        const textWidth = context.measureText(text).width;
        
        canvas.width = textWidth + 30;
        canvas.height = fontSize + 30;
        
        // White background with dark border for better visibility
        context.fillStyle = 'rgba(255, 255, 255, 0.95)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add border
        context.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        context.lineWidth = 2;
        context.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Dark text for better contrast on white background
        context.font = `bold ${fontSize}px Arial`;
        context.fillStyle = '#222222';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        const sprite = new THREE.Sprite(material);
        
        sprite.position.copy(position);
        sprite.position.y += 2;
        sprite.scale.set(canvas.width / 100, canvas.height / 100, 1);
        
        return sprite;
    }

    clearScene() {
        // Remove all nodes and edges
        this.nodes.clear();
        this.edges = [];
        
        const objectsToRemove = [];
        this.scene.traverse((object) => {
            if (object.userData.nodeData || object.userData.isEdge || object.userData.isLabel) {
                objectsToRemove.push(object);
            }
        });
        
        objectsToRemove.forEach(object => {
            this.scene.remove(object);
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }

    loadDiagram(diagramKey) {
        this.clearScene();
        
        const diagramData = DIAGRAM_DATA[diagramKey];
        if (!diagramData) {
            console.error(`Diagram ${diagramKey} not found`);
            return;
        }

        this.currentDiagram = diagramKey;
        
        // Update title
        document.getElementById('info-title').textContent = diagramData.title;
        document.getElementById('info-content').innerHTML = `
            <p>${diagramData.description}</p>
            <p><strong>Nodes:</strong> ${diagramData.nodes.length}</p>
            <p><strong>Connections:</strong> ${diagramData.edges.length}</p>
        `;

        // Apply layout
        this.applyLayout(diagramData);

        // Create nodes
        diagramData.nodes.forEach(nodeData => {
            const node = this.createNode(nodeData);
            this.scene.add(node);
            this.nodes.set(nodeData.id, node);
            
            // Create label
            const label = this.createLabel(nodeData.label, node.position);
            if (label) {
                label.userData.isLabel = true;
                this.scene.add(label);
            }
        });

        // Create edges
        diagramData.edges.forEach(edgeData => {
            const fromNode = this.nodes.get(edgeData.from);
            const toNode = this.nodes.get(edgeData.to);
            
            if (fromNode && toNode) {
                const edge = this.createEdge(fromNode, toNode);
                edge.userData.isEdge = true;
                edge.userData.edgeData = edgeData;
                this.scene.add(edge);
                this.edges.push(edge);
            }
        });

        // Update camera position based on diagram
        this.focusOnDiagram();
    }

    applyLayout(diagramData) {
        switch (this.layoutType) {
            case 'hierarchical':
                this.applyHierarchicalLayout(diagramData);
                break;
            case 'circular':
                this.applyCircularLayout(diagramData);
                break;
            case '3d-force':
            default:
                // Use predefined positions from data
                break;
        }
    }

    applyHierarchicalLayout(diagramData) {
        const groups = {};
        diagramData.nodes.forEach(node => {
            if (!groups[node.group]) groups[node.group] = [];
            groups[node.group].push(node);
        });

        let yOffset = 10;
        Object.keys(groups).forEach(groupKey => {
            const groupNodes = groups[groupKey];
            groupNodes.forEach((node, index) => {
                node.position.x = (index - groupNodes.length / 2) * 6;
                node.position.y = yOffset;
                node.position.z = 0;
            });
            yOffset -= 6;
        });
    }

    applyCircularLayout(diagramData) {
        const radius = 10;
        diagramData.nodes.forEach((node, index) => {
            const angle = (index / diagramData.nodes.length) * Math.PI * 2;
            node.position.x = Math.cos(angle) * radius;
            node.position.y = Math.sin(angle) * radius;
            node.position.z = (Math.random() - 0.5) * 10;
        });
    }

    focusOnDiagram() {
        if (this.nodes.size === 0) return;

        const box = new THREE.Box3();
        this.nodes.forEach(node => {
            box.expandByObject(node);
        });

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        
        const distance = maxDimension * 2;
        // Position camera at a comfortable viewing angle (not too high, not too low)
        this.camera.position.set(
            center.x + distance * 0.8,
            center.y + distance * 0.4,  // Reduced height for better viewing angle
            center.z + distance * 0.8
        );
        
        this.controls.target.copy(center);
        this.controls.update();
    }

    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const nodeObjects = Array.from(this.nodes.values());
        const intersects = this.raycaster.intersectObjects(nodeObjects);

        if (intersects.length > 0) {
            this.selectNode(intersects[0].object);
        } else {
            this.deselectNode();
        }
    }

    onMouseDoubleClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const nodeObjects = Array.from(this.nodes.values());
        const intersects = this.raycaster.intersectObjects(nodeObjects);

        if (intersects.length > 0) {
            this.focusOnNode(intersects[0].object);
        }
    }

    selectNode(node) {
        // Deselect previous node
        if (this.selectedNode) {
            this.selectedNode.material.emissive.setHex(0x000000);
            this.selectedNode.scale.setScalar(1);
        }

        this.selectedNode = node;
        node.material.emissive.setHex(0x00ff88);
        node.scale.setScalar(1.2);

        // Update info panel
        const nodeData = node.userData.nodeData;
        document.getElementById('info-title').textContent = `🎯 ${nodeData.label}`;
        document.getElementById('info-content').innerHTML = `
            <p><strong>Type:</strong> ${nodeData.group}</p>
            <p><strong>Position:</strong> (${nodeData.position.x.toFixed(1)}, ${nodeData.position.y.toFixed(1)}, ${nodeData.position.z.toFixed(1)})</p>
            <p><strong>ID:</strong> ${nodeData.id}</p>
            <div style="margin-top: 10px;">
                <h4>Connected To:</h4>
                <ul>
                    ${this.getConnectedNodes(nodeData.id).map(id => `<li>${this.getNodeLabel(id)}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    deselectNode() {
        if (this.selectedNode) {
            this.selectedNode.material.emissive.setHex(0x000000);
            this.selectedNode.scale.setScalar(1);
            this.selectedNode = null;
        }

        // Reset info panel
        const diagramData = DIAGRAM_DATA[this.currentDiagram];
        document.getElementById('info-title').textContent = diagramData.title;
        document.getElementById('info-content').innerHTML = `
            <p>${diagramData.description}</p>
            <p><strong>Nodes:</strong> ${diagramData.nodes.length}</p>
            <p><strong>Connections:</strong> ${diagramData.edges.length}</p>
        `;
    }

    focusOnNode(node) {
        const targetPosition = node.position.clone();
        targetPosition.add(new THREE.Vector3(10, 5, 10));
        
        // Smooth camera transition
        const startPos = this.camera.position.clone();
        const startTime = Date.now();
        const duration = 1000;

        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

            this.camera.position.lerpVectors(startPos, targetPosition, easedProgress);
            this.controls.target.lerp(node.position, easedProgress);
            this.controls.update();

            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };

        animateCamera();
    }

    getConnectedNodes(nodeId) {
        const connected = [];
        const diagramData = DIAGRAM_DATA[this.currentDiagram];
        
        diagramData.edges.forEach(edge => {
            if (edge.from === nodeId) {
                connected.push(edge.to);
            } else if (edge.to === nodeId) {
                connected.push(edge.from);
            }
        });
        
        return connected;
    }

    getNodeLabel(nodeId) {
        const diagramData = DIAGRAM_DATA[this.currentDiagram];
        const node = diagramData.nodes.find(n => n.id === nodeId);
        return node ? node.label : nodeId;
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse events
        this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
        this.renderer.domElement.addEventListener('dblclick', this.onMouseDoubleClick.bind(this));

        // Keyboard events
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    this.focusOnDiagram();
                    break;
                case 'KeyR':
                    this.autoRotate = !this.autoRotate;
                    this.controls.autoRotate = this.autoRotate;
                    document.getElementById('auto-rotate').checked = this.autoRotate;
                    break;
                case 'KeyL':
                    this.showLabels = !this.showLabels;
                    document.getElementById('show-labels').checked = this.showLabels;
                    this.loadDiagram(this.currentDiagram);
                    break;
            }
        });

        // UI controls
        document.querySelectorAll('.diagram-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.diagram-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadDiagram(e.target.dataset.diagram);
            });
        });

        document.getElementById('auto-rotate').addEventListener('change', (e) => {
            this.autoRotate = e.target.checked;
            this.controls.autoRotate = this.autoRotate;
        });

        document.getElementById('show-labels').addEventListener('change', (e) => {
            this.showLabels = e.target.checked;
            this.loadDiagram(this.currentDiagram);
        });

        document.getElementById('layout-type').addEventListener('change', (e) => {
            this.layoutType = e.target.value;
            this.loadDiagram(this.currentDiagram);
        });
    }

    animate() {
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));

        const time = Date.now() * 0.001;

        // Animate nodes with subtle floating motion
        this.nodes.forEach(node => {
            const offset = node.userData.animationOffset;
            node.position.y = node.userData.originalPosition.y + Math.sin(time + offset) * 0.2;
            node.rotation.y += 0.005;
        });

        // Update controls
        this.controls.update();

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.clearScene();
        this.renderer.dispose();
    }
}

// Help functions
function showHelp() {
    document.getElementById('help-overlay').style.display = 'flex';
}

function hideHelp() {
    document.getElementById('help-overlay').style.display = 'none';
}

// Initialize the application
let viewer;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded!');
        document.getElementById('loading-screen').innerHTML = `
            <div class="loading-content">
                <h2>❌ Loading Error</h2>
                <p>Three.js library failed to load. Please check your internet connection and try again.</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
        return;
    }
    console.log('Three.js loaded successfully');

    // Check if OrbitControls is loaded
    if (typeof THREE.OrbitControls === 'undefined') {
        console.error('OrbitControls is not loaded!');
        console.log('Available THREE properties:', Object.keys(THREE));
        document.getElementById('loading-screen').innerHTML = `
            <div class="loading-content">
                <h2>❌ Loading Error</h2>
                <p>OrbitControls failed to load. Please check your internet connection and try again.</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
        return;
    }
    console.log('OrbitControls loaded successfully');

    try {
        viewer = new ArchitectureViewer();
        
        // Show help on first visit
        setTimeout(() => {
            if (!localStorage.getItem('3d-viewer-help-shown')) {
                showHelp();
                localStorage.setItem('3d-viewer-help-shown', 'true');
            }
        }, 2000);
    } catch (error) {
        console.error('Error initializing 3D viewer:', error);
        document.getElementById('loading-screen').innerHTML = `
            <div class="loading-content">
                <h2>❌ Initialization Error</h2>
                <p>Failed to initialize 3D viewer: ${error.message}</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (viewer) {
        viewer.destroy();
    }
});