import request from "supertest";
import {app, server} from "../../server.js"; // Importa el servidor directamente

describe("Citas API Integration Tests", () => {
  let userToken;

  beforeAll(async () => {
    // Registrar y autenticar usuario para obtener token
    const userRes = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testcitas@test.com",
      password: "123456",
    });

    userToken = userRes.body.token;
  });

  test("Debe crear una cita con usuario autenticado", async () => {
    const res = await request(app)
      .post("/api/citas")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        date: "2025-04-10",
        time: "14:00",
        serviceId: "123456789",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Cita creada exitosamente");
  });

  test("Debe devolver un error si falta algún campo", async () => {
    const res = await request(app)
      .post("/api/citas")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        date: "2025-04-10", // Falta el campo 'time' y 'serviceId'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Todos los campos son obligatorios");
  });

  test("Debe evitar que un usuario no autenticado cree una cita", async () => {
    const res = await request(app)
      .post("/api/citas")
      .send({
        date: "2025-04-10",
        time: "14:00",
        serviceId: "123456789",
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message", "Acceso denegado");
  });

  test("Debe obtener todas las citas de un usuario autenticado", async () => {
    const res = await request(app)
      .get("/api/citas")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Debe devolver error si intenta obtener citas sin autenticación", async () => {
    const res = await request(app).get("/api/citas");

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message", "Acceso denegado");
  });
});
