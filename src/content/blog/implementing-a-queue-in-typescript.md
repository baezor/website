---
title: "Implementing a Queue in TypeScript"
description: "Implementing a queue in TypeScript"
pubDate: 2024-07-14T10:00:00.000Z
categories:
  - TypeScript
  - data-structures
metaDescription: "Build a queue data structure from scratch in TypeScript using linked lists. Includes enqueue, dequeue, peek methods and real-world use cases."
keywords:
  - typescript
  - data structures
  - queue
  - FIFO
  - linked list
  - algorithms
contentType: "technical-tutorial"
---

## What is a Queue?

A queue is a data structure that stores elements using the FIFO (First In First Out) strategy for accessing methods.

Think of a queue as a line of people waiting for a service, like at a bank or a movie theater. The first person in line is the first one to be served (First-In-First-Out, or FIFO). This simple concept has numerous applications in computing.

## Why Queues Matter

Understanding queues helps you grasp more complex data structures and algorithms. Learning queues enhances your programming skills, and implementing one from scratch gives you a deeper understanding of memory management and data organization.

**Real-world applications of queues:**
- **Task scheduling** - Operating systems use queues to manage processes
- **Print spooling** - Print jobs are queued and processed in order
- **Breadth-First Search (BFS)** - Graph traversal algorithms use queues
- **Message queues** - Services like RabbitMQ, Kafka handle asynchronous messaging
- **Request handling** - Web servers queue incoming requests
- **Undo/Redo functionality** - Combined with stacks for complex operations

## Queue Operations

A queue typically supports three core operations:

1. **enqueue(item)** - Add an item to the back of the queue
2. **dequeue()** - Remove and return the front item
3. **peek()** - View the front item without removing it

## How to Implement a Queue in TypeScript

I'll implement a queue using a linked list structure for optimal performance. Using a linked list allows O(1) time complexity for both enqueue and dequeue operations.

### The Node Type

First, define a node structure that holds a value and points to the next node:

```typescript
type Node<T> = {
  value: T;
  next?: Node<T>;
};
```

### The Queue Class

Here's a complete implementation:

```typescript
export default class Queue<T> {
  public length: number;
  private head?: Node<T>;
  private tail?: Node<T>;

  constructor() {
    this.head = this.tail = undefined;
    this.length = 0;
  }

  // Add item to the back of the queue
  enqueue(item: T): void {
    const node = { value: item } as Node<T>;
    this.length++;

    // If queue is empty, new node is both head and tail
    if (!this.tail) {
      this.tail = this.head = node;
      return;
    }

    // Link new node to current tail
    this.tail.next = node;
    // Update tail to new node
    this.tail = node;
  }

  // Remove and return front item
  deque(): T | undefined {
    if (!this.head) {
      return undefined;
    }

    this.length--;

    // Save current head
    const head = this.head;
    // Move head to next node
    this.head = this.head.next;

    // Clean up removed node
    head.next = undefined;

    // If queue is now empty, clear tail
    if (this.length === 0) {
      this.tail = undefined;
    }

    return head.value;
  }

  // View front item without removing
  peek(): T | undefined {
    return this.head?.value;
  }
}
```

## How It Works

**Enqueue (Adding items):**
1. Create a new node with the item
2. If queue is empty, this node becomes both head and tail
3. Otherwise, link it to the current tail and update the tail pointer

**Dequeue (Removing items):**
1. If queue is empty, return undefined
2. Save the head node's value
3. Move the head pointer to the next node
4. Return the saved value

**Peek (Viewing the front):**
1. Return the head's value without modifying the queue

## Complexity Analysis

- **enqueue()**: O(1) - Constant time, just updating tail pointer
- **dequeue()**: O(1) - Constant time, just updating head pointer
- **peek()**: O(1) - Constant time, just reading head value
- **Space**: O(n) - Where n is the number of elements in the queue

This is optimal for queue operations. Compare this to using an array where dequeue would be O(n) due to shifting elements.

## Usage Examples

```typescript
// Create a queue of numbers
const queue = new Queue<number>();

// Add items
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

console.log(queue.length); // 3

// View front item
console.log(queue.peek()); // 1

// Remove items
console.log(queue.deque()); // 1
console.log(queue.deque()); // 2
console.log(queue.length); // 1

// Queue of strings
const taskQueue = new Queue<string>();
taskQueue.enqueue("Process payment");
taskQueue.enqueue("Send email");
taskQueue.enqueue("Update inventory");

while (taskQueue.length > 0) {
  const task = taskQueue.deque();
  console.log(`Processing: ${task}`);
}
```

## Real-World Example: Task Processor

Here's how you might use a queue in a task processing system:

```typescript
interface Task {
  id: string;
  description: string;
  priority: number;
}

class TaskProcessor {
  private queue = new Queue<Task>();

  addTask(task: Task): void {
    this.queue.enqueue(task);
    console.log(`Task added: ${task.description}`);
  }

  processNext(): void {
    const task = this.queue.deque();
    if (task) {
      console.log(`Processing task ${task.id}: ${task.description}`);
      // Simulate processing
      this.executeTask(task);
    } else {
      console.log("No tasks to process");
    }
  }

  private executeTask(task: Task): void {
    // Task execution logic here
  }

  getPendingCount(): number {
    return this.queue.length;
  }
}

// Usage
const processor = new TaskProcessor();
processor.addTask({ id: "1", description: "Send welcome email", priority: 1 });
processor.addTask({ id: "2", description: "Generate report", priority: 2 });
processor.processNext(); // Processes task 1 first (FIFO)
```

## Key Takeaways

- Queues implement FIFO (First In First Out) ordering
- Linked list implementation gives O(1) for enqueue and dequeue
- Essential for BFS algorithms, task scheduling, and async processing
- TypeScript generics make the queue reusable for any type
- Understanding queues is fundamental for system design interviews
- Always maintain head and tail pointers for efficient operations

## When to Use Queues

- When order of processing matters (FIFO)
- For breadth-first search in graphs or trees
- Managing asynchronous tasks
- Implementing buffers or caches
- Rate limiting and throttling requests

## Related Articles

- [How to Set Up Dynamic Imports in Laravel Mix and TypeScript](/blog/setup-dynamic-imports-laravel-mix-typescript/) - Advanced TypeScript configuration
- [Visual Regression Testing with Playwright](/blog/visual-regression-testing-with-playwright/) - Test your TypeScript applications
