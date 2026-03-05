const router = require('express').Router();

const { getItems, createItem, deleteItem } = require('../controllers/items');
const { validateItemBody, validateItemId } = require('../middlewares/validate');

router.get('/', getItems);
router.post('/', validateItemBody, createItem);
router.delete('/:itemId', validateItemId, deleteItem);

module.exports = router;
