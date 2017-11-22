const React = require("react");
const styles = require("./App.scss");
const worm = require("./worm.svg");
const PIXIE = require("pixi.js");

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
var app = new PIXI.Application();

console.log(app.view);

// load the texture we need
PIXI.loader.add("bunny", "bunny.png").load(function(loader, resources) {
  // This creates a texture from a 'bunny.png' image.
  var bunny = new PIXI.Sprite(resources.bunny.texture);

  // Setup the position of the bunny
  bunny.x = app.renderer.width / 2;
  bunny.y = app.renderer.height / 2;

  // Rotate around the center
  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;

  // Add the bunny to the scene we are building.
  app.stage.addChild(bunny);

  // Listen for frame updates
  app.ticker.add(function() {
    // each frame we spin the bunny around a bit
    bunny.rotation += 0.01;
  });
});

class App extends React.Component {
  componentDidMount() {
    console.log("Did mount!!");

    document.getElementById("stage").appendChild(app.view);
  }
  componentWillUnmount() {
    app.stage.removeChild(bunny);
  }
  render() {
    return (
      <div id="stage" className={styles.root}>
        
      </div>
    );
  }
}

module.exports = App;
