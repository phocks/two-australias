const React = require('react');
const renderer = require('react-test-renderer');

const RandomWalk = require('../RandomWalk');

describe('RandomWalk', () => {
  test('It renders', () => {
    const component = renderer.create(<RandomWalk />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
