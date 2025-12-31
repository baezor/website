---
title: "Array Problems: Running Sum and Maximum Wealth"
description: "Solving Sum of 1d Array and Richest Customer Wealth problems on Leetcode."
pubDate: 2024-07-04T11:00:00.000Z
categories:
  - leetcode
  - algorithms
metaDescription: "Learn to solve two LeetCode array problems: Running Sum of 1D Array and Richest Customer Wealth. Includes in-place and functional approaches."
keywords:
  - leetcode
  - algorithms
  - javascript
  - arrays
  - array manipulation
contentType: "algorithm"
---

This post covers two beginner-friendly array problems from LeetCode that teach fundamental array manipulation techniques.

## Problem 1: Running Sum of 1D Array

### TL;DR

Calculate cumulative sum at each position by adding the previous sum to the current element. Time: O(n), Space: O(1) with in-place modification.

### Understanding the Problem

Given an array `nums`, calculate the running sum where `runningSum[i] = sum(nums[0]...nums[i])`.

**Example:**
```
Input: nums = [1,2,3,4]
Output: [1,3,6,10]
Explanation: [1, 1+2, 1+2+3, 1+2+3+4] = [1,3,6,10]
```

**Why this matters:** Running sums are used in:
- Calculating cumulative statistics (total revenue over time)
- Prefix sums for range query optimization
- Moving averages in data analysis
- Game score tracking

### Solution Approach

The key insight is that each element in the result depends only on the previous sum and the current element. We can modify the array in-place, eliminating the need for extra space.

**Strategy:**
1. Keep the first element as-is (it's already the sum of itself)
2. For each subsequent element, add the previous running sum
3. Each position now contains the cumulative sum up to that index

### Implementation

```js
/**
 * Overwritten Input Approach
 *
 * @param {number[]} nums
 * @return {number[]}
 */
const runningSum = function (nums) {
  // Start from index 1 (index 0 is already the running sum)
  for (let i = 1; i < nums.length; i++) {
    // Add previous sum to current element
    nums[i] += nums[i - 1];
  }
  return nums;
};
```

**Alternative: Non-destructive approach**
```js
const runningSum = function (nums) {
  const result = [nums[0]];
  for (let i = 1; i < nums.length; i++) {
    result.push(result[i - 1] + nums[i]);
  }
  return result;
};
```

### Complexity Analysis

**In-place approach:**
- **Time Complexity: O(n)** - Single pass through the array
- **Space Complexity: O(1)** - No extra space (modifying input)

**Non-destructive approach:**
- **Time Complexity: O(n)**
- **Space Complexity: O(n)** - New array for results

### Testing

```js
runningSum([1,2,3,4])
// Output: [1,3,6,10]

runningSum([1,1,1,1,1])
// Output: [1,2,3,4,5]

runningSum([3,1,2,10,1])
// Output: [3,4,6,16,17]
```

---

## Problem 2: Richest Customer Wealth

### TL;DR

Find maximum row sum in a 2D array. Use `reduce()` to sum each customer's accounts, track the maximum. Time: O(m×n), Space: O(1).

### Understanding the Problem

Given a 2D array `accounts` where `accounts[i][j]` represents customer `i`'s money in bank `j`, find the maximum total wealth among all customers.

**Example:**
```
Input: accounts = [[1,2,3],[3,2,1]]
Output: 6
Explanation:
  Customer 1: 1+2+3 = 6
  Customer 2: 3+2+1 = 6
  Maximum wealth = 6
```

**Why this matters:** This pattern of finding max/min in grouped data appears in:
- Financial analysis (highest revenue per category)
- Performance metrics (best score per team)
- Data aggregation (maximum sales per region)

### Solution Approach

We need to:
1. Calculate the total wealth for each customer (sum their row)
2. Track the maximum wealth seen so far
3. Return the maximum

**Key technique:** Combine `forEach` for iteration with `reduce` for summing.

### Implementation

```js
/**
 * Find wealthiest customer
 *
 * @param {number[][]} accounts
 * @return {number}
 */
const maximumWealth = function (accounts) {
  let max = 0;

  // Check each customer's total wealth
  accounts.forEach((account) => {
    // Sum all bank accounts for this customer
    const sum = account.reduce((prev, curr) => prev + curr, 0);

    // Update max if this customer is wealthier
    if (sum > max) {
      max = sum;
    }
  });

  return max;
};
```

**Alternative: Functional approach**
```js
const maximumWealth = function (accounts) {
  return Math.max(...accounts.map(account =>
    account.reduce((sum, amount) => sum + amount, 0)
  ));
};
```

This uses:
- `map()` to transform each account array into its sum
- Spread operator `...` to pass sums as arguments to `Math.max()`

### Complexity Analysis

- **Time Complexity: O(m × n)** - Where m is customers and n is banks per customer
- **Space Complexity: O(1)** - Only tracking max value

### Testing

```js
maximumWealth([[1,2,3],[3,2,1]])
// Output: 6

maximumWealth([[1,5],[7,3],[3,5]])
// Output: 10 (customer 2: 7+3)

maximumWealth([[2,8,7],[7,1,3],[1,9,5]])
// Output: 17 (customer 1: 2+8+7)
```

## Key Takeaways

- **Running Sum**: In-place modification saves space when input mutation is acceptable
- **Array Reduce**: Perfect for calculating sums and aggregations
- **Functional Programming**: `map()`, `reduce()`, and `Math.max()` can create elegant one-liners
- Both problems demonstrate O(n) array traversal patterns
- Consider whether to mutate input or create new arrays based on requirements

## More LeetCode Solutions

Practice more algorithm problems:
- [FizzBuzz](/blog/fizzbuzz/) - Conditional logic and modulo operations
- [Middle of a Linked List](/blog/middle-of-a-linked-list/) - Two-pointer technique
- [Number of Steps to Reduce a Number to Zero](/blog/number-of-steps-to-reduce-a-number-to-zero/) - Logarithmic complexity patterns
