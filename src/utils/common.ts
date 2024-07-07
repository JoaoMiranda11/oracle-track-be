export function Delay(duration = 1000) {
  return new Promise((res) => {
    setTimeout(res, duration);
  });
}

export function populatePlaceholders(message: string, placeholders: any) {
  // TODO: logic to populate by placeholders
  return message;
}