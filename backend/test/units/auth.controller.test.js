import { register, login } from "../../src/controllers/auth.controller.js";
import { mockRequest, mockResponse } from "../mocks/expressMocks.js";
import mongoose from "mongoose";

jest.setTimeout(10000); // Aumentamos timeout

describe("Auth Controller", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("Debe registrar un usuario correctamente", async () => {
    const req = mockRequest({ name: "Test User", email: "test@test.com", password: "123456" });
    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Usuario registrado exitosamente" }));
  });

  test("Debe devolver un error si falta algún campo", async () => {
    const req = mockRequest({ email: "test@test.com", password: "123456" });
    const res = mockResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Todos los campos son obligatorios" }));
  });
});
