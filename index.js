const express = require("express");
const uuid = require("uuid");
const cors = require("cors");
const port = 3001;

const app = express();
app.use(express.json());
app.use(cors());

const orders = [];

const checkOrderId = (request, response, next) => {
  const { id } = request.params;
  const index = orders.findIndex((order) => order.id === id);

  if (index < 0) {
    return response.status(404).json({ message: "order not found" });
  }

  request.userIndex = index;
  request.userId = id;

  next();
};

const checkMethodURL = (request, response, next) => {
  console.log(request.method, request.url);
  next();
};

app.post(`/order`, checkMethodURL, (request, response) => {
  const { itens, clientName, price } = request.body;
  const order = {
    id: uuid.v4(),
    itens,
    clientName,
    price,
    status: "Preparing your Order",
  };

  orders.push(order);
  return response.status(201).json(order);
});
app.get(`/order`, checkMethodURL, (request, response) => {
  return response.json(orders);
});
app.put(`/order/:id`, checkMethodURL, checkOrderId, (request, response) => {
  const { itens, clientName, price } = request.body;
  const index = request.userIndex;
  const id = request.userId;

  const updateOrder = { id, itens, clientName, price };

  orders[index] = updateOrder;

  return response.json(updateOrder);
});
app.delete(`/order/:id`, checkMethodURL, checkOrderId, (request, response) => {
  const index = request.orderIndex;
  orders.splice(index, 1);

  return response.status(204).json();
});
app.get(`/order/:id`, checkMethodURL, checkOrderId, (request, response) => {
  const id = request.params.id;
  const order = orders.find((order) => order.id === id);
  if (order) {
    response.send(order);
  } else {
    response.status(404).send("Order not found");
  }
});
app.patch(`/order/:id`, checkMethodURL, checkOrderId, (request, response) => {
  const { id } = request.params;
  const { status } = request.body;
  const order = orders.find((order) => order.id === id);
  if (!order) {
    return response.status(404).send("Order not found");
  }

  order.status = status;
  return response.send(order);
});

app.listen(port, () => {
  console.log(`🚀Code is running on the port ${port}`);
});
