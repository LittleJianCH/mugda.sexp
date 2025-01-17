import { Span } from "../span"
import { LangError } from "./LangError"

export class TerminationError extends LangError {
  constructor(public message: string, public span: Span) {
    super(message)
  }

  report(text: string): string {
    return [this.message + "\n", this.span.report(text)].join("\n")
  }
}
