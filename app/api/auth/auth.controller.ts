import { Router, Request, Response } from 'express';
import {
  getCurrentUser,
  login,
  register,
  softDeleteAccount,
  updateProfile,
  refresh,
} from './auth.actions';
import { getUserById, getUsers } from './auth.service';
import { adminAuthMiddleware, authMiddleware } from './auth.middleware';

const authController = Router();

// User routes

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     description: Login to the API
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Email and password are required.
 *       500:
 *         description: Error while logging in.
 */
authController.post('/login', async (req: Request, res: Response) => {
  const params = {
    email: req.body?.email,
    password: req.body?.password,
  };

  if (!params.email || !params.password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  login(params.email, params.password)
    .then((result) => {
      return res.status(200).json({
        ...result,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Error while logging in', details: err?.message });
    });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     description: Refresh the API token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       400:
 *         description: Token is required.
 *       500:
 *         description: Error while refreshing token.
 */
authController.post('/refresh', async (req: Request, res: Response) => {
  const params = {
    refreshToken: req.body?.refreshToken,
  };

  if (!params.refreshToken || typeof params.refreshToken !== 'string') {
    return res.status(400).json({ error: 'Token is required' });
  }

  refresh(params.refreshToken)
    .then((result) => {
      if (!result?.token || !result?.refreshToken) {
        return res.status(400).json({ error: 'User not found' });
      }

      return res.status(200).json({
        ...result,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Error while deleting user', details: err?.message });
    });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     description: Get the current user
 *     tags:
 *       - Auth
 *     security:
 *       - token: string
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       400:
 *         description: Token is required.
 *       500:
 *         description: Error while getting user.
 */
authController.get('/me', authMiddleware, async (req: Request, res: Response) => {
  const params = {
    token: req.headers?.token,
  };

  if (!params.token || typeof params.token !== 'string') {
    return res.status(400).json({ error: 'Token is required' });
  }

  getCurrentUser(params.token)
    .then((result) => {
      return res.status(200).json({
        ...result,
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: 'Error while getting current user', details: err?.message });
    });
});

/**
 * @swagger
 * /api/auth/me/update:
 *   put:
 *     description: Update the current user
 *     tags:
 *       - Auth
 *     security:
 *       - token: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       401:
 *         description: Unauthorized.
 *       400:
 *         description: User data is required.
 *       500:
 *         description: Error while updating user.
 */
authController.put('/me/update', authMiddleware, async (req: Request, res: Response) => {
  const params = {
    token: req.headers?.token,
    data: req.body,
  };

  if (!params.token || typeof params.token !== 'string') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!params.data) {
    return res.status(400).json({ error: 'User data is required' });
  }

  getCurrentUser(params.token)
    .then((result) => {
      if (!result?.id) {
        return res.status(400).json({ error: 'User not found' });
      }

      updateProfile(result.id, params.data)
        .then((result) => {
          return res.status(200).json({
            ...result,
          });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: 'Error while updating user', details: err?.message });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Error while updating user', details: err?.message });
    });
});

/**
 * @swagger
 * /api/auth/me/delete:
 *   delete:
 *     description: Delete the current user
 *     tags:
 *       - Auth
 *     security:
 *       - token: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       400:
 *         description: User not found.
 *       500:
 *         description: Error while deleting user.
 */
authController.delete('/me/delete', authMiddleware, async (req: Request, res: Response) => {
  const params = {
    token: req.headers?.token,
  };

  if (!params.token || typeof params.token !== 'string') {
    return res.status(400).json({ error: 'Token is required' });
  }

  getCurrentUser(params.token)
    .then((result) => {
      if (!result?.id) {
        return res.status(400).json({ error: 'User not found' });
      }

      softDeleteAccount(result.id)
        .then((result) => {
          return res.status(200).json({
            ...result,
          });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: 'Error while deleting user', details: err?.message });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Error while deleting user', details: err?.message });
    });
});

// Admin routes

/**
 * @swagger
 * /api/auth/admin/create:
 *   post:
 *     description: Create a new user
 *     tags:
 *       - Auth (admin)
 *     security:
 *       - token: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully.
 *       400:
 *         description: Email and password are required.
 *       500:
 *         description: Error while creating user.
 */
authController.post('/admin/create', adminAuthMiddleware, async (req: Request, res: Response) => {
  const params = {
    email: req.body?.email,
    password: req.body?.password,
    name: req.body?.name,
  };

  if (!params.email || !params.password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  register(params.email, params.password, params.name)
    .then((result) => {
      return res.status(200).json({
        ...result,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Error while registering', details: err?.message });
    });
});

/**
 * @swagger
 * /api/auth/admin/list:
 *   get:
 *     description: Get a list of users
 *     tags:
 *       - Auth (admin)
 *     security:
 *       - token: string
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       400:
 *         description: Search must be a string.
 *       500:
 *         description: Error while getting users.
 */
authController.get('/admin/list', adminAuthMiddleware, async (req: Request, res: Response) => {
  const params = {
    search: req.query?.search,
  };

  if (params.search && typeof params.search !== 'string') {
    return res.status(400).json({ error: 'Search must be a string' });
  }

  getUsers(params.search)
    .then((result) => {
      return res.status(200).json({
        ...result,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Error while getting user', details: err?.message });
    });
});

/**
 * @swagger
 * /api/auth/admin/user:
 *   get:
 *     description: Get a user by ID
 *     tags:
 *       - Auth (admin)
 *     security:
 *       - token: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       400:
 *         description: User ID is required.
 *       500:
 *         description: Error while getting user.
 */
authController.get('/admin/user', adminAuthMiddleware, async (req: Request, res: Response) => {
  const params = {
    id: req.params?.id,
  };

  if (!params.id || typeof params.id !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  getUserById(params.id)
    .then((result) => {
      return res.status(200).json({
        ...result,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Error while getting user', details: err?.message });
    });
});

/**
 * @swagger
 * /api/auth/admin/user:
 *   put:
 *     description: Update a user by ID
 *     tags:
 *       - Auth (admin)
 *     security:
 *       - token: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: User ID is required.
 *       500:
 *         description: Error while updating user.
 */
authController.put('/admin/user', adminAuthMiddleware, async (req: Request, res: Response) => {
  const params = {
    id: req.params?.id,
    data: req.body,
  };

  if (!params.id || typeof params.id !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!params.data) {
    return res.status(400).json({ error: 'User data is required' });
  }

  updateProfile(params.id, params.data)
    .then((result) => {
      return res.status(200).json({
        ...result,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Error while updating user', details: err?.message });
    });
});

/**
 * @swagger
 * /api/auth/admin/user:
 *   delete:
 *     description: Delete a user by ID
 *     tags:
 *       - Auth (admin)
 *     security:
 *       - token: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: User ID is required.
 *       500:
 *         description: Error while deleting user.
 */
authController.delete('/admin/user', adminAuthMiddleware, async (req: Request, res: Response) => {
  const params = {
    id: req.params?.id,
  };

  if (!params.id || typeof params.id !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  softDeleteAccount(params.id)
    .then((result) => {
      return res.status(200).json({
        ...result,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Error while updating user', details: err?.message });
    });
});

export default authController;
