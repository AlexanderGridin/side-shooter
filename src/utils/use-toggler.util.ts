export const useToggler = ({
  selector,
  activeText,
  disabledText,
  useWhenActive,
  useWhedDisabled,
}: {
  selector: string;
  activeText: string;
  disabledText: string;
  useWhenActive: () => void;
  useWhedDisabled: () => void;
}): void => {
  let isActive = false;
  const button: HTMLButtonElement | null =
    document.querySelector<HTMLButtonElement>(selector);

  if (!button) {
    return;
  }

  button.textContent = disabledText;
  button.addEventListener("click", () => {
    isActive = !isActive;

    if (isActive) {
      useWhenActive();
    } else {
      useWhedDisabled();
    }

    button.textContent = isActive ? activeText : disabledText;
  });
};
