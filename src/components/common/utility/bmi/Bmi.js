const calculateBmi = (height, weight) => {
  const newHeight = height / 100;
  const result = weight / (newHeight * newHeight);
  let bmi = '';
  if (Number.isFinite(result)) { bmi = result.toFixed(2); }
  return bmi;
};
export default calculateBmi;
