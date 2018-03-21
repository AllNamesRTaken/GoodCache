export class Cache<T> {
	public size: number;
	public count: number;
	public hit(key: string): boolean;
	public get(key: string): T | null;
	public push(key: string, data: T);
	public getStaged(key: string): T | null;
	public stage(key: string, data: T): void;
	public publish(key: string): void;
	public remove(key: string):void;
	public cache(obj: Object, fnName: string, keyFn?: (...args: any[]) => string): void
    public clear();
}