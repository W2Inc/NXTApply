export type BoardingConditional = {
	age?: {
		min?: number;
		max?: number;
	};
};

export type ChallengeConditionals = {
	finishPoints?: number;
	duration?: {
		unit: 'minutes' | 'hours';
		value: number;
	};
};

export type ResultConditionals = {
	mode: 'all-pass' | 'all-fail' | 'points';
	points?: {
		operator: '>=' | '<=' | '==' | '<' | '>';
		value: number;
	};
};

export type WaitingConditional = {
	waitTime?: {
		unit: 'minutes' | 'hours' | 'endOfMonth';
		value?: number; // value is optional for 'endOfMonth'
	};
	genderComposition?: {
		includeAllGendersInFinalWeek: boolean;
		male?: number;    // percentage (0-100)
		female?: number;  // percentage (0-100)
		other?: number;   // percentage (0-100)
	};
};
