import { Direction } from '../../enums/common.enum';
import { FaqCategory, FaqStatus } from '../../enums/faq.enum';

export interface FaqInput {
	faqCategory: FaqCategory;
	faqTitle: string;
	faqContent: string;
	memberId?: string; // Change ObjectId to string if you're using a string type for MongoDB ObjectId
}

export interface FaqsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
}

export interface AFISearch {
	faqStatus?: FaqStatus;
	faqCategory?: FaqCategory;
	text?: string;
}

export interface AllFaqsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AFISearch;
}
