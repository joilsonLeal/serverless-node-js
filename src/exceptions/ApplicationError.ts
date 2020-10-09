export default class ApplicationError extends Error {
    status: number
    constructor(message: string, status?: number) {
      super(message)
      this.status = status ?? 500
    }
  }
  