import { expect } from "chai";
import UserRepository from "../src/repository/UserRepository.js";

describe("UserRepository", function () {
  let repository;
  let queriedWith;
  let savedDocument;

  beforeEach(function () {
    const dao = {
      get: async () => [],
      getBy: async (query) => {
        queriedWith = query;
        return { _id: "user-id", ...query };
      },
      save: async (document) => {
        savedDocument = document;
        return { _id: "user-id", ...document };
      },
      update: async () => null,
      delete: async () => null
    };

    repository = new UserRepository(dao);
  });

  it("debe buscar un usuario por email", async function () {
    const email = "goldie.legrand@test.com";

    const result = await repository.getUserByEmail(email);

    expect(queriedWith).to.deep.equal({ email });
    expect(result).to.have.property("email", email);
  });

  it("debe buscar un usuario por identificador", async function () {
    const id = "user-id";

    const result = await repository.getUserById(id);

    expect(queriedWith).to.deep.equal({ _id: id });
    expect(result).to.have.property("_id", id);
  });

  it("debe delegar la creación de un usuario al DAO", async function () {
    const user = {
      first_name: "Goldie",
      last_name: "Legrand",
      email: "goldie.legrand@test.com",
      password: "1234"
    };

    const result = await repository.create(user);

    expect(savedDocument).to.deep.equal(user);
    expect(result).to.include(user);
  });
});