const React = require('react');
const renderer = require('react-test-renderer');

const Sunflower = require('../Sunflower');

describe('Sunflower', () => {
  test('It renders', () => {
    const component = renderer.create(<Sunflower />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
