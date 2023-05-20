export const ENV = (): string => {
    return process.env.REACT_APP_ENV || ''
}

export const FormatNumber = (number: number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(0) + "K";
    } else {
      return number.toString();
    }
  }