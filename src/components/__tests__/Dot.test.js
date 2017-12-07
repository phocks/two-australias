const React = require('react');
const renderer = require('react-test-renderer');

const Dot = require('../Dot');

describe('Dot', () => {
  test('It renders', () => {
    const component = renderer.create(<Dot />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
