export const ensureTimestring = (date: string | undefined) => {
  if (date === undefined) {
    return "";
  } else if (date.includes("GMT")) {
    return date.replace("GMT", "");
  }

  // Notice the lack of 'Z' at the end. This is intentional.
  // This makes sure that the time is calculated in the user's
  // local timezone.
  return date;
};
