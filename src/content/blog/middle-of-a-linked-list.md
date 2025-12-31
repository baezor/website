---
title: "Middle of the Linked List: Two-Pointer Technique"
description: "Solving the middle of the linked list problem on Leetcode"
pubDate: 2024-07-07T11:00:00.000Z
categories:
  - leetcode
  - algorithms
metaDescription: "Learn how to find the middle of a linked list using the two-pointer technique. Includes array-based and optimal solutions with complexity analysis."
keywords:
  - leetcode
  - algorithms
  - javascript
  - linked list
  - two pointer
  - data structures
contentType: "algorithm"
---

## TL;DR

To find the middle node of a linked list, use the two-pointer (tortoise and hare) technique: move one pointer by one step and another by two steps. When the fast pointer reaches the end, the slow pointer will be at the middle. Time: O(n), Space: O(1).

## Understanding the Problem

Given the head of a singly linked list, return the middle node. If there are two middle nodes (even length), return the second middle node.

**Why this problem matters:** Linked lists are fundamental data structures used in many applications like implementing queues, undo functionality, and browser history. Finding the middle efficiently is crucial for operations like:
- Merging sorted linked lists
- Detecting cycles
- Implementing the palindrome check

Unlike arrays, linked lists don't support direct index access. You can't just jump to `list[length/2]`. This makes finding the middle an interesting algorithmic challenge.

## Solution Approaches

### Approach 1: Array-Based (My Initial Solution)

The straightforward approach is to traverse the list once, storing all nodes in an array, then return the middle element by index.

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var middleNode = function (head) {
  // Store all nodes in an array
  let A = [head];

  // Traverse the linked list and collect all nodes
  while (A[A.length - 1].next != null) {
    A.push(A[A.length - 1].next);
  }

  // Return the middle node (using Math.trunc to handle division)
  return A[Math.trunc(A.length / 2)];
};
```

**Pros:** Simple to understand and implement
**Cons:** Uses O(n) extra space for the array

### Approach 2: Two-Pointer Technique (Optimal)

The elegant solution uses two pointers moving at different speeds - often called the "tortoise and hare" approach.

```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var middleNode = function (head) {
  let slow = head;
  let fast = head;

  // Move slow by 1, fast by 2
  // When fast reaches the end, slow will be at middle
  while (fast !== null && fast.next !== null) {
    slow = slow.next;       // Move 1 step
    fast = fast.next.next;  // Move 2 steps
  }

  return slow;
};
```

**Why this works:** The fast pointer moves twice as fast as the slow pointer. When the fast pointer reaches the end (or can't move further), the slow pointer has traveled exactly half the distance - putting it right at the middle.

**Example walkthrough** for list `1 -> 2 -> 3 -> 4 -> 5`:
- Start: slow = 1, fast = 1
- Step 1: slow = 2, fast = 3
- Step 2: slow = 3, fast = 5
- fast.next is null, so we stop → slow is at node 3 (the middle)

## Complexity Analysis

### Array-Based Approach:
- **Time Complexity: O(n)** - Single traversal of the list
- **Space Complexity: O(n)** - Array stores all n nodes

### Two-Pointer Approach:
- **Time Complexity: O(n)** - Single traversal (technically n/2 steps for slow pointer)
- **Space Complexity: O(1)** - Only two pointer variables

The two-pointer approach is more space-efficient, making it the preferred solution for most interviews.

## Testing the Solution

Let's test both approaches with a few examples:

**Example 1:** List with odd length
```js
// Input: 1 -> 2 -> 3 -> 4 -> 5
// Output: Node with value 3
// Explanation: Middle is at position 3 (1-indexed)
```

**Example 2:** List with even length
```js
// Input: 1 -> 2 -> 3 -> 4 -> 5 -> 6
// Output: Node with value 4
// Explanation: Two middle nodes (3 and 4), return the second one
```

**Edge cases:**
- Single node list: `1` → Returns node 1
- Two node list: `1 -> 2` → Returns node 2 (second middle)

## Key Takeaways

- The two-pointer technique is a powerful pattern for linked list problems
- "Slow and fast" pointers can solve many linked list challenges efficiently
- Always consider space complexity - can you solve it without extra data structures?
- When dealing with even-length lists, clarify which middle node to return
- This same technique works for finding cycles in linked lists

## More LeetCode Solutions

Continue practicing with these algorithm problems:
- [FizzBuzz](/blog/fizzbuzz/) - Classic interview question with conditional logic
- [Number of Steps to Reduce a Number to Zero](/blog/number-of-steps-to-reduce-a-number-to-zero/) - Understanding logarithmic complexity
- [Array Problems](/blog/sum-of-1d-array/) - Running sums and array manipulation
