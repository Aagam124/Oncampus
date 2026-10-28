import { Router } from 'express';
import { z } from 'zod';
import {
  getProjects, getProjectById, createProject,
  updateProject, deleteProject, applyToProject,
  handleApplication, getMyProjects,
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required').max(3000),
  category: z.enum([
    'web-development', 'mobile-development', 'ui-ux-design', 'graphic-design',
    'video-editing', 'content-writing', 'data-analysis', 'tutoring',
    'presentation', 'research', 'other',
  ]),
  skills: z.array(z.string()).optional(),
  type: z.enum(['collaboration', 'hiring']).optional(),
  budget: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().optional(),
  }).optional(),
  timeline: z.string().optional(),
  maxCollaborators: z.number().min(1).optional(),
});

router.get('/', getProjects);
router.get('/my/listings', authenticate, getMyProjects);
router.get('/:id', getProjectById);
router.post('/', authenticate, validate(projectSchema), createProject);
router.put('/:id', authenticate, updateProject);
router.delete('/:id', authenticate, deleteProject);
router.post('/:id/apply', authenticate, applyToProject);
router.put('/:id/applications/:applicationId', authenticate, handleApplication);

export default router;
