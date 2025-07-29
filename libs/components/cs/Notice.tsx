import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';
import { NoticesInquiry } from '../../types/notice/notice.input';
import { T } from '../../types/common';
import { Notice1 } from '../../types/notice/notice';
import moment from 'moment';

interface NoticeProps {
	initialInput: NoticesInquiry;
}

const Notice = (props: NoticeProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [notices, setNotices] = useState<Notice1[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
	} = useQuery(GET_NOTICES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotices(data?.getNotices?.list);
		},
	});
	/** LIFECYCLES **/
	/** HANDLERS **/

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span>category</span>
						<span>title</span>
						<span>created on</span>
					</Box>
					<Stack className={'bottom'}>
						{notices.map((notice: Notice1) => (
							<div className={`notice-card `} key={notice.noticeTitle}>
								<span className={'notice-number'}>{notice.noticeCategory}</span>
								<span className={'notice-title'}>{notice.noticeTitle}</span>
								<span className={'notice-date'}>{moment(notice.createdAt).format('YYYY-MM-DD')}</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

Notice.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
	},
};

export default Notice;
