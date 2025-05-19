/* eslint-disable no-extra-parens */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
'use strict';

// prettier-ignore
const curry = (fn) => (...args) => {
  return (args.length < fn.length) ? curry(fn.bind(null, ...args)) : fn(...args);
};

// prettier-ignore
const compose = (...fns) => (arg) => fns.reduceRight((arg, fn) => fn(arg), arg);

// prettier-ignore
const chain = (...fns) => (arg) => fns.reduce((arg, fn) => fn(arg), arg);

module.exports = { curry, compose, chain };
