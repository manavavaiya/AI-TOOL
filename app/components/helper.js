// app/utils/helper.js

// Check if string starts with ** and ends with *
export function checkHeading(str) {
  return /^(\*)(\*)(.*)\*$/.test(str);
}

// Remove ** at start and * at end
export function replaceHeadingStarts(str) {
  return str.replace(/^(\*)(\*)|(\*)$/g, '');
}
