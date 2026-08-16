import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../src/app.js";

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

async function registerAndLogin({ name, email, password, role }) {
  await request(app).post("/api/auth/register").send({ name, email, password, role });
  const res = await request(app).post("/api/auth/login").send({ email, password });
  return { accessToken: res.body.accessToken, userId: res.body.user.id };
}

describe("Appointment booking flow", () => {
  let doctor;
  let patient;

  beforeAll(async () => {
    doctor = await registerAndLogin({
      name: "Dr. Smith",
      email: "dr.smith@example.com",
      password: "supersecret123",
      role: "doctor",
    });
    patient = await registerAndLogin({
      name: "Jane Patient",
      email: "jane@example.com",
      password: "supersecret123",
      role: "patient",
    });

    // Doctor sets availability for every day of the week, 9am-5pm UTC
    for (let day = 0; day <= 6; day++) {
      await request(app)
        .post("/api/doctors/me/availability")
        .set("Authorization", `Bearer ${doctor.accessToken}`)
        .send({ dayOfWeek: day, startTime: "09:00", endTime: "17:00", slotDurationMinutes: 30 });
    }
  });

  it("returns available slots for the doctor", async () => {
    const res = await request(app)
      .get(`/api/appointments/doctors/${doctor.userId}/slots`)
      .set("Authorization", `Bearer ${patient.accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.slots)).toBe(true);
    expect(res.body.slots.length).toBeGreaterThan(0);
  });

  it("books the first available slot", async () => {
    const slotsRes = await request(app)
      .get(`/api/appointments/doctors/${doctor.userId}/slots`)
      .set("Authorization", `Bearer ${patient.accessToken}`);
    const slot = slotsRes.body.slots[0];

    const res = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${patient.accessToken}`)
      .send({ doctorId: doctor.userId, startsAt: slot.startsAt, endsAt: slot.endsAt, reason: "Checkup" });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("booked");
  });

  it("rejects a conflicting double-booking of the same slot", async () => {
    const now = new Date();
    const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    start.setUTCHours(10, 0, 0, 0);
    const end = new Date(start.getTime() + 30 * 60000);

    const first = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${patient.accessToken}`)
      .send({ doctorId: doctor.userId, startsAt: start.toISOString(), endsAt: end.toISOString() });
    expect(first.status).toBe(201);

    const conflict = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${patient.accessToken}`)
      .send({ doctorId: doctor.userId, startsAt: start.toISOString(), endsAt: end.toISOString() });
    expect(conflict.status).toBe(409);
  });
});
