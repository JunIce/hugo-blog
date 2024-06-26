---
title: "8. String to Integer (atoi)"
date: 2022-11-05T11:41:23+08:00
draft: true
categories: ["algorithm"]
---



# 8. String to Integer (atoi)



## 题目

Implement the `myAtoi(string s)` function, which converts a string to a 32-bit signed integer (similar to C/C++'s `atoi` function).

The algorithm for `myAtoi(string s)` is as follows:

1. Read in and ignore any leading whitespace.
2. Check if the next character (if not already at the end of the string) is `'-'` or `'+'`. Read this character in if it is either. This determines if the final result is negative or positive respectively. Assume the result is positive if neither is present.
3. Read in next the characters until the next non-digit character or the end of the input is reached. The rest of the string is ignored.
4. Convert these digits into an integer (i.e. `"123" -> 123`, `"0032" -> 32`). If no digits were read, then the integer is `0`. Change the sign as necessary (from step 2).
5. If the integer is out of the 32-bit signed integer range `[-231, 231 - 1]`, then clamp the integer so that it remains in the range. Specifically, integers less than `-231` should be clamped to `-231`, and integers greater than `231 - 1` should be clamped to `231 - 1`.
6. Return the integer as the final result.

**Note:**

- Only the space character `' '` is considered a whitespace character.
- **Do not ignore** any characters other than the leading whitespace or the rest of the string after the digits.

 

**Example 1:**

```
Input: s = "42"
Output: 42
Explanation: The underlined characters are what is read in, the caret is the current reader position.
Step 1: "42" (no characters read because there is no leading whitespace)
         ^
Step 2: "42" (no characters read because there is neither a '-' nor '+')
         ^
Step 3: "42" ("42" is read in)
           ^
The parsed integer is 42.
Since 42 is in the range [-231, 231 - 1], the final result is 42.
```

**Example 2:**

```
Input: s = "   -42"
Output: -42
Explanation:
Step 1: "   -42" (leading whitespace is read and ignored)
            ^
Step 2: "   -42" ('-' is read, so the result should be negative)
             ^
Step 3: "   -42" ("42" is read in)
               ^
The parsed integer is -42.
Since -42 is in the range [-231, 231 - 1], the final result is -42.
```

**Example 3:**

```
Input: s = "4193 with words"
Output: 4193
Explanation:
Step 1: "4193 with words" (no characters read because there is no leading whitespace)
         ^
Step 2: "4193 with words" (no characters read because there is neither a '-' nor '+')
         ^
Step 3: "4193 with words" ("4193" is read in; reading stops because the next character is a non-digit)
             ^
The parsed integer is 4193.
Since 4193 is in the range [-231, 231 - 1], the final result is 4193.
```

 



## 代码



利用内置的方法进行格式化

```typescript
function myAtoi(str: string): number {
  str = str.trim();
    let strArr = str.split(" ");
    let firstWord = strArr[0];
    if(parseInt(firstWord)){
        let num = parseInt(firstWord);
        if(num >= Math.pow(2,31)){
            return (Math.pow(2,31)-1);
        }else if(num < Math.pow(-2,31)){
            return Math.pow(-2,31);
        }else{
            return num;
        }
    }else{
        return 0;
    }  
}
```



利用正则

```typescript
var myAtoi = function(str) {
  str = str.trimLeft(); // remove whitespace from beginning of string

  if (!/[\d+-]/.test(str[0])) return 0; // if first character is not +,- or a digit

  const number = Number(str.match(/[+-]?\d*/)); // regex means: optional(+,-) follows by zero (case " +  514 " => expect 0) or more digits
  if (Number.isNaN(number)) return 0; // invalid integral number. eg: " +  514" => expect 0 (Number('+') => NaN)

  const MAX_INT = 2 ** 31 - 1;
  const MIN_INT = - (2 ** 31);
  if (number < MIN_INT) return MIN_INT;
  if (number > MAX_INT) return MAX_INT;
  return number;
};
```

基本循环解决

```typescript
function myAtoi(s: string): number {
  let result = "";
  s = s.trim()
  let sIndex = 0;
  let base = 1;

  if(s[0] == '-') {
    sIndex = 1;
    base = -1
  }

  if(s[0] == '+') {
    sIndex = 1
  }

  for (let i = sIndex; i < s.length; i++) {
    if (s[i] == " ") {
      break;
    } else if (!Number.isNaN(Number(s[i]))) {
      result += s[i];
    } else {
      break;
    }
  }

  const max = Math.pow(2, 31);
  console.log(base, result);
  if (Number(result) >= max) {
    return base == 1 ? max - 1 : -max
  }

  return Number.isNaN(Number(result)) ? 0 : Number(result) * base;
}
```