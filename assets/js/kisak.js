// Made by: LWSS
// Javascript is good for little things like this, with ThreeJS it's easy and fun.
// Kisak Model expertly made in Blender
// Images procured by me, bonus pts if you can tell me where they're from.

// Special thanks to http://longqian.me/2017/02/06/jekyll-threejs/ for showing how to paste canvas/js into my jekyll blog

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,2897);
let cubeCamera = new THREE.CubeCamera(1, 3000, 1024);
let renderer = new THREE.WebGLRenderer({antialias:false});
let time = 0;
let loader = new THREE.GLTFLoader();
let controls = new THREE.OrbitControls(camera, renderer.domElement);

let mouseHeld = false;

function init() {
    var canvasHolder = document.getElementById('canvas-holder');
    var width = canvasHolder.clientWidth;
    var height = width * 0.7;
    canvasHolder.clientHeight = height;
    renderer.setSize( width, height );
    canvasHolder.appendChild( renderer.domElement );

    controls.startingDistance = 400;
    controls.minDistance = 300;
    controls.maxDistance = 1000;

    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load( '/assets/img/32.front.png');
    let texture_bk = new THREE.TextureLoader().load( '/assets/img/32.back.png');
    let texture_up = new THREE.TextureLoader().load( '/assets/img/32.up.png');
    let texture_dn = new THREE.TextureLoader().load( '/assets/img/32.down.png');
    let texture_rt = new THREE.TextureLoader().load( '/assets/img/32.right.png');
    let texture_lf = new THREE.TextureLoader().load( '/assets/img/32.left.png');

    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

    for (let i = 0; i < 6; i++){
        materialArray[i].side = THREE.BackSide;
    }
    let skyboxGeo = new THREE.BoxGeometry( 2048, 2048, 2048);
    let skybox = new THREE.Mesh( skyboxGeo, materialArray );

    var reflectionMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        envMap: cubeCamera.renderTarget.texture,
    });

    loader.load("/assets/models/kisak.gltf", function( gltf ){ // loading done!
        gltf.scene.traverse((o) => {
            if (o.isMesh) o.material = reflectionMaterial;
        });
        gltf.scene.scale.set(12,12,12); // scale here

        scene.add( gltf.scene );
    }, function ( xhr ){ // loading....
    }, function ( error ){ // error!
        console.log( error );
    });

    scene.add( skybox );

    animate();
}

document.addEventListener("mousedown", function()
{
    mouseHeld = true;
});
document.addEventListener("mouseup", function()
{
    mouseHeld = false;
});

function animate() {
    setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 / 45 );

    time += 0.0075;

    if( !mouseHeld )
    {
        controls.getPolarAngle()
        camera.position.x = Math.sin(time) * 400;
        camera.position.y = (Math.sin(time) * 130) + 75;
        camera.position.z = Math.cos(time) * 400;
        camera.lookAt(0,0,0);
    }

    controls.update();

    renderer.render(scene,camera);
    cubeCamera.update(renderer, scene);
}

init();