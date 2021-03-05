// import { List } from "goodcore/struct/List";
import { remove } from "goodcore/Arr";
import { Dictionary } from "goodcore/struct/Dictionary";
import { setProperties } from "goodcore/Obj";
import { Md5 } from "ts-md5/dist/md5";
import { proxyFn } from "goodcore/Util"

export class CacheObject<T> implements IInitable {
	public Key: string|null = null;
	public Data: T|null = null;

	public init(obj: Object): any {
		setProperties(this, obj);
		return this as any;
	}
}

class CacheConst {
	public static DEFAULT_FIFO_SIZE: number = 100;
}
export class Cache<T> {
	private _size: number = CacheConst.DEFAULT_FIFO_SIZE;
	private _order: string[] = [];
	private _data: Dictionary<CacheObject<T>> = new Dictionary<CacheObject<T>>();
	private _stage: Dictionary<CacheObject<T>> = new Dictionary<CacheObject<T>>();

	public get size(): number {
		return this._size;
	}
	public set size(value: number) {
		if ((value !== this._size)
			&& (value >= 0)) {
			this._size = value;
			this.trim();
		}
	}
	public get count(): number {
		return this._order.length;
	}
	public get stageCount(): number {
		return this._stage.count;
	}
	public constructor(size: number = CacheConst.DEFAULT_FIFO_SIZE) {
		this._size = size;
	}
	public hit(key: string): boolean {
		return this._data.has(key);
	}
	public get(key: string): T | null {
		let result: T|null;
		result = this.hit(key) ? this._data.lookup(key)!.Data : null;
		return result;
	}
	public push(key: string, data: T) {
		this.add(key, data);
	}
	public getStaged(key: string): T | null {
		let result: T|null;
		result = this._stage.has(key) ? this._stage.lookup(key)!.Data : null;
		return result;
	}
	public stage(key: string, data: T) {
		this._stage.add(key, new CacheObject<T>().init({ Key: key, Data: data }));
	}
	public publish(key: string) {
		if (this._stage.has(key)) {
			this.add(key, this._stage.lookup(key)!.Data!);
			this._stage.delete(key);
		}

	}
	public remove(key: string) {
		if (this.hit(key)) {
			this._data.delete(key);
			remove(this._order, key);
		}

	}
	public cache(obj: Object, fnName: string, keyFn?: (...args: any[]) => string): void {
		if (keyFn === undefined) {
			keyFn = function(...args: any[]): string {
				return Md5.hashStr(args.reduce((acc: string, cur: any) => acc += JSON.stringify(cur), "")) as string;
			};
		}
		const proxy = (superFn: Function, ...args: any[]) => {
			const key = keyFn!(...args);
			if (key !== null && this.hit(key)) {
				return this.get(key);
			}
			const result = superFn(...args);
			if (key !== null) {
				this.add(key, result);
			}
			return result;
		};

		proxyFn(obj as any, fnName, proxy);
	}
	public clear() {
		this._data.clear();
		this._order.length = 0
		this._stage.clear();
	}
	private add(key: string, data: T) {
		if (this.hit(key)) {
			remove(this._order, key);
		}
		let obj = new CacheObject<T>();
		obj.init({ Key: key, Data: data });
		this._data.add(key, obj);
		this._order.push(key);
		this.trim();
	}

	private trim() {
		while ((this._order.length > this._size)) {
			this._data.remove(this._order[0]);
			this._order.shift();
		}
	}
}
