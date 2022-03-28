import { useState } from "react";

const useInput = (
  validateValue,
  maxLength,
  canBeNegative = true,
  maxHundret = false
) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;

  const valueChangeHandler = (event) => {
    if (event.target.value.length <= maxLength) {
      if (canBeNegative) {
        setEnteredValue(event.target.value);
      }
      if (!canBeNegative) {
        if (maxHundret && !canBeNegative) {
          if (event.target.value >= 0 && event.target.value <= 100) {
            setEnteredValue(event.target.value);
          }
        }else if (event.target.value >= 0) {
          setEnteredValue(event.target.value);
        }
      }

    }
    setIsTouched(true);
  };

  const inputBlurHandler = (event) => {
    setIsTouched(true);
  };

  const reset = (value = "") => {
    setEnteredValue(value);
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    setEnteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
