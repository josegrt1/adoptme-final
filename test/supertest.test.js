import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { expect } from 'chai';
import supertest from 'supertest';

import app from '../src/app.js';
import userModel from '../src/dao/models/User.js';
import petModel from '../src/dao/models/Pet.js';
import adoptionModel from '../src/dao/models/Adoption.js';

dotenv.config();

mongoose.set('strictQuery', false);

const requester = supertest(app);

describe('Functional tests: adoption.router.js', function () {
  this.timeout(20000);

  let testUser;
  let availablePet;
  let adoptedPet;

  before(async function () {
    if (!process.env.MONGO_URL_TEST) {
      throw new Error('Falta MONGO_URL_TEST en el archivo .env');
    }

    await mongoose.connect(process.env.MONGO_URL_TEST);
  });

  beforeEach(async function () {
    await adoptionModel.deleteMany({});
    await userModel.deleteMany({});
    await petModel.deleteMany({});

    testUser = await userModel.create({
      first_name: 'Usuario',
      last_name: 'Prueba',
      email: `test-${new mongoose.Types.ObjectId()}@example.com`,
      password: 'TestPassword123'
    });

    availablePet = await petModel.create({
      name: 'Luna',
      specie: 'Perro',
      birthDate: new Date('2020-01-01'),
      adopted: false
    });

    adoptedPet = await petModel.create({
      name: 'Toby',
      specie: 'Perro',
      birthDate: new Date('2019-05-10'),
      adopted: true
    });
  });

  after(async function () {
    await adoptionModel.deleteMany({});
    await userModel.deleteMany({});
    await petModel.deleteMany({});

    await mongoose.disconnect();
  });

  it('GET /api/adoptions debe devolver todas las adopciones', async function () {
    await adoptionModel.create({
      owner: testUser._id,
      pet: availablePet._id
    });

    const response = await requester.get('/api/adoptions');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.be.an('array');
    expect(response.body.payload).to.have.length(1);
  });

  it('GET /api/adoptions/:aid debe devolver una adopción existente', async function () {
    const adoption = await adoptionModel.create({
      owner: testUser._id,
      pet: availablePet._id
    });

    const response = await requester.get(`/api/adoptions/${adoption._id}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload._id).to.equal(adoption._id.toString());
  });

  it('GET /api/adoptions/:aid debe devolver 404 si no existe la adopción', async function () {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await requester.get(`/api/adoptions/${nonExistentId}`);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('Adoption not found');
  });

  it('POST /api/adoptions/:uid/:pid debe devolver 404 si el usuario no existe', async function () {
    const nonExistentUserId = new mongoose.Types.ObjectId();

    const response = await requester.post(
      `/api/adoptions/${nonExistentUserId}/${availablePet._id}`
    );

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('user Not found');
  });

  it('POST /api/adoptions/:uid/:pid debe devolver 404 si la mascota no existe', async function () {
    const nonExistentPetId = new mongoose.Types.ObjectId();

    const response = await requester.post(
      `/api/adoptions/${testUser._id}/${nonExistentPetId}`
    );

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('Pet not found');
  });

  it('POST /api/adoptions/:uid/:pid debe devolver 400 si la mascota ya fue adoptada', async function () {
    const response = await requester.post(
      `/api/adoptions/${testUser._id}/${adoptedPet._id}`
    );

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal('error');
    expect(response.body.error).to.equal('Pet is already adopted');
  });

  it('POST /api/adoptions/:uid/:pid debe crear una adopción correctamente', async function () {
    const response = await requester.post(
      `/api/adoptions/${testUser._id}/${availablePet._id}`
    );

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('Pet adopted');

    const updatedUser = await userModel.findById(testUser._id);
    const updatedPet = await petModel.findById(availablePet._id);
    const savedAdoption = await adoptionModel.findOne({
      owner: testUser._id,
      pet: availablePet._id
    });

    const userHasPet = updatedUser.pets.some(
      (pet) => pet._id.toString() === availablePet._id.toString()
    );

    expect(userHasPet).to.equal(true);
    expect(updatedPet.adopted).to.equal(true);
    expect(updatedPet.owner.toString()).to.equal(testUser._id.toString());
    expect(savedAdoption).to.not.equal(null);
  });
});