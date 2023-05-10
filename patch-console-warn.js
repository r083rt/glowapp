const originalWarn = console.warn;

console.warn = (...args) => {
  // check if the warning message contains the string "Please pass alt prop to Image component"
  if (args[0] && args[0].includes('Please pass alt prop to Image component')) {
    // do nothing
    return;
  }

  // call the original console.warn method with the same arguments
  originalWarn.apply(console, args);
};
