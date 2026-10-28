import { error } from '../utils/apiResponse.js';

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const messages = result.error.errors.map((e) => e.message).join(', ');
        return error(res, messages, 400);
      }
      req.body = result.data;
      next();
    } catch (err) {
      return error(res, 'Validation error.', 400);
    }
  };
};

export default validate;
