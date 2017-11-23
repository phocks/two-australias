const React = require("react");
const Stardust = require("stardust-core");
const StardustWebGL = require("stardust-webgl");
const D3Timer = require("d3-timer");
const THREE = require("three");
const d3 = require("d3");

const styles = require("./App.scss");

class App extends React.Component {
  componentDidMount() {
    console.log("Did mount!!");

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Add canvas
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.getElementById('stage').appendChild(renderer.domElement);

    // Set up camera and scene
    let camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 0, 10000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Generate points and add them to scene
    const generated_points = d3.range(100000).map(phyllotaxis(10));
    const pointsGeometry = new THREE.Geometry();
    const colors = [];
    for (const point of generated_points) {
      const vertex = new THREE.Vector3(point[0], point[1], 0);
      pointsGeometry.vertices.push(vertex);
      const color = new THREE.Color();
      color.setHSL(Math.random(), 1, 0.5);
      colors.push(color);
    }
    pointsGeometry.colors = colors;
    const pointsMaterial = new THREE.PointsMaterial({
      vertexColors: THREE.VertexColors,
      size: 6,
      sizeAttenuation: false
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    const pointsContainer = new THREE.Object3D();
    pointsContainer.add(points);
    scene.add(pointsContainer);

    // Set up zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([100, 10000])
      .on("zoom", () => {
        const event = d3.event;
        if (event.sourceEvent) {
          // Get z from D3
          const new_z = event.transform.k;

          if (new_z !== camera.position.z) {
            // Handle a zoom event
            const { clientX, clientY } = event.sourceEvent;

            // Project a vector from current mouse position and zoom level
            // Find the x and y coordinates for where that vector intersects the new
            // zoom level.
            // Code from WestLangley https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z/13091694#13091694
            const vector = new THREE.Vector3(
              clientX / width * 2 - 1,
              -(clientY / height) * 2 + 1,
              1
            );
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = (new_z - camera.position.z) / dir.z;
            const pos = camera.position
              .clone()
              .add(dir.multiplyScalar(distance));

            // Set the camera to new coordinates
            camera.position.set(pos.x, pos.y, new_z);
          } else {
            // Handle panning
            const { movementX, movementY } = event.sourceEvent;

            // Adjust mouse movement by current scale and set camera
            const current_scale = getCurrentScale();
            camera.position.set(
              camera.position.x - movementX / current_scale,
              camera.position.y + movementY / current_scale,
              camera.position.z
            );
          }
        }
      });

    // Add zoom listener
    const view = d3.select(renderer.domElement);
    view.call(zoom);

    // Disable double click to zoom because I'm not handling it in Three.js
    view.on("dblclick.zoom", null);

    // Sync d3 zoom with camera z position
    zoom.scaleTo(view, 10000);

    // Three.js render loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // From https://github.com/anvaka/three.map.control, used for panning
    function getCurrentScale() {
      var vFOV = camera.fov * Math.PI / 180;
      var scale_height = 2 * Math.tan(vFOV / 2) * camera.position.z;
      var currentScale = height / scale_height;
      return currentScale;
    }

    // Point generator function
    function phyllotaxis(radius) {
      const theta = Math.PI * (3 - Math.sqrt(5));
      return function(i) {
        const r = radius * Math.sqrt(i),
          a = theta * i;
        return [
          width / 2 + r * Math.cos(a) - width / 2,
          height / 2 + r * Math.sin(a) - height / 2
        ];
      };
    }

    // // Get our canvas element
    // var canvas = document.getElementById("main-canvas");
    // var width = 960;
    // var height = 500;

    // // // Create a WebGL 2D platform on the canvas:
    // var platform = Stardust.platform("webgl-2d", canvas, width, height);

    // // ... Load data and render your visualization
    // var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // var circleSpec = Stardust.mark.circle();

    // var circles = Stardust.mark.create(circleSpec, platform);

    // circles.attr("center", d => [d * 80, d * 20]);
    // circles.attr("radius", d => d * 3);
    // circles.attr("color", [0, 0, 0, 1]);

    // circles.data(data);

    // circles.render();

    // function animate() {
    //   circles.attr("radius", d => d * Math.random() * 3);
    //   circles.render();
    //   // console.log("Aniamted!");
    // }

    // const timer = D3Timer.interval(animate, 1000 / 15);
  }
  componentWillUnmount() {}
  render() {
    return (
      <div id="stage" className={styles.root}>
        {/* Welcome to the app! */}
        {/* <canvas id="main-canvas" /> */}
      </div>
    );
  }
}

module.exports = App;
