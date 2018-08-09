//find container on the page, and take it
const mainContainer = document.querySelector('#container');
const canvasElement = document.querySelector('#three');
//link to background image
const backgroundSrc = './assets/images/interier.png';
//link to video for part with animation
const videoSrc = './assets/videos/fireplace.mp4';
//create video tag in memory, from which we take video stream and place it on plane as texture
const videoElement = document.createElement( 'video' );
//flags for displaying our image, if above is true, then show image
let isImageLoaded = false;
let isVideoLoaded = false;

//create ThreeJs scene, where we will place our planes and, which is actually our final image
//link to scene example: https://threejs.org/editor/
let scene = new THREE.Scene();

let aspect;

//that's what drawing our ThreeJs scene on canvas tag into site page. And here you can set drawing options
let renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialiasing: true
});

//create camera which defines what exactly will be drawing from our scene through renderer
let camera = new THREE.PerspectiveCamera();

//Call function for initializing our scene
initScene();

//this function calling 60 times per second, it's need for redrawing displayed image
tick();

function tick() {

  //if image loaded and video loaded, show our finale image
  if (isImageLoaded && isVideoLoaded) {
    //calculate canvas size after resizing window
    const size = calculateSize();

    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);
  }

  /*
    You should call this method whenever you're ready to update your animation
    onscreen. This will request that your animation function be called before
    the browser performs the next repaint. The number of callbacks is usually
    60 times per second, but will generally match the display refresh rate in
    most web browsers as per W3C recommendation. The callback rate may be
    reduced to a lower rate when running in background tabs or in hidden
    iframe s in order to improve performance and battery life.
  */
  requestAnimationFrame(tick);
}

function initScene() {
  //create image tag in memory, from which we take texture and place it on plane
  var img = new Image();
  //set url in which we take our photo
  img.src = backgroundSrc;

  //define function which will be invoked when image was loaded
  img.onload = function() {
    //take image size and calculate image aspect ratio
    var viewWidth = img.naturalWidth;
    var viewHeight = img.naturalHeight;
    aspect = viewWidth < viewHeight ?
      viewWidth / viewHeight
      :
      viewHeight / viewWidth;

    //create texture from image
    const backTexture = new THREE.Texture(this);

    backTexture.needsUpdate = true;

    // calculate size for canvas
    const size = calculateSize();

    //adjust renderer for our scene
    renderer.autoClear = true;
    renderer.setSize(size.width, size.height);
    renderer.setClearColor(0x000000, 0);

    //add canvas tag to site
    canvasElement.appendChild(renderer.domElement);

    /*
      adjust camera
      fov — Camera frustum vertical field of view.
      aspect — Camera frustum aspect ratio.
      near — Camera frustum near plane.
      far — Camera frustum far plane.
      frustum: https://www.gamedev.net/articles/programming/general-and-gameplay-programming/frustum-culling-r4613/
    */
    camera.fov = 60;
    camera.aspect = aspect;
    camera.near = 1;
    camera.far = 10000;
    //set camera position in scene(don't change camera position by z axis)
    camera.position.set(0, 0, 10);
    //set camera direction( to scene center )
    camera.lookAt(scene.position);

    //say that image was loaded
    isImageLoaded = true;
    //create and add background mesh to scene
    addBackground(backTexture);
  };

  //create and add animated mesh to scene
  addAnimation(videoSrc);
}

function addAnimation(videoSrc) {
  //define video tag,
  videoElement.width = 640;
  videoElement.height = 480;
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.src = videoSrc;
  videoElement.crossOrigin = '';
  //turn off the sound, this is necessary for autoplay in chrome browser
  videoElement.muted = true;
  // must call after setting/changing source
  videoElement.load();
  videoElement.play();

  //define function which will be invoked when video was loaded
  videoElement.oncanplay = function() {
    // create video texture from videoElement stream
    var videoTexture = new THREE.VideoTexture( videoElement );
    // set filter type
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    //create material for animated mesh
    var animationMaterial = new THREE.MeshBasicMaterial( {
      map: videoTexture,
      overdraw: true,
      //draw a texture on the front and back of the plane
      side: THREE.DoubleSide
    } );

    // create plane for animated mesh
    const planeWidth = 1.3;
    const planeHeight = 1.2;
    const widthSegments = 1;
    const heightSegments = 1;
    var animationGeometry = new THREE.PlaneGeometry(
      planeWidth, planeHeight, widthSegments, heightSegments
    );

    //create mesh with material and geometry
    var animationMesh = new THREE.Mesh(animationGeometry, animationMaterial);

    // set animation mesh position and rotate for animatedMesh
    animationMesh.rotateZ(0.17);
    animationMesh.rotateY(0.7);
    animationMesh.position.set(-3.1, -0.94, 1.4);
    scene.add(animationMesh);

    //say that vide was loaded
    isVideoLoaded = true;
  }

}

//add our plane with photo as texture to scene
function addBackground(texture) {
  const planeWidth = 4.9;
  const planeHeight = 5;
  //mesh is is a representation our geometry and texture
  var backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(planeWidth, planeHeight),
    new THREE.MeshBasicMaterial({
      //tell the renderer that the texture with the transparent component
      transparent: true,
      map: texture
    })
  );


  /*
    Set background position into scene by the z axis.
    Don't change. because its depend to camera position
  */
  backgroundMesh.position.z = 5;

  //add mesh to the scene, its important
  scene.add(backgroundMesh);
}

//calculate canvas size
function calculateSize() {
  let width = 0;
  let height = 0;
  let originClientWidth = document.body.clientWidth;

  while(true) {

    width = originClientWidth;
    height = width * aspect;

    if (window.innerHeight > height) {

      break;
    } else {
      originClientWidth -= 1;
    }
  }

  canvasElement.style.width = `${width}px`;
  canvasElement.style.height = `${height}px`;

  mainContainer.style.width = `${width}px`;
  mainContainer.style.height = `${height}px`;

  return { width, height };
}
