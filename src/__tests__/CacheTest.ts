import { Cache } from "../Cache";

describe("Cache",
	() => {
		it("Hit Should Only Hit When Pushed In Cache",
			function(){
				const fifo = new Cache<string>();
				fifo.push("in fifo", "data");
				expect(fifo.hit("not in fifo")).toBe(false);
				expect(fifo.hit("in fifo")).toBe(true);
			});
		it("Stage Should Require Publish To Push In Cache",
			function(){
				const fifo = new Cache<string>();
				fifo.stage("in fifo", "data");
				expect(fifo.hit("in fifo")).toBe(false);
				fifo.publish("in fifo");
				expect(fifo.hit("in fifo")).toBe(true);
			});
		it("Push Should Remove Overflowing Data FIFO",
			function(){
				const fifo = new Cache<string>(2);
				fifo.push("1", "1");
				fifo.push("2", "2");
				expect(fifo.hit("1")).toBe(true);
				expect(fifo.hit("2")).toBe(true);
				fifo.push("3", "3");
				expect(fifo.hit("1")).toBe(false);
				expect(fifo.hit("2")).toBe(true);
				expect(fifo.hit("3")).toBe(true);
			});
		it("Get Should Get Data Or Null",
			function(){
				const fifo = new Cache<string>(2);
				fifo.push("1", "data1");
				expect(fifo.get("1")!).toBe("data1");
				expect(fifo.get("2") === null).toBe(true);
			});
		it("Count and StageCount returns correct values",
			function(){
				const fifo = new Cache<string>(2);
				fifo.push("1", "data1");
				fifo.push("2", "data1");
				fifo.stage("1", "data1");
				expect(fifo.count).toBe(2);
				expect(fifo.stageCount).toBe(1);
			});
		it("Clear invalidates the cache",
			function(){
				const fifo = new Cache<string>(2);
				fifo.push("1", "data1");
				fifo.clear();
				expect(fifo.count).toBe(0);
				expect(fifo.stageCount).toBe(0);
			});
		it("CacheFn makes a function cached",
			function() {
				const fifo = new Cache<string>(10);
				class TestClass {
					public i = 0;
					public TestFn(param: string) {
						return param + this.i++;
					}
				}
				const test = new TestClass();
				expect(test.TestFn("test")).toBe("test0");
				fifo.cache(test, "TestFn");
				expect(test.TestFn("test")).toBe("test1");
				expect(test.TestFn("another")).toBe("another2");
				expect(test.TestFn("test")).toBe("test1");
			});
		it("Size returns the max size of the Cache",
			function(){
				const fifo = new Cache<string>(10);
				expect(fifo.size).toBe(10);
			});
		it("Setting Size trims the cache content to set value",
			function(){
				const fifo = new Cache<string>(10);
				expect(fifo.size).toBe(10);
				fifo.push("1", "data1");
				fifo.push("2", "data1");
				fifo.push("3", "data1");
				expect(fifo.count).toBe(3);
				fifo.size = 2;
				expect(fifo.count).toBe(2);
				expect(fifo.size).toBe(2);
			});
		it("Size returns the max size of the Cache",
			function(){
				const fifo = new Cache<string>(10);
				fifo.stage("1", "data1");
				expect(fifo.getStaged("1")!).toBe("data1");
			});
		it("Remove removes one value from the cache",
			function(){
				const fifo = new Cache<string>(10);
				fifo.push("1", "data1");
				fifo.remove("1");
				expect(fifo.count).toBe(0);
			});
	}
);
