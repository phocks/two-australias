const React = require("react");

const THREE = require("three");
const d3 = require("d3");

const styles = require("./Sunflower.scss");

const backgroundColor = 0x000000;

class Sunflower extends React.Component {
  constructor(props) {
    super(props);

    this.initGraph = this.initGraph.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: Add any conditions that mitigate updating the graph
    this.updateGraph(nextProps);
  }

  shouldComponentUpdate() {
    // Stop Preact from managing the DOM itself
    return false;
  }

  componentDidMount() {
    this.initGraph(this.props);

    // TODO: add any listeners here
    // ...
  }

  componentWillUnmount() {
    // TODO: remove any listeners here
    // ...
  }

  /**
   * Initialize the graph
   * @param {object} props The latest props that were given to this component
   */
  initGraph(props) {
    // ------------------------------------------------
    // Sunflower

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Add canvas
    let renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    document.getElementById("stage").appendChild(renderer.domElement);

    // Set up camera and scene
    let camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 0, 10000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    // Generate points and add them to scene
    const generated_points = d3.range(10000).map(phyllotaxis(10));
    const pointsGeometry = new THREE.Geometry();
    const colors = [];
    // let i = 0.00001;
    for (const point of generated_points) {
      const vertex = new THREE.Vector3(point[0], point[1], Math.random() * 1000); // x, y, z
      pointsGeometry.vertices.push(vertex);
      const color = new THREE.Color();
      color.setHSL(Math.random(), 1, 0.5);
      colors.push(color);
      // i = i + 0.00001;
    }
    pointsGeometry.colors = colors;
    const pointsMaterial = new THREE.PointsMaterial({
      vertexColors: THREE.VertexColors,
      size: 10,
      // sizeAttenuation: true
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    const pointsContainer = new THREE.Object3D();
    pointsContainer.add(points);
    scene.add(pointsContainer);

    // create a blue LineBasicMaterial
    // var material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // var geometry = new THREE.Geometry();
    // geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    // geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    // geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    // geometry.vertices.push(new THREE.Vector3(-10, 0, 0));

    // var line = new THREE.Line(geometry, material);

    // scene.add(line);

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
  }

  /**
   * Update the graph. It is important to only update this component through normal D3 methods.
   * @param {object} props The latest props given to this component
   */
  updateGraph(props) {
    if (!this.wrapper) return;

    // TODO: Use D3 to update the graph
  }

  render() {
    return (
      <div
        id="stage"
        className={styles.wrapper}
        ref={el => (this.wrapper = el)}
      />
    );
  }
}

module.exports = Sunflower;
