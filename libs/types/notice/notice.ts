import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../property/property';

export interface Notice1 {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTitle: string;
	memberId: string;
	blockedAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	memberData?: Member;
}

export interface Notices {
	list: Notice1[];
	metaCounter: TotalCounter[];
}
