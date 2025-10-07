/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvalidInputError } from "@infra/errors"
import { ZodSchema } from "zod"

export abstract class BaseUseCase<InputType, OutputType, ErrorType extends Error> {
  constructor(
    private ErrorType: new (...args: any[]) => ErrorType,
    private errorMessage?: string,
    private schema?: ZodSchema<any>
  ) {}

  protected abstract action(
    idOrInput: InputType | number | string,
    additionalData?: any
  ): Promise<OutputType | InvalidInputError | ErrorType>

  async execute(
    idOrInput: InputType | number | string,
    additionalData?: InputType
  ): Promise<OutputType | InvalidInputError | ErrorType> {
    let input = idOrInput

    if (additionalData) {
      input = additionalData
    }

    if (this.schema) {
      const validation = this.schema.safeParse(input)
      if (!validation.success) {
        const errorMessage = validation.error.issues.map((issue) => `${issue.message}`).join("; ")

        return new InvalidInputError(errorMessage)
      }
    }

    try {
      if (additionalData) {
        return this.action(idOrInput, input)
      }

      return this.action(input)
    } catch (error: any) {
      let message = error?.message ?? this.errorMessage

      if (typeof message === "object") {
        message = JSON.stringify(message, null, 2)
      }

      return new this.ErrorType(message)
    }
  }
}
