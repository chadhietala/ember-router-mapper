var router = 'import Ember from "ember";' +
            'var Router = Ember.Router.extend({' +
              'location: PhoenixENV.locationType' +
            '});' +
            'Router.map(function() {' +
              'this.resource( "index" );' +
              'this.route( "post" );' +
              'this.resource( "book", { path: "/foo"} );' +
              'this.resource( "car", function () {' +
                'this.route( "new" );' +
                'this.resource( "baz", function() {' +
                  'this.route("boo");' +
                  'this.resource("fizz", function() {' +
                    'this.route("dog")' +
                  '})' +
                '});' +
              '});'+
              'this.resource("cat", function() {' +
                'this.route("lion")' +
              '})'+
            '});' +
            'export default Router;';

module.exports = router;