/**
 * Validation Utilities for Authentication
 */

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate required field
 */
export const validateRequired = (value: string, fieldName: string = 'Field'): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return {
      valid: false,
      error: `${fieldName} is required`,
    }
  }
  return { valid: true }
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const result = validateRequired(email, 'Email')
  if (!result.valid) return result

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: 'Please enter a valid email address',
    }
  }
  return { valid: true }
}

/**
 * Validate full name (minimum 2 characters)
 */
export const validateFullName = (name: string): ValidationResult => {
  const result = validateRequired(name, 'Full Name')
  if (!result.valid) return result

  if (name.trim().length < 2) {
    return {
      valid: false,
      error: 'Full Name must be at least 2 characters',
    }
  }

  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      valid: false,
      error: 'Full Name can only contain letters, spaces, hyphens, and apostrophes',
    }
  }

  return { valid: true }
}

/**
 * Validate organization name
 */
export const validateOrganization = (org: string): ValidationResult => {
  const result = validateRequired(org, 'Organization')
  if (!result.valid) return result

  if (org.trim().length < 2) {
    return {
      valid: false,
      error: 'Organization must be at least 2 characters',
    }
  }

  return { valid: true }
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const validatePassword = (password: string): ValidationResult => {
  const result = validateRequired(password, 'Password')
  if (!result.valid) return result

  if (password.length < 8) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long',
    }
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one uppercase letter',
    }
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one lowercase letter',
    }
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one number',
    }
  }

  if (/\s/.test(password)) {
    return {
      valid: false,
      error: 'Password cannot contain spaces',
    }
  }

  return { valid: true }
}

/**
 * Validate confirm password matches password
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  const result = validateRequired(confirmPassword, 'Confirm Password')
  if (!result.valid) return result

  if (password !== confirmPassword) {
    return {
      valid: false,
      error: 'Passwords do not match',
    }
  }

  return { valid: true }
}

/**
 * Check password strength level
 */
export const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak'
  
  let strength = 0
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  if (strength <= 2) return 'weak'
  if (strength === 3) return 'medium'
  return 'strong'
}

/**
 * Validate OTP code (6 digits)
 */
export const validateOTP = (otp: string): ValidationResult => {
  if (!otp || otp.length === 0) {
    return {
      valid: false,
      error: 'OTP is required',
    }
  }

  if (!/^\d{6}$/.test(otp)) {
    return {
      valid: false,
      error: 'OTP must be exactly 6 digits',
    }
  }

  return { valid: true }
}

/**
 * Check if phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.length >= 10
}

/**
 * Check if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Check if number is valid
 */
export const isValidNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

/**
 * Legacy: Check if email is valid (use validateEmail instead)
 */
export const isValidEmail = (email: string): boolean => {
  return validateEmail(email).valid
}
