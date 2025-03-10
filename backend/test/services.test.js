import request from "supertest";
import { app, server } from '../server.js'; 
import mongoose from "mongoose";
import Service from '../src/models/service.js'; 

describe("Servicios API", () => {
    let adminToken;
    let serviceId;

    beforeAll(async () => {
        const adminLogin = await request(app).post("/api/auth/login").send({
            email: "superadmin@test.com",
            password: "superadmin123"
        });

        adminToken = adminLogin.body.token;
        expect(adminToken).toBeDefined();
    });

    beforeEach(async () => {
        await Service.deleteMany(); 
    });

    afterAll(async () => {
        await mongoose.connection.close(); 
        await server.close(); 
    });

    test("✅ Obtener todos los servicios (GET /api/services)", async () => {
        const res = await request(app).get("/api/services");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("total");
        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("✅ Crear un nuevo servicio (POST /api/services)", async () => {
        const res = await request(app)
            .post("/api/services")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Lavado de barba",
                price: 10,
                duration: 15
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Servicio creado correctamente");
        expect(res.body).toHaveProperty("service");

        serviceId = res.body.service?._id || "";
        console.log("🆔 ID del servicio creado:", serviceId);
        expect(serviceId).not.toBe("");
    });

    test("✅ Obtener un servicio específico (GET /api/services/:id)", async () => {
        expect(serviceId).not.toBe("");

        const res = await request(app).get(`/api/services/${serviceId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("name", "Lavado de barba");
        expect(res.body).toHaveProperty("price", 10);
    });

    test("✅ Actualizar un servicio (PUT /api/services/:id)", async () => {
        expect(serviceId).not.toBe("");

        const res = await request(app)
            .put(`/api/services/${serviceId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ price: 12 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Servicio actualizado exitosamente");
    });

    test("✅ Eliminar un servicio (DELETE /api/services/:id)", async () => {
        expect(serviceId).not.toBe("");

        const serviceExists = await Service.findById(serviceId);
        expect(serviceExists).not.toBeNull();

        const res = await request(app)
            .delete(`/api/services/${serviceId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Servicio eliminado exitosamente");
    });
});
