import { Router, Request, Response } from 'express';
import { deleteToken, generateToken } from './token.actions';
import { getApiToken } from './token.service';
import { adminAuthMiddleware } from './token.middleware';

export const apiTokensRouter = Router();

/**
 * @swagger
 * /api/token/check-api-token:
 *   post:
 *     description: Check if the API token is valid
 *     tags:
 *       - API Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token is valid.
 *       400:
 *         description: Token is not valid.
 *       500:
 *         description: Error while checking token.
 */
apiTokensRouter.post('/check-api-token', async (req: Request, res: Response) => {
  const params = {
    username: req.body?.username,
    token: req.body?.token,
  };

  getApiToken(params.username)
    .then((result) => {
      if (result?.token === params.token) {
        return res.status(200).json({ result: 'success' });
      }

      return res.status(400).json({ error: 'Token not found' });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Error while generating token', details: err?.message });
    });
});

/**
 * @swagger
 * /api/token/create-api-token:
 *   post:
 *     description: Create an API token
 *     tags:
 *       - API Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               description:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *               isModerator:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: API token created successfully.
 *       400:
 *         description: Username not provided.
 *       500:
 *         description: Error while creating API token.
 */
apiTokensRouter.post(
  '/create-api-token',
  adminAuthMiddleware,
  async (req: Request, res: Response) => {
    const params = {
      username: req.body?.username,
      description: req.body?.description,
      isAdmin: req.body?.isAdmin,
      isModerator: req.body?.isModerator,
    };

    if (!params.username) {
      return res.status(400).json({ error: 'Username not provided' });
    }

    generateToken(params.username, params.description, params.isAdmin, params.isModerator)
      .then((result) => {
        return res.status(200).json({
          ...result,
        });
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: 'Error while generating token', details: err?.message });
      });
  }
);

/**
 * @swagger
 * /api/token/remove-api-token:
 *   post:
 *     description: Remove an API token
 *     tags:
 *       - API Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: API token removed successfully.
 *       400:
 *         description: Username not provided.
 *       500:
 *         description: Error while removing API token.
 */
apiTokensRouter.post(
  '/remove-api-token',
  adminAuthMiddleware,
  async (req: Request, res: Response) => {
    const params = {
      username: req.body?.username,
    };

    if (!params.username) {
      return res.status(400).json({ error: 'Username not provided' });
    }

    deleteToken(params.username)
      .then((result) => {
        return res.status(200).json({
          ...result,
        });
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: 'Error while generating token', details: err?.message });
      });
  }
);

export default apiTokensRouter;
