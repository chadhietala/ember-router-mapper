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
  "index": "app/index",
  "post": "app/post",
  "book": "app/book",
  "car": "app/car",
  "car/new": "app/car/new",
  "car/baz": "app/car/baz",
  "car/baz/boo": "app/car/baz/boo",
  "car/baz/fizz": "app/car/baz/fizz",
  "car/baz/fizz/dog": "app/car/baz/fizz/dog",
  "cat": "app/cat",
  "cat/lion": "app/cat/lion"
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