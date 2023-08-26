/**
 * @dev implements queue data structure
 */
export default class Queue<T> {
	private items: T[];

	constructor(_items: T[] = []) {
		this.items = _items;
	}

	enqueue(item: T): void {
		this.items.push(item);
	}

	dequeue(): T | undefined {
		return this.items.shift();
	}

	front(): T | undefined {
		return this.items[0];
	}

	back(): T | undefined {
		return this.items[this.items.length - 1];
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	size(): number {
		return this.items.length;
	}
}

// Test
// const queue = new Queue<number>();

// queue.enqueue(1);
// queue.enqueue(2);
// queue.enqueue(3);

// console.log(queue.dequeue()); // Outputs: 1
// console.log(queue.front());    // Outputs: 2
// console.log(queue.back());     // Outputs: 3
// console.log(queue.size());    // Outputs: 2
// console.log(queue.isEmpty()); // Outputs: false
// queue.dequeue();
// queue.dequeue();
// console.log(queue.isEmpty()); // Outputs: true