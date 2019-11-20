//Javascript enum
const LoadStates =
    Object.freeze(
        {
            "NOT_LOADING": 1,
            "LOADING": 2,
            "LOADED": 3
        });

class Robot extends THREE.Group {

    /**
     * Constructor for creatin the robot
     */
    constructor() {
        super();

        this._loadState = LoadStates.NOT_LOADING;

        this.init();
    }

    /**
     * returns the loadstate
     */
    get loadState() {
        return this._loadState;
    }

    /**
     * adds texture to the robot
     */
    init() {
         if(this._loadState != LoadStates.NOT_LOADING){
             return;
         }

         this._loadState = LoadStates.LOADING;

          var selfRef = this;
         loadOBJModel("models/", "Narwhal.obj", "textures/", "Narwhal.mtl", (mesh) => {
            var textureLoader = new THREE.TextureLoader();
            var map = textureLoader.load('models/Narwhal_BaseColor.png');
            var material = new THREE.MeshPhongMaterial({ map: map });

            mesh.traverse(function (node) {
                if (node.isMesh) node.material = material;
            });
            mesh.scale.set(0.2, 0.2, 0.2);
            mesh.castShadow = true;
            mesh.material = new THREE.MeshPhongMaterial;
           
            selfRef.add(mesh);

            //addPointLight(selfRef, 0xff4751, 0, 0.75, 0, 2, 7);

            selfRef._loadState = LoadStates.LOADED;
        });
    }
}

/**
 * Creation of a pointlight
 * @param {*} object The 3d model that inherits the light
 * @param {*} color the color
 * @param {*} x X-coordinat
 * @param {*} y Y
 * @param {*} z Z
 * @param {*} intensity Intensity of the light
 * @param {*} distance the reaching distance of the lighg
 */
function addPointLight(object, color, x, y, z, intensity, distance) {
    var light = new THREE.PointLight(color, intensity, distance);
    light.position.set(x, y, z);
    object.add(light);
}