import { NoticeStatus } from '../../enums/notice.enum';

export interface NoticeUpdate {
	_id: string; // Simplified ObjectId to string for form handling
	noticeStatus?: NoticeStatus;
	noticeTitle?: string;
	blockedAt?: Date;
	deletedAt?: Date; // Changed to optional to match form handling conventions
}
