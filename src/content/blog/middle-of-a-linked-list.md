---
title: "Middle of the linked list"
description: "Solving the middle of the linked list problem on Leetcode"
pubDate: 2024-07-07T11:00:00.000Z
categories:
  - leetcode
  - algorithms
---

## Middle of The Linked List

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
  let A = [head];
  while (A[A.length - 1].next != null) A.push(A[A.length - 1].next);
  return A[Math.trunc(A.length / 2)];
};
```
