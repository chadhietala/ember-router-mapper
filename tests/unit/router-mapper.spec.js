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
    expect( tree.index ).to.equal( 'app/routes/index' );
    expect( tree.book ).to.equal( 'app/routes/book' );
    expect( tree.car ).to.equal( 'app/routes/car' );
    expect( tree.cat ).to.equal( 'app/routes/cat' );
  });

  it( 'should capture top level routes', function () {
    expect( tree.post ).to.equal( 'app/routes/post' );
  });

  it( 'should capture nested resources', function () {
    expect( tree[ 'car/baz' ] ).to.equal( 'app/routes/car/baz' );
    expect( tree[ 'car/baz/fizz' ] ).to.equal( 'app/routes/car/baz/fizz' );
  });

  it( 'should capture nested routes', function () {
    expect( tree[ 'car/new' ] ).to.equal( 'app/routes/car/new' );
    expect( tree[ 'cat/lion' ] ).to.equal( 'app/routes/cat/lion' );
    expect( tree[ 'car/baz/boo' ] ).to.equal( 'app/routes/car/baz/boo' );
    expect( tree[ 'car/baz/fizz/dog' ] ).to.equal( 'app/routes/car/baz/fizz/dog' );
  });

});