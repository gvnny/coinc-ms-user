import { ContainerModule, interfaces } from "inversify";

import { GetUserUseCase } from "../../business/usecases/getUserUseCase";
import { IGetUseCase } from "../../business/contracts/usecases/iGetUseCase";
import { IGetUserInput } from "../../business/usecases/input/iGetUserInput";
import { UserOutput } from "../../business/usecases/output/userOutput";
import { ICreateUseCase } from "../../business/contracts/usecases/iCreateUseCase";
import { CreateUserUseCase } from "../../business/usecases/createUserUseCase";
import { ICreateUserInput } from "../../business/usecases/input/iCreateUserInput";

export const UseCasesModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IGetUseCase<IGetUserInput, UserOutput>>(Symbol.for("IGetUseCase")).to(
    GetUserUseCase
  );
  bind<ICreateUseCase<ICreateUserInput, UserOutput>>(Symbol.for("ICreateUseCase")).to(
    CreateUserUseCase
  );
});
