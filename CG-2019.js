import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';

import Stats from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js';

import { GUI } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/libs/dat.gui.module.js';

import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js';

var container, stats, clock, gui, mixer, actions, activeAction;
var camera, scene, renderer, model, controls;

var xSpeed = 0.5;
var ySpeed = 0.5;
var zSpeed = 0.5;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
    camera.position.set( - 5, 3, 10 );
    camera.lookAt( new THREE.Vector3( 0, 2, 0 ) );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe0e0e0 );
    scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

    clock = new THREE.Clock();

    // lights
    var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 20, 0 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 20, 10 );
    scene.add( light );

    // ground
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    scene.add( mesh );

    var grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    // pokemon
    var loader = new GLTFLoader();
    loader.load( './pokemon/Magnemite/scene.gltf', function ( gltf ) {
        model = gltf.scene;
        scene.add( model );
        model.scale.set(.2, .2, .2);
        createGUI( model, gltf.animations );
    }, undefined, function ( e ) {
        console.error( e );
    } );
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    container.appendChild( renderer.domElement );

    window.addEventListener('resize', onWindowResize, false );

    stats = new Stats();
    container.appendChild( stats.dom );

    controls = new OrbitControls( camera, renderer.domElement );

}

function createGUI( model, animations ) {
    gui = new GUI();
    mixer = new THREE.AnimationMixer( model );
    actions = {};

    var clip = animations[0];
    var action = mixer.clipAction( clip );
    actions[ clip.name ] = action;

    activeAction = actions[ 'Take 001' ];
    activeAction.play();
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (activeAction._clip.name == 'Take 001') {
        if (keyCode == 87) {
            model.position.z += zSpeed;
        } else if (keyCode == 83) {
            model.position.z -= zSpeed;
        } else if (keyCode == 65) {
            model.position.x += xSpeed;
        } else if (keyCode == 68) {
            model.position.x -= xSpeed;
        }
    }
};

function animate() {
    var dt = clock.getDelta();
    if ( mixer ) mixer.update( dt );
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

}