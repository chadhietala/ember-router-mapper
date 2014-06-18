var expect = require( 'chai' ).expect;
var Parser = require( '../../main.js' );
var router = require( '../fixtures/router.js' );


describe('Parser', function () {
  var tree;
  beforeEach(function () {
    var parser = new Parser( router );
    tree = parser.exportTree();
  });

  it( 'should generate a map', function () {
    expect( tree ).to.be.a( 'object' );
  });

  it( 'should capture top level resources', function () {
    expect( tree.index ).to.equal( 'app/index' );
    expect( tree.book ).to.equal( 'app/book' );
    expect( tree.car ).to.equal( 'app/car' );
    expect( tree.cat ).to.equal( 'app/cat' );
  });

  it( 'should capture top level routes', function () {
    expect( tree.post ).to.equal( 'app/post' );
  });

  it( 'should capture nested resources', function () {
    expect( tree[ 'car/baz' ] ).to.equal( 'app/car/baz' );
    expect( tree[ 'car/baz/fizz' ] ).to.equal( 'app/car/baz/fizz' );
  });

  it( 'should capture nested routes', function () {
    expect( tree[ 'car/new' ] ).to.equal( 'app/car/new' );
    expect( tree[ 'cat/lion' ] ).to.equal( 'app/cat/lion' );
    expect( tree[ 'car/baz/boo' ] ).to.equal( 'app/car/baz/boo' );
    expect( tree[ 'car/baz/fizz/dog' ] ).to.equal( 'app/car/baz/fizz/dog' );
  });

});