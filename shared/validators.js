// Email rules: must contain "@" and a domain
// Full name rules: only letters, spaces, apostrophes, hyphens, between 5 and 40 characters
// Username rules: alphanumeric characters and ( _ - . ), between 3 and 30 characters
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FULLNAME_REGEX = /^[\p{L}\s'-]{5,40}$/u;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,30}$/;


// Validation functions
// Trim input and test against regex
export const isValidEmail = (email) => {
    let trimmedEmail = email.trim();
    return EMAIL_REGEX.test(trimmedEmail);
}

export const isValidFullName = (fullName) => {
    let trimmedFullName = fullName.trim();
    return FULLNAME_REGEX.test(trimmedFullName);
}

export const isValidUsername = (username) => {
    let trimmedUsername = username.trim();
    return USERNAME_REGEX.test(trimmedUsername);
} 