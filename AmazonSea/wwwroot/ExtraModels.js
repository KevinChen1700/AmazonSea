function loadObjects () {
 
    
    //loading of extra models

    loadOBJModel("models/", "Iceberg.obj", "textures/", "Iceberg.mtl", (mesh) => {
		var textureLoader = new THREE.TextureLoader();
				var map = textureLoader.load('textures/Iceberg.png');
				var material = new THREE.MeshPhongMaterial({map: map});
	
				mesh.traverse(function (node){
					if(node.isMesh) node.material = material;
				});
		mesh.scale.set(0.5,0.5,0.5);
		mesh.material = new THREE.MeshBasicMaterial;
		mesh.rotation.y = 1.5;
		mesh.position.set(50,-10,70);
		props.add(mesh);
	});
    
    loadOBJModel("models/", "Iceberg.obj", "textures/", "Iceberg.mtl", (mesh) => {
		var textureLoader = new THREE.TextureLoader();
				var map = textureLoader.load('textures/Iceberg.png');
				var material = new THREE.MeshPhongMaterial({map: map});
	
				mesh.traverse(function (node){
					if(node.isMesh) node.material = material;
				});
		mesh.scale.set(0.5,0.5,0.5);
		mesh.material = new THREE.MeshBasicMaterial;
		mesh.rotation.y = 1.5;
		mesh.position.set(-50,-10,-50);
		props.add(mesh);
    });
    
    loadOBJModel("models/", "CUPIC_ICEBERG.obj", "textures/", "CUPIC_ICEBERG.mtl", (mesh) => {
		var textureLoader = new THREE.TextureLoader();
				var map = textureLoader.load('textures/PlatonicSurface_Color.png');
				var material = new THREE.MeshPhongMaterial({map: map});
	
				mesh.traverse(function (node){
					if(node.isMesh) node.material = material;
				});
		mesh.scale.set(0.1,0.1,0.1);
		mesh.material = new THREE.MeshBasicMaterial;
		mesh.rotation.y = 1.5;
		mesh.position.set(50,-10,-60);
		props2.add(mesh);
	});

}