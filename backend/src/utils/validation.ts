import Joi from 'joi';

export const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().optional(),
    bio: Joi.string().max(500).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

export const customerSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    check_in: Joi.date().required(),
    check_out: Joi.date().greater(Joi.ref('check_in')).required(),
    room_type: Joi.string().required(),
    total_spent: Joi.number().min(0).default(0),
    status: Joi.string().valid('active', 'checked-out').default('active')
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    check_in: Joi.date().optional(),
    check_out: Joi.date().optional(),
    room_type: Joi.string().optional(),
    total_spent: Joi.number().min(0).optional(),
    status: Joi.string().valid('active', 'checked-out').optional()
  })
};

export const bookingSchemas = {
  create: Joi.object({
    customer_id: Joi.string().uuid().required(),
    customer_name: Joi.string().min(2).max(100).required(),
    room_number: Joi.string().required(),
    check_in: Joi.date().required(),
    check_out: Joi.date().greater(Joi.ref('check_in')).required(),
    amount: Joi.number().min(0).required(),
    status: Joi.string().valid('confirmed', 'cancelled', 'completed').default('confirmed')
  }),

  update: Joi.object({
    customer_name: Joi.string().min(2).max(100).optional(),
    room_number: Joi.string().optional(),
    check_in: Joi.date().optional(),
    check_out: Joi.date().optional(),
    amount: Joi.number().min(0).optional(),
    status: Joi.string().valid('confirmed', 'cancelled', 'completed').optional()
  })
};

export const chatSchemas = {
  message: Joi.object({
    message: Joi.string().min(1).max(2000).required(),
    session_id: Joi.string().optional(),
    config: Joi.object({
      provider: Joi.string().valid('openai', 'azure').default('openai'),
      model: Joi.string().default('gpt-4-turbo'),
      temperature: Joi.number().min(0).max(2).default(0.7),
      maxTokens: Joi.number().min(1).max(4000).default(2000),
      systemPrompt: Joi.string().max(1000).optional()
    }).optional()
  })
};