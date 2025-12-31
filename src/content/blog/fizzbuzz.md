---
title: "FizzBuzz"
description: "How I solved the FizzBuzz problem on Leetcode."
pubDate: 2024-07-05T11:00:00.000Z
categories:
  - algorithms
  - leetcode
---

### FizzBuzz

My solution:

```js
/**
 * @param {number} n
 * @return {string[]}
 */
const fizzBuzz = function (n) {
  let result = [];
  for (let i = 1; i <= n; i++) {
    let answer = "";
    const fizz = i % 3 === 0;
    const buzz = i % 5 === 0;

    if (fizz) {
      answer += "Fizz";
    }

    if (buzz) {
      answer += "Buzz";
    }

    if (!answer.length) {
      answer = i.toString();
    }

    result.push(answer);
  }

  console.log(result);
  return result;
};
```

- Time Complexity: O(n)
- Space Complexity: O(1)
