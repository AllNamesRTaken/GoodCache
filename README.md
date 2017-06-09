# GoodCache
A fifo based cache for Node and browser, uses the GoodCore library.

# Usage
Install from npm.

Simple example

    const fifo = new Cache<string>();
    fifo.push("in fifo", "data");
    fifo.hit("in fifo");

Simple caching of a class function

    const test = new TestClass();
    fifo.cache(test, "TestFn");
    test.TestFn("test"); // returns some value
    test.TestFn("test"); // returns cached value

Advanced caching of a class function

    const test = new TestClass();
    fifo.cache(test, "TestFn", (...args) => { return "some key string depending on the args"; } );
    test.TestFn("test"); // returns some value
    test.TestFn("test"); // returns cached value if the key function returns the same

For more look at the tests.
