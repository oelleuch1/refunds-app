export interface IBaseUseCase<TRequest, TResponse> {
    execute(request: TRequest): Promise<TResponse>
}