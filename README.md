# Ember Router Mapper

Does statical analysis on the Ember Router to pull out top level and nested routes/resource names that can be mapped back on to the file system.

This will possibly be used in generating bundles of files based on routes.

Given a router that looks like this

```
import Ember from "ember";
var Router = Ember.Router.extend({
    location: FooENV.locationType
});
Router.map(function () {
    this.resource("index");
    this.route("post");
    this.resource("book", {
        path: "/foo"
    });
    this.resource("car", function () {
        this.route("new");
        this.resource("baz", function () {
            this.route("boo");
            this.resource("fizz", function () {
                this.route("dog")
            })
        });
    });
    this.resource("cat", function () {
        this.route("lion")
    })
});
export default Router;

```

It will produce this.

```
{
  "index": "app/routes/index",
  "post": "app/routes/post",
  "book": "app/routes/book",
  "car": "app/routes/car",
  "car/new": "app/routes/car/new",
  "car/baz": "app/routes/car/baz",
  "car/baz/boo": "app/routes/car/baz/boo",
  "car/baz/fizz": "app/routes/car/baz/fizz",
  "car/baz/fizz/dog": "app/routes/car/baz/fizz/dog",
  "cat": "app/routes/cat",
  "cat/lion": "app/routes/cat/lion"
}

```

## Install

```
npm install
```

## Testing

```
npm test
```