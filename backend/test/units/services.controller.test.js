import { createService } from "../../src/controllers/services.controller.js";
import { mockRequest, mockResponse } from "../mocks/expressMocks.js";
import mongoose from "mongoose";

jest.setTimeout(10000);

describe("Services Controller", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("Debe crear un servicio correctamente", async () => {
    const req = mockRequest({ name: "Lavado de barba", price: 10 });
    const res = mockResponse();

    await createService(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Servicio creado correctamente" }));
  });

  test("Debe devolver un error si faltan datos", async () => {
    const req = mockRequest({ name: "" });
    const res = mockResponse();

    await createService(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Todos los campos son obligatorios" }));
  });
});
