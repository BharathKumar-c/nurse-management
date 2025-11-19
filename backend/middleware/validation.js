import { body, validationResult } from 'express-validator';

export const validateNurse = [
  body('name').notEmpty().withMessage('Name is required'),
  body('license_number').notEmpty().withMessage('License number is required'),
  body('date_of_birth').isISO8601().withMessage('Valid date of birth is required'),
  body('age').isInt({ min: 0 }).withMessage('Valid age is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

