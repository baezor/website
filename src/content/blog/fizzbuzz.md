---
title: "FizzBuzz: Classic Coding Interview Problem"
description: "How I solved the FizzBuzz problem on Leetcode."
pubDate: 2024-07-05T11:00:00.000Z
categories:
  - algorithms
  - leetcode
metaDescription: "Learn how to solve the FizzBuzz problem on LeetCode using conditional logic. Includes step-by-step walkthrough, complexity analysis, and testing examples."
keywords:
  - leetcode
  - algorithms
  - javascript
  - fizzbuzz
  - coding interview
contentType: "algorithm"
---

## TL;DR

FizzBuzz asks you to return an array of strings from 1 to n, where multiples of 3 become "Fizz", multiples of 5 become "Buzz", and multiples of both become "FizzBuzz". The solution uses modulo operations to check divisibility with O(n) time complexity.

## Understanding the Problem

FizzBuzz is one of the most common coding interview questions, often used as a screening test. Despite its simplicity, it effectively tests your understanding of:

- Basic loop structures
- Conditional logic
- Modulo arithmetic
- String manipulation

The problem statement is straightforward: given an integer `n`, return a string array where:
- For multiples of 3, output "Fizz"
- For multiples of 5, output "Buzz"
- For multiples of both 3 and 5, output "FizzBuzz"
- For all other numbers, output the number as a string

**Why this matters:** While FizzBuzz might seem trivial, variations of this pattern appear frequently in real applications. For example, you might need to categorize items based on multiple criteria, apply conditional formatting, or implement rule-based systems.

## Solution Approach

The key insight is using the modulo operator (`%`) to check divisibility. A number is divisible by another if the remainder is zero.

Here's my thinking process:

1. **Create a result array** to store our answers
2. **Loop from 1 to n** (inclusive)
3. **For each number**, check divisibility by 3 and 5
4. **Build the answer string** based on these checks
5. **If neither condition is true**, use the number itself

The clever part is checking both conditions independently and concatenating "Fizz" and "Buzz" when needed. This naturally handles the "FizzBuzz" case without an extra conditional.

## Implementation

```js
/**
 * @param {number} n
 * @return {string[]}
 */
const fizzBuzz = function (n) {
  let result = [];

  // Iterate from 1 to n (inclusive)
  for (let i = 1; i <= n; i++) {
    let answer = "";

    // Check if divisible by 3
    const fizz = i % 3 === 0;
    // Check if divisible by 5
    const buzz = i % 5 === 0;

    // Add "Fizz" if divisible by 3
    if (fizz) {
      answer += "Fizz";
    }

    // Add "Buzz" if divisible by 5
    if (buzz) {
      answer += "Buzz";
    }

    // If neither, use the number itself
    if (!answer.length) {
      answer = i.toString();
    }

    result.push(answer);
  }

  return result;
};
```

**Why this approach works:** By checking conditions independently and concatenating strings, numbers divisible by both 3 and 5 (like 15) automatically become "FizzBuzz" without needing a separate check.

## Complexity Analysis

- **Time Complexity: O(n)** - We iterate through numbers from 1 to n exactly once
- **Space Complexity: O(1)** - Not counting the output array, we only use a few variables

The space complexity for the output array is O(n) since we need to store n elements, but this is required by the problem and not considered extra space.

## Testing the Solution

Let's walk through an example with n = 15:

```js
fizzBuzz(15);
// Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
```

**Why this works:**
- 3, 6, 9, 12 → Divisible by 3 → "Fizz"
- 5, 10 → Divisible by 5 → "Buzz"
- 15 → Divisible by both → "FizzBuzz"
- All others → Just the number

**Edge cases to consider:**
- n = 1: Should return ["1"]
- n = 3: Should return ["1","2","Fizz"]
- n = 5: Should return ["1","2","Fizz","4","Buzz"]

## Key Takeaways

- The modulo operator is your friend for divisibility checks
- Independent conditionals can be cleaner than nested if-else
- Simple problems can have elegant solutions
- Always consider edge cases in your testing

## More LeetCode Solutions

If you enjoyed this problem, check out my other algorithm solutions:
- [Middle of a Linked List](/blog/middle-of-a-linked-list/) - Learn the two-pointer technique
- [Number of Steps to Reduce a Number to Zero](/blog/number-of-steps-to-reduce-a-number-to-zero/) - Practice with bit manipulation
- [Array Problems: Running Sum and Maximum Wealth](/blog/sum-of-1d-array/) - Master array manipulation
