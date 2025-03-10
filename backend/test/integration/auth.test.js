import request from "supertest";
import { app, server } from '../../server.js';

describe("Auth Controller", () => {
    let userToken;

    afterAll(async () => {
        await server.close(); 
    });

    test("✅ Registro exitoso", async () => {
        const randomEmail = `test${Date.now()}@test.com`;
        const res = await request(app).post("/api/auth/register").send({
            name: "Nuevo Usuario",
            email: randomEmail,
            password: "123456"
        });

        console.log(res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
    });

    test("❌ Registro con email duplicado", async () => {
        const res = await request(app).post("/api/auth/register").send({
            name: "Usuario Existente",
            email: "test@test.com",
            password: "123456"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "El correo ya está registrado");
    });

    test("❌ Login con credenciales incorrectas", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "test@test.com",
            password: "wrongpassword"
        });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message", "Credenciales incorrectas");
    });

    test("✅ Login exitoso", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "test@test.com",
            password: "123456"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");

        userToken = res.body.token;
        expect(userToken).toBeDefined();
    });

    test("❌ Usuario sin permisos intenta acceder a /api/admin", async () => {
        const res = await request(app).get("/api/admin").set("Authorization", `Bearer usuarioTokenInvalido`);

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty("message", "Acceso denegado");
    });

    test("✅ Crear una cita con usuario autenticado", async () => {
        const res = await request(app)
            .post("/api/citas")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                date: "2025-05-10T14:00:00Z",
                service: "Corte de pelo",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Cita creada exitosamente");
    });
});
