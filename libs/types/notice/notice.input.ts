import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';

export interface NoticeInput {
	noticeCategory: NoticeCategory;
	noticeTitle: string;
	memberId?: string;
}

export interface NoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
}

interface ANISearch {
	noticeStatus?: NoticeStatus;
	noticeCategory?: NoticeCategory;
	text?: string;
}

export interface AllNoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ANISearch;
}
