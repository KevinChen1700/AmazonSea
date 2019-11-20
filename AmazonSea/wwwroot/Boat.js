class Van extends THREE.Group {

    /**
     * Constructor for the creation of the boat
     * [Loadstate op not loading]
     */
    constructor() {
        super();

        this._loadState = LoadStates.NOT_LOADING;

        this.init();
    }

    /**
     * returns the loadstate of the boat
     */
    get loadState() {
        return this._loadState;
    }

    /**
     * adds textures and lights to the boat
     */
    init() {
         if(this._loadState != LoadStates.NOT_LOADING){
             return;
         }

         this._loadState = LoadStates.LOADING;

         var selfRef = this;
         loadOBJModel("models/", "Tugboat.obj", "textures/", "Tugboat.mtl", (mesh) => {
            var textureLoader = new THREE.TextureLoader();
            var map = textureLoader.load('textures/Tugboat_BaseColor.png');
            var material = new THREE.MeshPhongMaterial({ map: map });
           
            mesh.traverse(function (node) {
                if (node.isMesh) node.material = material;
            });
            mesh.scale.set(1, 1, 1);
            mesh.castShadow = true;       
            selfRef.add(mesh);

            addSpotLight(selfRef, 0xfff000, -1, 2, 10, 2, 15, 1 ,1 ,2 );

            selfRef._loadState = LoadStates.LOADED;
        });
    }
}
/**
 * creation of a Spotlight
 * @param {*} object The 3d model that inherits the light
 * @param {*} color the color
 * @param {*} x X-coordinat
 * @param {*} y Y
 * @param {*} z Z
 * @param {*} intensity Intensity of the light
 * @param {*} distance the reaching distance of the lighg
 * @param {*} angle angle of the directional light
 * @param {*} penumbra  Percent of the spotlight cone that is attenuated due to penumbra. 
 * @param {*} decay The amount the light dims along the distance of the light.
 */
function addSpotLight(object, color, x, y, z, intensity, distance , angle ,  penumbra , decay) {
    var light = new THREE.PointLight(color, intensity, distance);
    light.position.set(x, y, z);
    object.add(light);
}