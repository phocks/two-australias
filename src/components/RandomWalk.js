const React = require('react');
const d3 = require('d3');
const THREE = require("three");

const styles = require('./RandomWalk.scss');

class RandomWalk extends React.Component {
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
    if (!this.wrapper) return;

    // three.js animataed line using BufferGeometry
    var renderer, scene, camera;
    var line;
    var MAX_POINTS = 5000;
    var drawCount;
    init();
    animate();
    function init() {
      // info
      // var info = document.createElement("div");
      // info.style.position = "absolute";
      // info.style.top = "30px";
      // info.style.width = "100%";
      // info.style.textAlign = "center";
      // info.style.color = "#fff";
      // info.style.fontWeight = "bold";
      // info.style.backgroundColor = "transparent";
      // info.style.zIndex = "1";
      // info.style.fontFamily = "Monospace";
      // info.innerHTML = "three.js animataed line using BufferGeometry";
      // document.body.appendChild(info);
      // renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("random-walk-stage").appendChild(renderer.domElement);
      // scene
      scene = new THREE.Scene();
      // camera
      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.set(0, 0, 1000);
      // geometry
      var geometry = new THREE.BufferGeometry();
      // attributes
      var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
      geometry.addAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      // drawcalls
      drawCount = 2; // draw the first 2 points, only
      geometry.setDrawRange(0, drawCount);
      // material
      var material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 2
      });
      // line
      line = new THREE.Line(geometry, material);
      scene.add(line);
      // update positions
      updatePositions();
    }
    // update positions
    function updatePositions() {
      var positions = line.geometry.attributes.position.array;
      var x = (y = z = index = 0);
      for (var i = 0, l = MAX_POINTS; i < l; i++) {
        positions[index++] = x;
        positions[index++] = y;
        positions[index++] = z;
        x += (Math.random() - 0.5) * 10;
        y += (Math.random() - 0.5) * 10;
        z += (Math.random() - 0.5) * 200;
      }
    }
    // render
    function render() {
      renderer.render(scene, camera);
    }
    // animate
    function animate() {
      requestAnimationFrame(animate);
      drawCount = (drawCount + 1) % MAX_POINTS;
      line.geometry.setDrawRange(0, drawCount);
      if (drawCount === 0) {
        // periodically, generate new data
        updatePositions();
        line.geometry.attributes.position.needsUpdate = true; // required after the first render
        line.material.color.setHSL(Math.random(), 1, 0.5);
      }
      render();
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
    return <div id="random-walk-stage" className={styles.wrapper} ref={el => (this.wrapper = el)} />;
  }
}

module.exports = RandomWalk;