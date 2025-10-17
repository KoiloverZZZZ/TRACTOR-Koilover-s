export function validateLogin(login) {
    if (!login || login.length < 3) return 'Логин должен быть не менее 3 символов';
    return null;
  }
  
export function validatePassword(password) {
    if (!password || password.length < 6) return 'Пароль должен быть не менее 6 символов';
    return null;
  }
  
export function validateName(name) {
    if (!name || name.length < 2) return 'Имя должно быть не менее 2 символов';
    return null;
  }
  
export function validateForm(login, password, name = null) {
    const loginError = validateLogin(login);
    const passwordError = validatePassword(password);
    const nameError = name ? validateName(name) : null;
    
    return { 
      loginError, 
      passwordError, 
      nameError,
      isValid: !loginError && !passwordError && !nameError 
    };
  }