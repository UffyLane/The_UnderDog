const Item = require("../models/item");

const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");

// GET /items — only user's saved events
const getItems = (req, res, next) => {
  Item.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .then((items) => res.send(items))
    .catch(next);
};

// POST /items — save an event
const createItem = (req, res, next) => {
  const { name, date, venue, city, state, url } = req.body;

  Item.create({
    name,
    date,
    venue,
    city,
    state,
    url,
    owner: req.user._id,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      // ✅ duplicate saved event (owner+url unique index)
      if (err.code === 11000) {
        next(new ConflictError("This event is already saved"));
        return;
      }

      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid item data"));
        return;
      }

      next(err);
    });
};

// DELETE /items/:itemId — owner only
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      // ✅ correct comparison (ObjectId vs string safety)
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError("You cannot delete items from other users");
      }

      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item id"));
        return;
      }
      next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
};