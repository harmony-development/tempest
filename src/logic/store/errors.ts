import { Store } from "./store";

interface IErrorState {
	errors: string[]
}

export class ErrorState extends Store<IErrorState> {
	handleError(error: any) {
		this.state.errors.push(error.message || error);
	}
}

export const errorState = new ErrorState({
	errors: [],
});
