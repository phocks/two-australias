const React = require('react');
const renderer = require('react-test-renderer');

const Cloud = require('../Cloud');

describe('Cloud', () => {
  test('It renders', () => {
    const component = renderer.create(<Cloud />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
