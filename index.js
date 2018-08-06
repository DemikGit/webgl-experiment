const mainContainer = document.querySelector('#container');
const backgroundSrc = './assets/images/interier.png';
const videoElement = document.createElement( 'video' );
let backTexture = null;

let scene = new THREE.Scene();
let aspect;
let renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialiasing: true
});
let camera = new THREE.PerspectiveCamera();
let distance;
let vFov;

const planeZ = 5;

function addBackground(texture, width, height) {
  var backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.9, 5),
    new THREE.MeshBasicMaterial({
      transparent: true,
      map: texture
    })
  );

  backgroundMesh.position.z = planeZ;

  scene.add(backgroundMesh);
}

function addAnimation(videoSrc) {
  videoElement.width = 640;
  videoElement.height = 480;
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.src = videoSrc;
  videoElement.crossOrigin = '';
  videoElement.load(); // must call after setting/changing source
  videoElement.play();

  var videoTexture = new THREE.VideoTexture( videoElement );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  var animationMaterial =  new THREE.MeshBasicMaterial( {
    map: videoTexture,
    overdraw: true,
    side: THREE.DoubleSide
  } );

  var animationGeometry = new THREE.PlaneGeometry(1.3, 1.2, 1, 1);
  var animationMesh = new THREE.Mesh(animationGeometry, animationMaterial);
  animationMesh.rotateZ(0.17);
  animationMesh.rotateY(0.7);
  animationMesh.position.set(-3.1, -0.94, 1.4);
  scene.add(animationMesh);
}

function initScene() {
  var img = new Image();
  img.src = backgroundSrc;

  img.onload = function() {
    var viewWidth = img.naturalWidth;
    var viewHeight = img.naturalHeight;
    backTexture = new THREE.Texture( this );
    backTexture.needsUpdate = true;

    aspect = viewWidth < viewHeight ?
      viewWidth / viewHeight
      :
      viewHeight / viewWidth;

    let width = mainContainer.clientWidth;
    let height = width * aspect;
    mainContainer.clientHeight = height;

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    renderer.autoClear = false;

    document.querySelector('#three').appendChild(renderer.domElement);
    camera.fov = 60;
    camera.aspect = aspect;
    camera.near = 1;
    camera.far = 10000;
    camera.position.set(0, 0, 10);
    camera.lookAt(scene.position);

    console.log(camera.position.z, planeZ);

    distance = camera.position.z - planeZ;

    vFov = camera.fov * Math.PI / 180;

    addBackground(backTexture, width, height);
    addAnimation('./assets/videos/fireplace.mp4');
  };
}

function update() {

}

function render() {
  renderer.render(scene, camera);
}

function tick() {

  update();
  render();

  requestAnimationFrame(tick);
}

initScene();

tick();

setTimeout(() => {
  videoElement.play();
}, 0)
