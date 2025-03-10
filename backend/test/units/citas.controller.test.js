import { createCita } from "../../src/controllers/citas.controller.js";
import { mockRequest, mockResponse } from "../mocks/expressMocks.js";
import mongoose from "mongoose";

jest.setTimeout(10000);

describe("Citas Controller", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("Debe crear una cita correctamente", async () => {
    const req = mockRequest({ date: "2025-04-10", time: "14:00", serviceId: "123456789" });
    const res = mockResponse();

    await createCita(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Cita creada exitosamente" }));
  });

  test("Debe devolver un error si faltan datos", async () => {
    const req = mockRequest({ date: "2025-04-10" });
    const res = mockResponse();

    await createCita(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Todos los campos son obligatorios" }));
  });
});
