export class Response {
	constructor(
		public content: any,
		public count: number,
		public code: number,
		public errorMessage?: string
	) {}
}
