import { Router } from 'express';
import {
  activeAccount,
  facebookSignin,
  googleSignin,
  refreshToken,
  signin,
  signout,
  signup,
} from '../controllers/auth.controller';
import { validSignup } from '../middlewares/valid';

const router = Router();

router.route('/signup').post(validSignup, signup);
router.route('/active').post(activeAccount);
router.route('/signin').post(signin);
router.route('/signout').get(signout);
router.route('/refresh_token').get(refreshToken);
router.route('/google_signin').post(googleSignin);
router.route('/facebook_signin').post(facebookSignin);

export default router;
