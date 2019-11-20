function parseCommand(input = "") {
    return JSON.parse(input);
}

/**
 * 
 * @param {*} modelPath Path to the model folder
 * @param {*} modelName Model name
 * @param {*} texturePath Path to the textures folder
 * @param {*} textureName Texture name
 * @param {*} onload 
 */
function loadOBJModel(modelPath, modelName, texturePath, textureName, onload) {
    new THREE.MTLLoader()
        .setPath(texturePath)
        .load(textureName, function (materials) {
            materials.preload();

            new THREE.OBJLoader()
                .setPath(modelPath)
                .setMaterials(materials)
                .load(modelName, function (object) {
                    onload(object);
                }, function () { }, function (e) { console.log("Error loading model"); console.log(e); });
        });
}

var exampleSocket;
var shaderMaterial;

var models;
var objects = [];
var objects2 = [];
var props;// extra models
var props2; // seperated model to make waves look better
var counter = 0; // sin function
var counter2 = 0;


window.onload = function () {
    var camera, scene, renderer;
    var cameraControls;
    var worldObjects = {};

    var increase = Math.PI / 100;//sin function

    function init() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1500);
        cameraControls = new THREE.OrbitControls(camera);
        camera.position.z = 15;
        camera.position.y = 5;
        camera.position.x = 15;
        cameraControls.update();
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight + 5);
        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);

        var geometry = new THREE.PlaneBufferGeometry(300, 300, 32,1);
        var material = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load("textures/seawaves.png"), side: THREE.DoubleSide });  
      
        var plane = new THREE.Mesh(geometry, material); 
        plane.receiveShadow = true;
        plane.rotation.x = Math.PI / 2.0;
        plane.position.x = 0;
        plane.position.z = 0;
        scene.add(plane);

        //Load in listener for the audio sound in the game
        var listener = new THREE.AudioListener();

        //Initializes the audio sound
	    sound = new THREE.Audio(listener);
        waveSound = new THREE.Audio(listener);

        //Load sounds from sounds folder and as buffer for the audio
	    var audioLoader = new THREE.AudioLoader();
	    audioLoader.load('sounds/CalmWaves.mp3', function (buffer) {
		sound.setBuffer(buffer);
		sound.setLoop(true);
		sound.setVolume(0.5);
		sound.play();
	});
    
        audioLoader.load('sounds/CalmWaves.mp3', function (buffer) {
		waveSound.setBuffer(buffer);
		waveSound.setLoop(true);
		waveSound.setVolume(0.5);
	});

        // the sphere skybox
        var skyboxGeometry = new THREE.SphereGeometry(1000, 32, 32);
        var skyboxMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/skybox.jpg"), side: THREE.DoubleSide });
        var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        scene.add(skybox);

        // Directonal light
        var light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(20,20,20);
        light.castShadow = true;
        scene.add(light);

        //extra models
        props = new THREE.Group();
        loadObjects();
        objects.push(props);
        scene.add(props);   
      
        props2 = new THREE.Group();
        loadObjects();
        objects2.push(props2);
        scene.add(props2);   


        // Custom shaders for packages
        shaderMaterial = new THREE.ShaderMaterial( {
            uniforms: {
                time: { value: 1.0 },
            },
            vertexShader: document.getElementById( 'chestVertexShader' ).textContent,
            fragmentShader: document.getElementById( 'chestFragmentShader' ).textContent
        });
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }    
    
    
    function animate() {
        requestAnimationFrame(animate);
        cameraControls.update();
        renderer.render(scene, camera);
         // making bobbing/waves with sin 
        for ( i = 0; i <= 1; i += 0.0002 ) {
            x = i;
            ypos = (2*Math.sin(counter));
            counter += increase;
            }
        props.position.y = ypos; 

        // making bobbing/waves with cos 
        for ( b = 0.5; b <= 1.5; b += 0.0002 ) {
            s = b;
            ypos2 = (2*Math.cos(counter2));
            counter2 += increase;
            }
        props2.position.y = ypos2;   
        
        //updating of the lights
        lights.rotation.y += 0.2;
        lights.updateMatrix();
        lights.updateMatrixWorld();
    }

    exampleSocket = new WebSocket("ws://" + window.location.hostname + ":5000" + "/connect_client");
    exampleSocket.onmessage = function (event) {
        var command = parseCommand(event.data);
        if (command.command == "update") {
             models = new THREE.Group();
            scene.add(models);
            if (Object.keys(worldObjects).indexOf(command.parameters.guid) < 0) {
                if (command.parameters.type == "robot") {
                    var robot = new Robot();                    
                    models.add(robot);
                    worldObjects[command.parameters.guid] = robot;
                }
                else if (command.parameters.type == "chest") {
                    var chest = new THREE.Group();
                    loadOBJModel("models/", "chest.obj", "textures/", "chest.mtl", (mesh) => {
                        mesh.scale.set(2, 2, 2);
                        mesh.castShadow = true;
                        //mesh.rotation.set(Math.PI * 1.5, 0, 0);
                        chest.add(mesh);
                        addPointLight(chest, 0xed0000, 0, 2, 0, 2, 7);
           
                        chest.material = shaderMaterial;
                        models.add(chest);
                    });
                    worldObjects[command.parameters.guid] = chest;
                }
                else if (command.parameters.type == "boat") {
                    var boat = new Van();
                    models.add(boat);
                    worldObjects[command.parameters.guid] = boat;
                }
            }
            var object = worldObjects[command.parameters.guid];

            object.position.x = command.parameters.x;
            object.position.y = command.parameters.y;
            object.position.z = command.parameters.z;

            object.rotation.x = command.parameters.rotationX;
            object.rotation.y = command.parameters.rotationY;
            object.rotation.z = command.parameters.rotationZ;
        }
    }
    init();
    animate();
}