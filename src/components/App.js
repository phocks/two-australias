const React = require("react");
const styles = require("./App.scss");
const worm = require("./worm.svg");




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
