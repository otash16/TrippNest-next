import { FaqCategory, FaqStatus } from '../../enums/faq.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../property/property';

export interface Faq1 {
	_id: string; // Change ObjectId to string if you're using a string type for MongoDB ObjectId
	faqCategory: FaqCategory;
	faqStatus: FaqStatus;
	faqTitle: string;
	faqContent: string;
	memberId: string; // Change ObjectId to string
	blockedAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	memberData?: Member;
}

export interface Faqs {
	list: Faq1[];
	metaCounter?: TotalCounter[];
}
