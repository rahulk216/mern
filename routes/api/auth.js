const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

//api/auth

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(501).send('server error');
	}
});
router.post(
	'/',
	[
		check('email', 'Please add valid email').isEmail(),
		check('password', 'password is required').exists(),
	],
	async (req, res) => {
		console.log(req.body);

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			// check if user exists in database
			let user = await User.findOne({ email });

			if (!user) {
				console.log('login success');
				return res
					.status(400)
					.json({ error: [{ msg: 'Invalid credentials hi' }] });
			}
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res
					.status(400)
					.json({ error: [{ msg: 'Invalid credentials' }] });
			}

			//encrypt password
			const payload = {
				user: {
					id: user.id,
				},
			};
			jwt.sign(
				payload,
				config.get('jwtsecret'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.log(err);
			res.status(400).send('Server error');
		}
	}
);

module.exports = router;
