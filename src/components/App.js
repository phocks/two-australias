const React = require("react");
const Stardust = require("stardust-core");
const StardustWebGL = require("stardust-webgl");
const D3Timer = require("d3-timer");

const styles = require("./App.scss");

class App extends React.Component {
  componentDidMount() {
    console.log("Did mount!!");

    // Get our canvas element
    var canvas = document.getElementById("main-canvas");
    var width = 960;
    var height = 500;

    // // Create a WebGL 2D platform on the canvas:
    var platform = Stardust.platform("webgl-2d", canvas, width, height);

    // ... Load data and render your visualization
    var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    var circleSpec = Stardust.mark.circle();

    var circles = Stardust.mark.create(circleSpec, platform);

    circles.attr("center", d => [d * 80, d * 20]);
    circles.attr("radius", d => d * 3);
    circles.attr("color", [0, 0, 0, 1]);

    circles.data(data);

    circles.render();

    function animate() {
      circles.attr("radius", d => d * Math.random() * 3);
      circles.render();
      // console.log("Aniamted!");
    }

    const timer = D3Timer.interval(animate, 1000 / 2);
  }
  componentWillUnmount() {}
  render() {
    return (
      <div id="stage" className={styles.root}>
        {/* Welcome to the app! */}
        <canvas id="main-canvas" />
      </div>
    );
  }
}

module.exports = App;
