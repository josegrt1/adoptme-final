import "dotenv/config";
import mongoose from "mongoose";
import assert from "node:assert";
import User from "../src/dao/Users.dao.js";

describe("User DAO", function () {
  this.timeout(10000);

  let userDao;

  before(async function () {
    const mongoUrl = process.env.MONGO_URL_TEST;

    if (!mongoUrl) {
      throw new Error("Falta configurar MONGO_URL_TEST");
    }

    await mongoose.connect(mongoUrl);
    userDao = new User();
  });

  beforeEach(async function () {
    await mongoose.connection.collection("users").deleteMany({});
  });

  it("debe devolver un array al obtener usuarios", async function () {
    const result = await userDao.get();

    assert.strictEqual(Array.isArray(result), true);
  });

  it("debe guardar un usuario con identificador", async function () {
    const user = {
      first_name: "Goldie",
      last_name: "Legrand",
      email: "goldie.legrand@test.com",
      password: "1234"
    };

    const result = await userDao.save(user);

    assert.ok(result._id);
  });

  it("debe crear un usuario con mascotas vacías por defecto", async function () {
    const user = {
      first_name: "Goldie",
      last_name: "Legrand",
      email: "goldie.legrand@test.com",
      password: "1234"
    };

    const result = await userDao.save(user);

    assert.deepStrictEqual(result.pets, []);
  });

  it("debe obtener un usuario por email", async function () {
    const user = {
      first_name: "Goldie",
      last_name: "Legrand",
      email: "goldie.legrand@test.com",
      password: "1234"
    };

    await userDao.save(user);

    const result = await userDao.getBy({ email: user.email });

    assert.ok(result);
    assert.strictEqual(result.email, user.email);
  });

  after(async function () {
    await mongoose.connection.collection("users").deleteMany({});
    await mongoose.disconnect();
  });
});