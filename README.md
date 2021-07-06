# Installation
```
npm install object-rewinder
```

# Getting started

```js
import ObjectRewinder from 'object-rewinder';

let dataToWatch = { empty: 'object' };

let rewinder = new ObjectRewinder(dataToWatch);
dataToWatch = rewinder.getObject(); // Overwrite the data with the observed one

// From now on every change on "dataToWatch" will be recorded
// And we'll be able to rollback thoses changes

dataToWatch.value = 'very good value'
console.log(dataToWatch);

//  Outputs:
//   {
//     empty: 'object',
//     value: 'very good value'
//   }

rewinder.back();
console.log(dataToWatch);

//  Outputs:
//   {
//     empty: 'object',
//   }

rewinder.forward();
console.log(dataToWatch);

//  Outputs:
//   {
//     empty: 'object',
//     value: 'very good value'
//   }
```