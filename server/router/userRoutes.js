const { Router } = require('express');
const { registerUser, loginUser, findUser, getUsers } = require('../controller/userController');

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/find/:UserId', findUser);
router.get('/', getUsers);
router.get('/', (req, res) => {
    res.cookie('Visited', true, { maxAge: 10000 })
})

module.exports = router;