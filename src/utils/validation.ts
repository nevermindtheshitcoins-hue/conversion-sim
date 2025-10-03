export function validateTextInput(text: string): { isValid: boolean; error?: string } {
  const trimmed = text.trim();
  if (trimmed.length < 5) return { isValid: false, error: 'Please enter at least 5 characters' };
  if (trimmed.length > 100) return { isValid: false, error: 'Please keep your response under 100 characters' };
  return { isValid: true };
}

export function validateSelection(
  tempSelection: number | null,
  multiSelections: number[],
  isMultiSelect: boolean,
  maxSelections = 3
): { isValid: boolean; error?: string } {
  if (isMultiSelect) {
    if (multiSelections.length === 0) return { isValid: false, error: 'Please select at least one option' };
    if (multiSelections.length > maxSelections) return { isValid: false, error: `Please select no more than ${maxSelections} options` };
  } else {
    if (tempSelection === null) return { isValid: false, error: 'Please select an option' };
    if (tempSelection < 1 || tempSelection > 7) return { isValid: false, error: 'Invalid selection' };
  }
  return { isValid: true };
}