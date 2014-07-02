var _ = require( 'lodash' ),
    esprimaParser = require( 'esprima' ).parse;

var isFunctionCall = function( node ) {
  return node.type === 'CallExpression';
};

function Parser ( text, config ) {
  var config = config || {};
  config.prefix = config.prefix || 'app';
  this.config = config;
  this.tree = {};
  this.inspectClass(text, 'Router.map', [ 'resource', 'route' ]);
}

Parser.prototype = Object.create({

  inspectClass: function ( code, path, props ) {
    var mapCall,
        properties,
        ast;

    ast = esprimaParser( code, { range: true, comment: true } );
    mapCall = this.findMapDefinition( path, ast );

    if ( !mapCall || mapCall.arguments.length < 1 ) {
      return this.tree;
    }

    properties = mapCall.arguments[0].body.body;

    properties.forEach( function ( prop ) {

      if ( _.contains( props, prop.expression.callee.property.name ) ) {
        this.buildTree( prop.expression.arguments );
      }

    }.bind(this));
  },

  findMapDefinition: function ( path, root ) {
    var calls = this.findCalls( path, root, 1 );
    if (_.any(calls)) {
      return calls[0];
    }
  },

  findCalls: function ( path, root, limit ) {
    var calls = [];

    if ( !root ) {
      return;
    }

    limit = limit || 50;

    this.walkAst( root, function ( node ) {
      if ( this.matchesPath( node.callee, path ) ) {
        calls.push(node);
      }
      return calls.length < limit;
    }.bind( this ), isFunctionCall );

    return calls;
  },

  walkAst: function ( root, nodeHandler, pred ) {
    var nodesToVisit, node, cont;
    if (!root || !nodeHandler) {
      return;
    }

    // If no predicate specified, visit every node
    pred = pred || _.constant( true );

    nodesToVisit = _.isArray( root ) ? root : [ root ];

    while ( node = nodesToVisit.shift() ) {
      if ( pred(node) ) {
        cont = nodeHandler.call( this, node );
        if (!cont) {
          return;
        }
      }

      // Add children to the queue
      if ( _.isObject( node ) ) {
        nodesToVisit = nodesToVisit.concat(
          _.compact( _.flatten( _.values( node ) ) ) );
      }
    }
  },

  matchesPath: function ( node, path ) {
    var pathSegments, pathSegment, firstPathSegment, current;
    if ( !node || !path ) {
      return false;
    }

    pathSegments = path.split('.');
    firstPathSegment = pathSegments.shift();
    current = node;

    // Traverse up to the top level of the object graph, and compare each name
    // with the corresponding segment of the path
    while ( pathSegment = pathSegments.pop() ) {
      if (!current.property || current.property.name !== pathSegment) {
        return false;
      }

      current = current.object;
    }

    // Top object in the object graph corresponds to the first path segment
    return current.name === firstPathSegment;
  },

  buildTree: function ( nodes ) {

    // Set the top level nodes
    this.tree[ nodes[ 0 ].value ] = this.config.prefix + '/routes/' + nodes[ 0 ].value

    // Start creating the branches of the tree
    if ( nodes.length > 1 && nodes[ 1 ].type === 'FunctionExpression' ) {
      this.createBranch( nodes[ 0 ].value,  nodes[ 1 ].body.body );
    }

  },

  createBranch: function ( root, nodes ) {
    var node, name, path;

    while( node = nodes.shift() ) {
      name = node.expression.arguments[ 0 ].value;
      path = root + '/' + name;

      this.tree[ path ] = this.config.prefix + '/routes/' + path;

      // If we're nested lets recurse
      if ( node.expression.arguments.length === 2 ) {
        this.createBranch( path,  node.expression.arguments[ 1 ].body.body );
      }
    }
  },

  exportTree: function () {
    return this.tree;
  }
});

module.exports = Parser;