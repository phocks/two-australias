const React = require("react");
const Stardust = require("stardust-core");
const StardustWebGL = require("stardust-webgl");
const D3Timer = require("d3-timer");
const THREE = require("three");
const d3 = require("d3");

const styles = require("./App.scss");

const Sunflower = require("./Sunflower");
const RandomWalk = require("./RandomWalk");
const Cloud = require("./Cloud");
const Dot = require("./Dot");

class App extends React.Component {
  componentDidMount() {
    
  }
  componentWillUnmount() {}
  render() {
    return (
      <div className={styles.root}>
        {/* Welcome to the app! */}
        {/* <canvas id="main-canvas" /> */}
        {/* <RandomWalk /> */}
        <Sunflower />
        {/* < Cloud /> */}
        {/* <Dot /> */}
      </div>
    );
  }
}

module.exports = App;
