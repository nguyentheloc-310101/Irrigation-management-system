export function handleOnKeyDown(event: any) {
  const regex = /[0-9]/; // Only allow numeric key presses
  if (event.key !== 'Backspace' && event.key !== 'Delete') {
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }
}
