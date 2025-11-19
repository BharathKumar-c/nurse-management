import { body, validationResult } from 'express-validator';

export const validateNurse = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name must be below 255 characters'),
  body('license_number')
    .trim()
    .notEmpty()
    .withMessage('License number is required')
    .isLength({ max: 50 })
    .withMessage('License number must be below 50 characters'),
  body('date_of_birth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('age')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Age must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

