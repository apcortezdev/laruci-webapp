const validateNameSlur = (name) => {
  const p =
    /p+[e+|ê+]+n+i+s+|c+a+r+a+l+[h+o+|e+o+|h+u+d+o+|h+u+d+a+]|p+i+c+[a+|ã+o+|u+d+o+]|r+o+l+u+d+[a+|o+]|j+e+b+[a+|ã+o+|u+d+o+]/;
  const v =
    /b+u+c+e+t+[a+|ã+o+|u+d+]|v+i+a+d+o+|p+u+t+[a+|ã+|o+]|v+a+g+i+n+[a+|â+o+|o+n+a+]/;
  const e =
    /f+u+c+k+|s+h+i+t+|t+w+a+t+|p+r+i+c+k+|b+i+t+c+h+|c+o+c+k+|d+i+c+k+/;

  if (p.test(String(name).toLowerCase())) return false;
  if (v.test(String(name).toLowerCase())) return false;
  if (e.test(String(name).toLowerCase())) return false;
  return true;
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePasswordLength = (pass) => {
  if (pass.toString().length < 6 || pass.toString().length > 24) {
    return false;
  }
  return true;
};

const validatePasswordStrength = (pass) => {
  if (!/[^a-z]/gi.test(pass)) return false;

  return true;
}

const validateCPF = (cpf) => {
  const regex = /^(?:(\d)\1{10})$|(\D)|^(\d{12,})$|^(\d{0,10})$/g;
  if (cpf.length !== 11) return false;
  if (/[^0-9]/g.test(cpf)) return false;
  if (cpf.match(regex)) return false;
  let sum = 0,
      rest = 0;

  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(cpf.substring(10, 11))) return false;

  return true;
};

const validateIsFullName = (name) => {
  if (name.split(' ').length <= 1) {
    return false;
  }
  return true;
};

const validateIsValidName = (name) => {
  return !/[^a-z\s]/gi.test(name);
};

const validatePhone = (phone) => {
  if (phone.length !== 10 && phone.length !== 11) return false;
  return true;
}

export {
  validateNameSlur,
  validateEmail,
  validatePasswordLength,
  validatePasswordStrength,
  validateCPF,
  validateIsFullName,
  validateIsValidName,
  validatePhone,
};
