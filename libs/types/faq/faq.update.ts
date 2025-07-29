import { FaqStatus } from '../../enums/faq.enum';

export interface FaqUpdate {
	_id: string; // Change ObjectId to string if you're using a string type for MongoDB ObjectId
	faqStatus?: FaqStatus;
	faqTitle?: string;
	faqContent?: string;
	blockedAt?: Date;
	deletedAt: Date;
}
