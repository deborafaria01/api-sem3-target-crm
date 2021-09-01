import User from '@entities/User';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import transport from '../../modules/mailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface UserInterface {
  name?: string;
  role?: string;
  token?: string;
  picture?: string;
  email: string;
  password: string;
}

function generateToken(params = {}) {
  return jwt.sign(params, process.env.SECRET, { expiresIn: 84600 });
}

class UserController {
  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role, picture }: UserInterface = req.body;

      if (!name || !email || !password)
        return res.status(400).json({ message: 'Invalid values for new User!' });

      if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({ name, email, passwordHash, role, picture }).save();

      if (!user) return res.status(400).json({ message: 'Cannot create user' });

      user.passwordHash = undefined;

      res.json({ user, token: generateToken({ id: user.id }) });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Registration failed, try again' });
    }
  }

  public async authenticateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password }: UserInterface = req.body;

      if (!email || !password) return res.status(400).json({ message: 'Invalid values for User' });

      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ message: 'User does not exist' });

      if (!(await bcrypt.compare(password, user.passwordHash)))
        return res.status(400).json({ message: 'Invalid email or password' });

      return res.json({ token: generateToken({ id: user.id }) });
    } catch (error) {
      return res.status(400).json({ error: 'Authenticate failed, try again' });
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      if (!email) return res.status(400).json({ message: 'Invalid values for forgot password' });

      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ message: 'User not found' });

      const token = crypto.randomBytes(20).toString('hex'); // token que será enviado via email.

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        passwordResetToken: token,
        passwordResetExpires: now,
      });

      transport.sendMail({
        to: email,
        from: '"Contato" <api@contato.com>',
        subject: 'Reset password', // assunto do email
        // html: { path: './src/resources/mail/forgotPassword.html' },
        template: 'forgotPassword',
        context: { token },
      },
      (err) => {
        if (err) return res.status(400).json({ message: 'Cannot send forgot password email' });

        transport.close();
        return res.json();
      });
    } catch (error) {
      return res.status(400).json({ error: 'Forgot password failed, try again' });
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, token }: UserInterface = req.body;

      if (!email || !password || !token)
        return res.status(400).json({ message: 'Invalid values for User reset password' });

      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ message: 'User not found' });

      if (token !== user.passwordResetToken) return res.status(400).json({ message: 'Token is invalid' });

      const now = new Date();
      if (now > user.passwordResetExpires) return res.status(400).json({ message: 'Token expired' });

      const passwordHash = await bcrypt.hash(password, 10);

      await User.update(user.id, { passwordHash });

      return res.json({ message: 'Ok' });
    } catch (error) {
      return res.status(400).json({ error: 'Cannot reset password, try again' });
    }
  }
}

export default new UserController();
