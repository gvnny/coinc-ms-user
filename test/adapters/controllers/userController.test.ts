import "reflect-metadata";

import { ObjectId } from "bson";
import { APIGatewayProxyResult } from "aws-lambda";
import { UserController } from "./../../../src/adapters/controllers/userController";
import { IGetUseCase } from "./../../../src/business/contracts/usecases/iGetUseCase";
import { IGetUserInput } from "./../../../src/business/usecases/input/iGetUserInput";
import { UserOutput } from "./../../../src/business/usecases/output/userOutput";
import { UserNotFound, GetUserFailed } from "./../../../src/business/errors";
import { IUserEntity } from "./../../../src/entities/iUserEntity";
import { mock, when, instance } from "ts-mockito";

import * as E from "fp-ts/Either";
import { ICreateUserInput } from "../../../src/business/usecases/input/iCreateUserInput";
import { ICreateUseCase } from "../../../src/business/contracts/usecases/iCreateUseCase";

describe(UserController.name, () => {
  let getUserUseCaseMock: IGetUseCase<IGetUserInput, UserOutput>;
  let createUserUseCaseMock: ICreateUseCase<ICreateUserInput, UserOutput>;
  let userController: UserController;
  let userEntity: IUserEntity;
  let userOutput: UserOutput;
  let userInput: IGetUserInput;
  let result: APIGatewayProxyResult;
  let userId: string;

  beforeEach(() => {
    getUserUseCaseMock = mock<IGetUseCase<IGetUserInput, UserOutput>>();
    createUserUseCaseMock =
      mock<ICreateUseCase<ICreateUserInput, UserOutput>>();
    userController = new UserController(
      instance(getUserUseCaseMock),
      instance(createUserUseCaseMock)
    );
    userInput = { _id: "12345" };
    userId = "123456";
    userEntity = {
      _id: new ObjectId(123456),
      name: "Test",
      lastName: "Test",
      email: "test@test.com",
      password: "123456",
    };

    userOutput = E.right(userEntity);
  });

  describe("When success", () => {
    it("should return a user when found", async () => {
      when(getUserUseCaseMock.exec(userInput)).thenResolve(userOutput);
      result = await userController.getUser(userInput);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(JSON.stringify(userEntity));
    });
  });

  describe("When error", () => {
    it("should return UserNotFound when user is not found", async () => {
      when(getUserUseCaseMock.exec(userInput)).thenResolve(
        E.left(UserNotFound)
      );

      result = await userController.getUser(userInput);
      expect(result.statusCode).toBe(404);
      expect(result.body).toEqual(JSON.stringify({ error: UserNotFound }));
    });

    it("should return GetUserFailed when error is thown", async () => {
      when(getUserUseCaseMock.exec(userInput)).thenResolve(
        E.left(GetUserFailed)
      );

      result = await userController.getUser(userInput);
      console.log(E.left(GetUserFailed));
      expect(result.statusCode).toEqual(404);
      expect(result.body).toEqual(JSON.stringify({ error: GetUserFailed }));
    });
  });

  describe("When create User", () => {
    it("should return a user when created", async () => {
      const createUserInput: ICreateUserInput = {
       name: "Test",
        lastName: "Test",
        email: "test@test.com",
        password: "123456",
      };
      when(createUserUseCaseMock.exec(createUserInput)).thenResolve(userOutput);
      result = await userController.createUser(createUserInput);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(JSON.stringify(userEntity));
    });
  });

  describe("When error", () => {
    it("should return CreateUserFailed when error is thown", async () => {
      const createUserInput: ICreateUserInput = {
       name: "Test",
        lastName: "Test",
        email: "test@test.com",
        password: "123456",
      };
      when(createUserUseCaseMock.exec(createUserInput)).thenResolve(
        E.left(GetUserFailed)
      );
      result = await userController.createUser(createUserInput);
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual(JSON.stringify({ error: GetUserFailed }));
    });
  });
});
